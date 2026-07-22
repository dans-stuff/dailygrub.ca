#!/usr/bin/env node
// Validates cities.yaml + restaurants/*.yaml. Zero non-yaml deps.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

const repoRoot = new URL('../..', import.meta.url).pathname;
const restaurantsDir = join(repoRoot, 'restaurants');
const citiesFile = join(repoRoot, 'cities.yaml');

const RESTAURANT_TYPES = new Set(['sponsored', 'exclusive', 'local', 'chain']);
const DEAL_TYPES = new Set(['food', 'drink', 'both']);
const DAY_NAMES = new Set(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

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
  if (meta?.population !== undefined && (!Number.isInteger(meta.population) || meta.population < 1000))
    err('cities.yaml', `${slug}: population must be an integer >= 1000`);
}

const citiesWithRestaurants = new Set();

const seenSlugs = new Set();
for (const f of readdirSync(restaurantsDir).filter((x) => x.endsWith('.yaml') && !x.startsWith('_'))) {
  const file = join('restaurants', f);
  let r;
  try {
    r = YAML.parse(readFileSync(join(restaurantsDir, f), 'utf8'));
  } catch (e) {
    err(file, e.message);
    continue;
  }
  const slug = f.replace(/\.yaml$/, '');
  if (!SLUG_RE.test(slug)) err(file, 'filename must be kebab-case slug');
  if (seenSlugs.has(slug)) err(file, `duplicate restaurant ${slug}`);
  seenSlugs.add(slug);

  if (!r.name) err(file, 'name required');
  if (!RESTAURANT_TYPES.has(r.type))
    err(file, `type must be sponsored|exclusive|local|chain`);
  if (r.website !== undefined && !/^https?:\/\//.test(r.website))
    err(file, 'website must be http(s) URL');

  if (!r.cities || typeof r.cities !== 'object' || Object.keys(r.cities).length === 0)
    err(file, 'cities map required (at least one city)');
  else
    for (const [citySlug, entry] of Object.entries(r.cities)) {
      if (!cities[citySlug]) err(file, `unknown city "${citySlug}" (add it to cities.yaml first)`);
      else citiesWithRestaurants.add(citySlug);
      if (entry !== null && entry !== undefined && typeof entry !== 'object')
        err(file, `cities.${citySlug} must be a mapping`);
      if (entry?.address !== undefined && typeof entry.address !== 'string')
        err(file, `cities.${citySlug}.address must be a string`);
    }

  if (!Array.isArray(r.deals) || r.deals.length === 0) {
    err(file, 'deals must be a non-empty list');
  } else {
    r.deals.forEach((d, i) => {
      const w = `deal[${i}]${d?.title ? ` "${d.title}"` : ''}`;
      if (!d.title) err(file, `${w}: title required`);
      if (!d.description) err(file, `${w}: description required`);
      if (!DEAL_TYPES.has(d.type)) err(file, `${w}: type must be food|drink|both`);
      if (d.days !== undefined) {
        if (!Array.isArray(d.days) || d.days.length === 0)
          err(file, `${w}: days must be a non-empty list (or omit for all week)`);
        else for (const day of d.days)
          if (!DAY_NAMES.has(day)) err(file, `${w}: invalid day "${day}" (use Monday-Sunday)`);
      }
      for (const k of ['startHour', 'endHour']) {
        if (d[k] !== undefined && (!Number.isInteger(d[k]) || d[k] < 0 || d[k] > 23))
          err(file, `${w}: ${k} must be 0-23`);
      }
    });
  }
}

// Coverage gating needs a denominator: any city that has restaurants must
// carry a population figure in cities.yaml.
for (const slug of citiesWithRestaurants) {
  if (cities[slug]?.population === undefined)
    err('cities.yaml', `${slug}: population required (city has restaurants; used for coverage gating)`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} validation error(s):`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`✓ valid: ${Object.keys(cities).length} cities, ${seenSlugs.size} restaurants`);
