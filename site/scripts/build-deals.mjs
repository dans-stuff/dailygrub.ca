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

// Coverage estimate: assume ~1 deal-serving restaurant per 1,000 residents
// (populations: 2021 Census 98-10-0004-01 for municipalities; City of Calgary
// community profiles, approximate, for Calgary districts). A city is "active"
// (promoted on the homepage) once it has deals AND at least 5% estimated
// coverage. Below that, the data stays in this file — the open dataset never
// shrinks — but the city isn't promoted as browsable until coverage improves.
const RESTAURANTS_PER_1000_RESIDENTS = 1;
const MIN_COVERAGE = 0.05;
for (const city of Object.values(out.cities)) {
  city.restaurants.sort((a, b) => a.name.localeCompare(b.name));
  const deals = city.restaurants.reduce((s, r) => s + r.deals.length, 0);
  if (city.population && city.restaurants.length > 0) {
    const estTotal = (city.population / 1000) * RESTAURANTS_PER_1000_RESIDENTS;
    city.coverage = Math.round((city.restaurants.length / estTotal) * 1000) / 1000;
    city.active = deals > 0 && city.coverage >= MIN_COVERAGE;
  } else {
    city.active = false;
  }
}

if (!existsSync(join(siteRoot, 'public'))) mkdirSync(join(siteRoot, 'public'), { recursive: true });
writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
console.log(
  `built public/deals.json: ${Object.keys(out.cities).length} cities, ${restaurantCount} restaurant entries, ${dealCount} deals`
);
