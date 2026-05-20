#!/usr/bin/env node
// Assemble public/deals.json from restaurants/*.yaml + cities.yaml.
// Output also ships as a static asset at dailygrub.ca/deals.json (ODbL 1.0).
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

const siteRoot = new URL('..', import.meta.url).pathname;
const repoRoot = new URL('../..', import.meta.url).pathname;
const restaurantsDir = join(repoRoot, 'restaurants');
const citiesFile = join(repoRoot, 'cities.yaml');
const outFile = join(siteRoot, 'public', 'deals.json');

const cities = YAML.parse(readFileSync(citiesFile, 'utf8'));
const restaurantFiles = readdirSync(restaurantsDir)
  .filter((f) => f.endsWith('.yaml') && !f.startsWith('_'))
  .sort();

const out = { cities: {} };
for (const [slug, meta] of Object.entries(cities)) {
  out.cities[slug] = { ...meta, restaurants: [] };
}

let restaurantCount = 0;
let dealCount = 0;
for (const f of restaurantFiles) {
  const r = YAML.parse(readFileSync(join(restaurantsDir, f), 'utf8'));
  for (const [citySlug, override] of Object.entries(r.cities || {})) {
    if (!out.cities[citySlug]) continue;
    out.cities[citySlug].restaurants.push({
      name: r.name,
      type: r.type,
      ...(override?.address ? { address: override.address } : {}),
      ...(r.website ? { website: r.website } : {}),
      deals: r.deals ?? [],
    });
    restaurantCount++;
    dealCount += (r.deals ?? []).length;
  }
}

for (const city of Object.values(out.cities)) {
  city.restaurants.sort((a, b) => a.name.localeCompare(b.name));
}

if (!existsSync(join(siteRoot, 'public'))) mkdirSync(join(siteRoot, 'public'), { recursive: true });
writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
console.log(
  `built public/deals.json: ${Object.keys(out.cities).length} cities, ${restaurantCount} restaurant entries, ${dealCount} deals`
);
