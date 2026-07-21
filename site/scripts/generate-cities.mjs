#!/usr/bin/env node
// Merges every Canadian municipality in Daily Grub's size range into cities.yaml.
//
// Sources (2021 Census of Population, Statistics Canada):
//   Population: table 98-10-0004-01 — https://www150.statcan.gc.ca/n1/tbl/csv/98100004-eng.zip
//   CSD types:  Geographic Attribute File 92-151-X —
//     https://www12.statcan.gc.ca/census-recensement/2021/geo/aip-pia/attribute-attribs/files-fichiers/2021_92-151_X.zip
//
// Usage: node scripts/generate-cities.mjs <98100004.csv> <2021_92-151_X.csv>
//
// Rules:
//   - Population 15,000–150,000 (2021 counts; matches the existing roster's range).
//   - Municipal CSD types only: CY, V, T, C, TV, DM, MU, RGM, MRM, MÉ, SM.
//     Rural types (TP, MD, RM, SC, RDA, reserves, unorganized areas) are excluded.
//   - Existing cities.yaml entries are preserved verbatim; matching candidates are skipped.
//   - Slug collisions: larger population keeps the bare slug; smaller gets -<prov>, then -<prov>-N.
// Output: rewrites cities.yaml sorted by slug. Deterministic for fixed inputs.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

const [popCsvPath, attrCsvPath] = process.argv.slice(2);
if (!popCsvPath || !attrCsvPath) {
  console.error('usage: node scripts/generate-cities.mjs <98100004.csv> <2021_92-151_X.csv>');
  process.exit(1);
}

const MIN_POP = 15000;
const MAX_POP = 150000;
const INCLUDE_TYPES = new Set(['CY', 'V', 'T', 'C', 'TV', 'DM', 'MU', 'RGM', 'MRM', 'MÉ', 'SM']);
// Wood Buffalo (SM) is listed as fort-mcmurray; Lloydminster's AB/SK "(Part)" rows
// are listed whole under lloydminster.
const EXCLUDE_DGUIDS = new Set(['2021A00054816037']); // Wood Buffalo
const PROVINCE_BY_PRUID = {
  10: 'NL', 11: 'PE', 12: 'NS', 13: 'NB', 24: 'QC', 35: 'ON',
  46: 'MB', 47: 'SK', 48: 'AB', 59: 'BC', 60: 'YT', 61: 'NT', 62: 'NU',
};

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (field !== '' || row.length) { row.push(field); rows.push(row); row = []; field = ''; }
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const slugify = (name) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normName = (name) => slugify(name).replace(/-/g, ' ');

// Population by CSD DGUID (schema 2021A0005).
const popByDguid = new Map();
for (const r of parseCsv(readFileSync(popCsvPath, 'utf8')).slice(1)) {
  if (r[2]?.startsWith('2021A0005')) popByDguid.set(r[2], Number(r[4]));
}

// One row per CSD from the DA-level attribute file (latin1 encoding).
const candidates = [];
const seenDguids = new Set();
for (const r of parseCsv(readFileSync(attrCsvPath, 'latin1')).slice(1)) {
  const [pruid, dguid, name, type] = [r[0], r[15], r[16], r[17]];
  if (!dguid || seenDguids.has(dguid)) continue;
  seenDguids.add(dguid);
  if (!INCLUDE_TYPES.has(type) || EXCLUDE_DGUIDS.has(dguid)) continue;
  if (name.includes('(Part)')) continue;
  const pop = popByDguid.get(dguid);
  if (pop === undefined || pop < MIN_POP || pop > MAX_POP) continue;
  const province = PROVINCE_BY_PRUID[Number(pruid)];
  if (!province) continue;
  candidates.push({ name, province, pop, type });
}

// Same name twice in one province (e.g. Langley DM + Langley CY in BC): label
// each with its municipal type so the site can tell them apart.
const TYPE_LABELS = { CY: 'City', DM: 'District', T: 'Town', V: 'Ville' };
const nameCounts = new Map();
for (const c of candidates) {
  const key = `${normName(c.name)}|${c.province}`;
  nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1);
}
for (const c of candidates) {
  if (nameCounts.get(`${normName(c.name)}|${c.province}`) > 1) {
    c.name = `${c.name} (${TYPE_LABELS[c.type] ?? c.type})`;
  }
}

const repoRoot = new URL('../..', import.meta.url).pathname;
const citiesFile = join(repoRoot, 'cities.yaml');
const existing = YAML.parse(readFileSync(citiesFile, 'utf8'));
const existingByName = new Set(
  Object.values(existing).map((c) => `${normName(c.name)}|${c.province}`),
);

const merged = { ...existing };
let added = 0, skippedExisting = 0;
candidates.sort((a, b) => b.pop - a.pop || a.name.localeCompare(b.name));
for (const { name, province } of candidates) {
  if (existingByName.has(`${normName(name)}|${province}`)) { skippedExisting++; continue; }
  let slug = slugify(name);
  if (!slug) continue;
  if (merged[slug]) {
    slug = `${slug}-${province.toLowerCase()}`;
    for (let n = 2; merged[slug]; n++) slug = `${slugify(name)}-${province.toLowerCase()}-${n}`;
  }
  merged[slug] = { name, province };
  added++;
}

const sorted = Object.fromEntries(Object.entries(merged).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(citiesFile, YAML.stringify(sorted));
console.log(
  `cities.yaml: ${Object.keys(existing).length} existing kept, ${added} added, ` +
    `${skippedExisting} candidates already present, ${Object.keys(sorted).length} total`,
);
