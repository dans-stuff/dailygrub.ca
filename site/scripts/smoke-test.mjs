#!/usr/bin/env node
// Invariants on the assembled public/deals.json. Exits non-zero on failure.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const siteRoot = new URL('..', import.meta.url).pathname;
const data = JSON.parse(readFileSync(join(siteRoot, 'public/deals.json'), 'utf8'));

const fails = [];
const check = (cond, msg) => { if (!cond) fails.push(msg); };

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

check(data?.cities, 'must have cities object');
check(Object.keys(data.cities).length > 0, 'must have at least one city');

let restaurantCount = 0;
let dealCount = 0;
for (const [slug, city] of Object.entries(data.cities)) {
  check(/^[a-z0-9-]+$/.test(slug), `city slug ${slug}: kebab-case`);
  check(city.name && /^[A-Z]{2}$/.test(city.province), `${slug}: name/province`);
  check(Array.isArray(city.restaurants), `${slug}: restaurants array`);

  const namesInCity = new Set();
  for (const r of city.restaurants) {
    check(r.name, `${slug}: restaurant missing name`);
    check(!namesInCity.has(r.name), `${slug}: duplicate restaurant "${r.name}"`);
    namesInCity.add(r.name);
    check(['sponsored', 'exclusive', 'local', 'chain'].includes(r.type), `${slug}/${r.name}: bad type`);
    check(Array.isArray(r.deals) && r.deals.length > 0, `${slug}/${r.name}: needs deals`);
    restaurantCount++;

    const titlesInRestaurant = new Set();
    for (const d of r.deals) {
      check(d.title, `${slug}/${r.name}: deal missing title`);
      check(d.description, `${slug}/${r.name}/${d.title}: description`);
      check(['food', 'drink', 'both'].includes(d.type), `${slug}/${r.name}/${d.title}: deal type`);
      check(!titlesInRestaurant.has(d.title), `${slug}/${r.name}: duplicate title "${d.title}"`);
      titlesInRestaurant.add(d.title);
      if (d.days !== undefined)
        check(Array.isArray(d.days) && d.days.every((x) => DAYS.includes(x)),
          `${slug}/${r.name}/${d.title}: days must be Monday..Sunday`);
      dealCount++;
    }
  }
}

if (fails.length) {
  console.error(`✗ ${fails.length} smoke-test failure(s):`);
  for (const f of fails) console.error('  ' + f);
  process.exit(1);
}
console.log(`✓ smoke-test passed: ${Object.keys(data.cities).length} cities, ${restaurantCount} restaurants, ${dealCount} deals`);
