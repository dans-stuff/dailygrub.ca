import { describe, expect, it } from 'vitest';
import { matchRestaurant, normalizeName, slugify } from '../src/match';

describe('normalizeName', () => {
  it('treats display names and slugs alike', () => {
    expect(normalizeName('The Slice')).toBe(normalizeName('the-slice'));
    expect(normalizeName("Montana's BBQ & Bar")).toBe('montanas bbq bar');
    expect(normalizeName('  Browns   Socialhouse ')).toBe('browns socialhouse');
  });
});

describe('slugify', () => {
  it('produces valid kebab-case slugs', () => {
    expect(slugify("Montana's BBQ & Bar")).toBe('montanas-bbq-bar');
    expect(slugify('The Slice')).toBe('the-slice');
    expect(slugify('!!!')).toBe('');
  });
});

describe('matchRestaurant', () => {
  const slugs = ['the-slice', 'browns-socialhouse'];

  it('matches an existing restaurant regardless of formatting', () => {
    expect(matchRestaurant('The SLICE', slugs, 'lethbridge')).toEqual({
      mode: 'update',
      slug: 'the-slice',
    });
    expect(matchRestaurant('Slice', slugs, 'lethbridge')).toEqual({
      mode: 'update',
      slug: 'the-slice',
    });
  });

  it('creates a new slug for unknown restaurants', () => {
    expect(matchRestaurant('Pita Pit', slugs, 'kelowna')).toEqual({
      mode: 'create',
      slug: 'pita-pit',
    });
  });

  it('rejects unusable names', () => {
    expect(matchRestaurant('!!!', slugs, 'kelowna')).toBeNull();
  });
});
