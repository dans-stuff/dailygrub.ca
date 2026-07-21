import { describe, expect, it } from 'vitest';
import YAML from 'yaml';
import { createRestaurantYaml, mergeRestaurantYaml } from '../src/yamlgen';
import type { ExtractedTip } from '../src/types';

const tip: ExtractedTip = {
  confident: true,
  restaurant_name: 'The Slice',
  city_slug: 'lethbridge',
  address: '517 4 Ave S',
  website: 'https://theslice.ca',
  deals: [
    {
      title: 'Wing Wednesday',
      description: 'Half-price wings all day. Dine-in only.',
      type: 'food',
      days: ['Wednesday'],
      startHour: 17,
      endHour: 21,
    },
  ],
};

const existingYaml = `# Hand-written comment that must survive merges.
name: The Slice
type: local
website: https://theslice.ca
cities:
  lethbridge:
    address: 517 4 Ave S
deals:
  - title: Happy Hour
    description: $2 off all drinks.
    type: drink
    days: [Monday, Friday]
`;

describe('createRestaurantYaml', () => {
  it('emits the template shape', () => {
    const parsed = YAML.parse(createRestaurantYaml(tip));
    expect(parsed).toEqual({
      name: 'The Slice',
      type: 'local',
      website: 'https://theslice.ca',
      cities: { lethbridge: { address: '517 4 Ave S' } },
      deals: [
        {
          title: 'Wing Wednesday',
          description: 'Half-price wings all day. Dine-in only.',
          type: 'food',
          days: ['Wednesday'],
          startHour: 17,
          endHour: 21,
        },
      ],
    });
  });

  it('uses an empty mapping when there is no address', () => {
    const parsed = YAML.parse(createRestaurantYaml({ ...tip, address: undefined, website: undefined }));
    expect(parsed.cities).toEqual({ lethbridge: {} });
    expect(parsed).not.toHaveProperty('website');
  });
});

describe('mergeRestaurantYaml', () => {
  it('appends a new deal and preserves comments', () => {
    const result = mergeRestaurantYaml(existingYaml, tip);
    expect(result).not.toBeNull();
    expect(result!.yaml).toContain('Hand-written comment');
    const parsed = YAML.parse(result!.yaml);
    expect(parsed.deals.map((d: { title: string }) => d.title)).toEqual([
      'Happy Hour',
      'Wing Wednesday',
    ]);
    expect(result!.addedCity).toBe(false);
  });

  it('adds a new city without touching existing addresses', () => {
    const result = mergeRestaurantYaml(existingYaml, {
      ...tip,
      city_slug: 'red-deer',
      address: '123 Gaetz Ave',
    });
    const parsed = YAML.parse(result!.yaml);
    expect(parsed.cities.lethbridge.address).toBe('517 4 Ave S');
    expect(parsed.cities['red-deer'].address).toBe('123 Gaetz Ave');
    expect(result!.addedCity).toBe(true);
  });

  it('dedupes deals by normalized title', () => {
    const result = mergeRestaurantYaml(existingYaml, {
      ...tip,
      deals: [{ title: 'HAPPY HOUR!', description: 'dupe', type: 'drink' }],
    });
    expect(result).toBeNull();
  });
});
