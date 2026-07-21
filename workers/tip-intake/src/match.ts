import { SLUG_RE } from './types';

// Lowercase, drop punctuation, collapse whitespace, drop a leading "the" so
// "The Slice", "the-slice" and "Slice" all normalize identically.
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^the /, '');
}

export function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return SLUG_RE.test(slug) ? slug : '';
}

export interface RestaurantMatch {
  mode: 'create' | 'update';
  slug: string;
}

// existingSlugs = filenames (minus .yaml) currently in restaurants/ on main.
export function matchRestaurant(
  restaurantName: string,
  existingSlugs: string[],
  citySlug: string,
): RestaurantMatch | null {
  const target = normalizeName(restaurantName);
  if (!target) return null;

  const existing = existingSlugs.find((slug) => normalizeName(slug) === target);
  if (existing) return { mode: 'update', slug: existing };

  let slug = slugify(restaurantName);
  if (!slug) return null;
  // Same slug but a different normalized name (e.g. "Montanas" vs "Montana's")
  // would collide on the filename — disambiguate with the city.
  if (existingSlugs.includes(slug)) slug = `${slug}-${citySlug}`;
  if (existingSlugs.includes(slug) || !SLUG_RE.test(slug)) return null;
  return { mode: 'create', slug };
}
