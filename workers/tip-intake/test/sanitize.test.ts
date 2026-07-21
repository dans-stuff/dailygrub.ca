import { describe, expect, it } from 'vitest';
import { maskEmail, sanitizeForPrBody } from '../src/sanitize';
import { validateTip } from '../src/extract';

describe('sanitizeForPrBody', () => {
  it('neutralizes backticks and @-mentions', () => {
    const out = sanitizeForPrBody('hey ```@octocat``` check this');
    expect(out).not.toContain('`');
    expect(out).not.toContain('@octocat');
  });

  it('truncates long text', () => {
    expect(sanitizeForPrBody('x'.repeat(5000))).toContain('[truncated]');
  });
});

describe('maskEmail', () => {
  it('masks the local part', () => {
    expect(maskEmail('tipster@gmail.com')).toBe('ti***@gmail.com');
    expect(maskEmail('garbage')).toBe('***');
  });
});

describe('validateTip', () => {
  const cities = ['lethbridge', 'kelowna'];

  it('accepts a valid tip and drops invalid deals', () => {
    const tip = validateTip(
      {
        confident: true,
        restaurant_name: 'The Slice',
        city_slug: 'lethbridge',
        deals: [
          { title: 'Wings', description: 'Half price', type: 'food', days: ['Wednesday', 'Blursday'], startHour: 17, endHour: 25 },
          { title: '', description: 'missing title', type: 'food' },
          { title: 'Bad type', description: 'x', type: 'snacks' },
        ],
      },
      cities,
    );
    expect(tip).not.toBeNull();
    expect(tip!.deals).toHaveLength(1);
    expect(tip!.deals[0]).toEqual({
      title: 'Wings',
      description: 'Half price',
      type: 'food',
      days: ['Wednesday'],
      startHour: 17,
    });
  });

  it('rejects unknown cities and missing names', () => {
    const base = {
      confident: true,
      restaurant_name: 'X',
      deals: [{ title: 'a', description: 'b', type: 'food' }],
    };
    expect(validateTip({ ...base, city_slug: 'calgary' }, cities)).toBeNull();
    expect(validateTip({ ...base, restaurant_name: '', city_slug: 'kelowna' }, cities)).toBeNull();
  });

  it('rejects tips with zero surviving deals', () => {
    expect(
      validateTip(
        { confident: true, restaurant_name: 'X', city_slug: 'kelowna', deals: [] },
        cities,
      ),
    ).toBeNull();
  });
});
