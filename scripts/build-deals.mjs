#!/usr/bin/env node
// Assembles data/deals.json from data/cities/**.
// Runs as `prebuild` so the site keeps consuming a single JSON at build time.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const citiesDir = join(root, 'cities');

const citySlugs = readdirSync(citiesDir).filter((n) =>
  statSync(join(citiesDir, n)).isDirectory()
);

const cities = {};
let restaurantCount = 0;
let dealCount = 0;

for (const slug of citySlugs.sort()) {
  const cityDir = join(citiesDir, slug);
  const meta = JSON.parse(readFileSync(join(cityDir, '_city.json'), 'utf8'));
  const restaurantFiles = readdirSync(cityDir)
    .filter((n) => n.endsWith('.json') && !n.startsWith('_'))
    .sort();
  const restaurants = restaurantFiles.map((f) =>
    JSON.parse(readFileSync(join(cityDir, f), 'utf8'))
  );
  cities[slug] = {
    name: meta.name,
    province: meta.province,
    ...(meta.website ? { website: meta.website } : {}),
    restaurants,
  };
  restaurantCount += restaurants.length;
  dealCount += restaurants.reduce((s, r) => s + r.deals.length, 0);
}

writeFileSync(
  join(root, 'data/deals.json'),
  JSON.stringify({ cities }, null, 2) + '\n'
);
console.log(
  `built data/deals.json: ${citySlugs.length} cities, ${restaurantCount} restaurants, ${dealCount} deals`
);
