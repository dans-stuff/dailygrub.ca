#!/usr/bin/env node
// Validates cities.yaml + restaurants/*.yaml.
// Zero non-yaml deps; runs in CI on every PR.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

const root = new URL('..', import.meta.url).pathname;
const restaurantsDir = join(root, 'restaurants');
const citiesFile = join(root, 'cities.yaml');

const RESTAURANT_TYPES = new Set(['sponsored', 'exclusive', 'local', 'chain']);
const DEAL_TYPES = new Set(['food', 'drink', 'both']);
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const errors = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);

const cities = YAML.parse(readFileSync(citiesFile, 'utf8'));
for (const [slug, meta] of Object.entries(cities)) {
  if (!SLUG_RE.test(slug)) err('cities.yaml', `invalid city slug "${slug}"`);
  if (!meta?.name) err('cities.yaml', `${slug}: name required`);
  if (!meta?.province || !/^[A-Z]{2}$/.test(meta.province))
    err('cities.yaml', `${slug}: province required (2-letter)`);
  if (meta?.website !== undefined && (typeof meta.website !== 'string' || !/^https?:\/\//.test(meta.website)))
    err('cities.yaml', `${slug}: website must be http(s) URL`);
}

const seenIds = new Set();
for (const f of readdirSync(restaurantsDir).filter((x) => x.endsWith('.yaml') && !x.startsWith('_'))) {
  const file = join('restaurants', f);
  let r;
  try {
    r = YAML.parse(readFileSync(join(restaurantsDir, f), 'utf8'));
  } catch (e) {
    err(file, e.message);
    continue;
  }
  const expectedId = f.replace(/\.yaml$/, '');
  if (!SLUG_RE.test(expectedId)) err(file, 'filename must be kebab-case slug');
  if (r.id !== expectedId) err(file, `id "${r.id}" must match filename`);
  if (seenIds.has(r.id)) err(file, `duplicate restaurant id ${r.id}`);
  seenIds.add(r.id);

  if (!r.name) err(file, 'name required');
  if (!RESTAURANT_TYPES.has(r.type))
    err(file, `type must be sponsored|exclusive|local|chain`);
  if (r.website !== undefined && !/^https?:\/\//.test(r.website))
    err(file, 'website must be http(s) URL');

  if (!r.cities || typeof r.cities !== 'object' || Object.keys(r.cities).length === 0)
    err(file, 'cities map required (at least one city)');
  else
    for (const [slug, entry] of Object.entries(r.cities)) {
      if (!cities[slug]) err(file, `unknown city "${slug}" (add it to cities.yaml first)`);
      if (entry !== null && entry !== undefined && typeof entry !== 'object')
        err(file, `cities.${slug} must be a mapping`);
      if (entry?.address !== undefined && typeof entry.address !== 'string')
        err(file, `cities.${slug}.address must be a string`);
    }

  if (!Array.isArray(r.deals) || r.deals.length === 0)
    err(file, 'deals must be a non-empty list');
  else {
    const dealIds = new Set();
    r.deals.forEach((d, i) => {
      const w = `deal[${i}]${d?.id ? ` "${d.id}"` : ''}`;
      if (typeof d.id !== 'string' || !SLUG_RE.test(d.id)) err(file, `${w}: invalid id`);
      else if (dealIds.has(d.id)) err(file, `${w}: duplicate within file`);
      else dealIds.add(d.id);
      if (!d.title) err(file, `${w}: title required`);
      if (!d.description) err(file, `${w}: description required`);
      if (!DEAL_TYPES.has(d.type)) err(file, `${w}: type must be food|drink|both`);
      if (d.dayOfWeek !== undefined) {
        if (!Number.isInteger(d.dayOfWeek) || d.dayOfWeek < 0 || d.dayOfWeek > 6)
          err(file, `${w}: dayOfWeek must be 0-6`);
        if (d.daysOfWeek !== undefined)
          err(file, `${w}: use dayOfWeek OR daysOfWeek, not both`);
      }
      if (d.daysOfWeek !== undefined) {
        if (!Array.isArray(d.daysOfWeek) || d.daysOfWeek.some((x) => !Number.isInteger(x) || x < 0 || x > 6))
          err(file, `${w}: daysOfWeek must be array of 0-6`);
      }
      for (const k of ['startHour', 'endHour']) {
        if (d[k] !== undefined && (!Number.isInteger(d[k]) || d[k] < 0 || d[k] > 23))
          err(file, `${w}: ${k} must be 0-23`);
      }
      const lv = d.lastVerified instanceof Date
        ? d.lastVerified.toISOString().slice(0, 10)
        : d.lastVerified;
      if (!lv || !DATE_RE.test(lv)) err(file, `${w}: lastVerified required (YYYY-MM-DD)`);
    });
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} validation error(s):`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`✓ valid: ${Object.keys(cities).length} cities, ${seenIds.size} restaurants`);
