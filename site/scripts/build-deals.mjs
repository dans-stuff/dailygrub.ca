#!/usr/bin/env node
// Assemble public/deals.json from restaurants/*.yaml + cities.yaml.
// Output lives in public/ so it ships as a static asset at dailygrub.ca/deals.json
// (CC BY-SA 4.0 — see LICENSE-DATA) and is consumed by lib/deals.ts at build time.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

// site/ contains the code; the data (restaurants/, cities.yaml) lives at repo root.
const siteRoot = new URL('..', import.meta.url).pathname;
const repoRoot = new URL('../..', import.meta.url).pathname;
const restaurantsDir = join(repoRoot, 'restaurants');
const citiesFile = join(repoRoot, 'cities.yaml');
const outFile = join(siteRoot, 'public', 'deals.json');

const cities = YAML.parse(readFileSync(citiesFile, 'utf8'));
const restaurantFiles = readdirSync(restaurantsDir)
  .filter((f) => f.endsWith('.yaml') && !f.startsWith('_'))
  .sort();

// Build cities -> { ...meta, restaurants: [...] }
const out = { cities: {} };
for (const [slug, meta] of Object.entries(cities)) {
  out.cities[slug] = { ...meta, restaurants: [] };
}

let restaurantCount = 0;
let dealCount = 0;
for (const f of restaurantFiles) {
  const r = YAML.parse(readFileSync(join(restaurantsDir, f), 'utf8'));
  for (const [citySlug, override] of Object.entries(r.cities || {})) {
    if (!out.cities[citySlug]) continue; // skip unknown city
    const entry = {
      id: r.id,
      name: r.name,
      type: r.type,
      ...(override?.address ? { address: override.address } : {}),
      ...(r.website ? { website: r.website } : {}),
      deals: r.deals,
    };
    out.cities[citySlug].restaurants.push(entry);
    restaurantCount++;
    dealCount += r.deals.length;
  }
}

// Sort restaurants within each city alphabetically for stable output
for (const city of Object.values(out.cities)) {
  city.restaurants.sort((a, b) => a.name.localeCompare(b.name));
}

if (!existsSync(join(siteRoot, 'public'))) mkdirSync(join(siteRoot, 'public'), { recursive: true });
writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
console.log(
  `built public/deals.json: ${Object.keys(out.cities).length} cities, ${restaurantCount} restaurant entries, ${dealCount} deals`
);
