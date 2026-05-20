#!/usr/bin/env node
// Validates every per-restaurant JSON under data/cities/**.
// Zero dependencies; runs in CI on every PR.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const citiesDir = join(root, 'cities');

const RESTAURANT_TYPES = new Set(['sponsored', 'exclusive', 'local', 'chain']);
const DEAL_TYPES = new Set(['food', 'drink', 'both']);
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const errors = [];
const seenRestaurantIds = new Map(); // citySlug -> Set(id)
const seenDealIds = new Set();

function err(file, msg) {
  errors.push(`${file}: ${msg}`);
}

function validateDeal(file, deal, idx) {
  const where = `deal[${idx}]${deal.id ? ` "${deal.id}"` : ''}`;
  if (typeof deal.id !== 'string' || !SLUG_RE.test(deal.id))
    err(file, `${where}: invalid id (kebab-case required)`);
  if (seenDealIds.has(deal.id)) err(file, `${where}: duplicate deal id across repo`);
  else if (deal.id) seenDealIds.add(deal.id);
  if (typeof deal.title !== 'string' || !deal.title) err(file, `${where}: title required`);
  if (typeof deal.description !== 'string' || !deal.description)
    err(file, `${where}: description required`);
  if (!DEAL_TYPES.has(deal.type)) err(file, `${where}: type must be food|drink|both`);
  if (deal.dayOfWeek !== undefined) {
    if (!Number.isInteger(deal.dayOfWeek) || deal.dayOfWeek < 0 || deal.dayOfWeek > 6)
      err(file, `${where}: dayOfWeek must be 0-6`);
    if (deal.daysOfWeek !== undefined)
      err(file, `${where}: use dayOfWeek OR daysOfWeek, not both`);
  }
  if (deal.daysOfWeek !== undefined) {
    if (!Array.isArray(deal.daysOfWeek) || deal.daysOfWeek.some((d) => !Number.isInteger(d) || d < 0 || d > 6))
      err(file, `${where}: daysOfWeek must be array of 0-6`);
  }
  for (const k of ['startHour', 'endHour']) {
    if (deal[k] !== undefined && (!Number.isInteger(deal[k]) || deal[k] < 0 || deal[k] > 23))
      err(file, `${where}: ${k} must be 0-23`);
  }
  if (!deal.lastVerified || !DATE_RE.test(deal.lastVerified))
    err(file, `${where}: lastVerified required (YYYY-MM-DD)`);
}

function validateRestaurant(file, citySlug, expectedId, r) {
  if (typeof r.id !== 'string' || !SLUG_RE.test(r.id))
    err(file, `invalid id "${r.id}" (kebab-case required)`);
  if (r.id !== expectedId)
    err(file, `id "${r.id}" must match filename "${expectedId}.json"`);
  const set = seenRestaurantIds.get(citySlug) ?? new Set();
  if (set.has(r.id)) err(file, `duplicate restaurant id within city: ${r.id}`);
  set.add(r.id);
  seenRestaurantIds.set(citySlug, set);
  if (typeof r.name !== 'string' || !r.name) err(file, `name required`);
  if (!RESTAURANT_TYPES.has(r.type))
    err(file, `type must be sponsored|exclusive|local|chain`);
  if (!Array.isArray(r.deals) || r.deals.length === 0)
    err(file, `deals must be a non-empty array`);
  else r.deals.forEach((d, i) => validateDeal(file, d, i));
}

const citySlugs = readdirSync(citiesDir).filter((n) =>
  statSync(join(citiesDir, n)).isDirectory()
);

for (const slug of citySlugs) {
  if (!SLUG_RE.test(slug)) errors.push(`data/cities/${slug}: invalid city slug`);
  const cityDir = join(citiesDir, slug);
  const cityFile = join(cityDir, '_city.json');
  let meta;
  try {
    meta = JSON.parse(readFileSync(cityFile, 'utf8'));
  } catch (e) {
    errors.push(`${cityFile}: ${e.message}`);
    continue;
  }
  if (!meta.name) err(cityFile, 'name required');
  if (!meta.province || !/^[A-Z]{2}$/.test(meta.province))
    err(cityFile, 'province required (2-letter code)');
  if (meta.website !== undefined && (typeof meta.website !== 'string' || !/^https?:\/\//.test(meta.website)))
    err(cityFile, 'website must be a full http(s) URL if provided');

  const restaurantFiles = readdirSync(cityDir).filter(
    (n) => n.endsWith('.json') && !n.startsWith('_')
  );
  if (restaurantFiles.length === 0) err(cityDir, 'city has no restaurants');
  for (const f of restaurantFiles) {
    const file = join(cityDir, f);
    const expectedId = f.replace(/\.json$/, '');
    if (!SLUG_RE.test(expectedId))
      err(file, 'filename must be kebab-case slug');
    let r;
    try {
      r = JSON.parse(readFileSync(file, 'utf8'));
    } catch (e) {
      err(file, e.message);
      continue;
    }
    validateRestaurant(file, slug, expectedId, r);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} validation error(s):`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
const totalRestaurants = [...seenRestaurantIds.values()].reduce((s, v) => s + v.size, 0);
console.log(
  `✓ valid: ${citySlugs.length} cities, ${totalRestaurants} restaurants, ${seenDealIds.size} deals`
);
