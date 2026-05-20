#!/usr/bin/env node
// Invariants on the assembled public/deals.json.
// Exits non-zero if any assertion fails; CI uses this to block bad PRs.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const siteRoot = new URL('..', import.meta.url).pathname;
const data = JSON.parse(readFileSync(join(siteRoot, 'public/deals.json'), 'utf8'));

const fails = [];
const check = (cond, msg) => { if (!cond) fails.push(msg); };

check(typeof data === 'object' && data && data.cities, 'top-level must have cities object');
check(Object.keys(data.cities).length > 0, 'must have at least one city');

const seenDealKey = new Set();
for (const [slug, city] of Object.entries(data.cities)) {
  check(/^[a-z0-9-]+$/.test(slug), `city slug ${slug}: kebab-case`);
  check(typeof city.name === 'string' && city.name, `${slug}: name`);
  check(/^[A-Z]{2}$/.test(city.province), `${slug}: province 2-letter`);
  check(Array.isArray(city.restaurants), `${slug}: restaurants array`);

  const restaurantIdsInCity = new Set();
  for (const r of city.restaurants) {
    check(typeof r.id === 'string' && r.id, `${slug}: restaurant missing id`);
    check(!restaurantIdsInCity.has(r.id), `${slug}: duplicate restaurant ${r.id}`);
    restaurantIdsInCity.add(r.id);
    check(['sponsored', 'exclusive', 'local', 'chain'].includes(r.type), `${slug}/${r.id}: bad type`);
    check(Array.isArray(r.deals) && r.deals.length > 0, `${slug}/${r.id}: needs deals`);
    for (const d of r.deals) {
      check(typeof d.id === 'string' && d.id, `${slug}/${r.id}: deal missing id`);
      check(typeof d.title === 'string' && d.title, `${slug}/${r.id}/${d.id}: title`);
      check(typeof d.description === 'string' && d.description, `${slug}/${r.id}/${d.id}: description`);
      check(['food', 'drink', 'both'].includes(d.type), `${slug}/${r.id}/${d.id}: deal type`);
      const key = `${slug}/${r.id}/${d.id}`;
      check(!seenDealKey.has(key), `duplicate deal key ${key}`);
      seenDealKey.add(key);
    }
  }
}

if (fails.length) {
  console.error(`✗ ${fails.length} smoke-test failure(s):`);
  for (const f of fails) console.error('  ' + f);
  process.exit(1);
}

const cityCount = Object.keys(data.cities).length;
const restaurantCount = Object.values(data.cities).reduce((s, c) => s + c.restaurants.length, 0);
console.log(`✓ smoke-test passed: ${cityCount} cities, ${restaurantCount} restaurant entries, ${seenDealKey.size} deals`);
