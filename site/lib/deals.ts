// Build-time data layer. Reads public/deals.json (assembled by scripts/build-deals.mjs
// from restaurants/*.yaml + cities.yaml). Also served at dailygrub.ca/deals.json (ODbL 1.0).
import dealsJson from '@/public/deals.json';

export type DealItemType = 'food' | 'drink' | 'both';
export type RestaurantType = 'sponsored' | 'exclusive' | 'local' | 'chain';
export type DayName = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface Deal {
  title: string;
  description: string;
  type: DealItemType;
  days?: DayName[];        // omit = all week
  startHour?: number;
  endHour?: number;
}

export interface EnhancedDeal extends Deal {
  isSingleDay: boolean;
  isDaySpecific: boolean;
  timeInfo: string | null;
}

export interface Restaurant {
  name: string;
  type: RestaurantType;
  address?: string;
  website?: string;
  deals: Deal[];
}

export interface City {
  name: string;
  province: string;
  website?: string;
  restaurants: Restaurant[];
}

export interface DealsData {
  cities: { [citySlug: string]: City };
}

const DAY_NAMES: DayName[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const PROVINCE_NAMES: Record<string, string> = {
  AB: 'Alberta', BC: 'British Columbia', SK: 'Saskatchewan', MB: 'Manitoba',
  ON: 'Ontario', QC: 'Quebec', NS: 'Nova Scotia', NB: 'New Brunswick',
  NL: 'Newfoundland and Labrador', PE: 'Prince Edward Island',
  NT: 'Northwest Territories', YT: 'Yukon', NU: 'Nunavut',
};

const dealsData = dealsJson as DealsData;

export function getCities() {
  return Object.entries(dealsData.cities).map(([slug, city]) => ({
    slug,
    name: city.name,
    province: city.province,
    dealCount: city.restaurants.reduce((s, r) => s + r.deals.length, 0),
  }));
}

export function getCity(citySlug: string): City | null {
  return dealsData.cities[citySlug] ?? null;
}

// Alberta time; close enough for all current cities and won't surprise BC users.
export function getCurrentTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Edmonton' }));
}

export function isDealActive(deal: Deal, date: Date): boolean {
  if (!deal.days || deal.days.length === 0) return true;
  return deal.days.includes(DAY_NAMES[date.getDay()]);
}

function enhanceDeal(deal: Deal): EnhancedDeal {
  const n = deal.days?.length ?? 0;
  const isSingleDay = n === 1;
  const isDaySpecific = n > 0 && n < 7;
  let timeInfo: string | null = null;
  if (deal.startHour !== undefined && deal.endHour !== undefined)
    timeInfo = `${formatHour(deal.startHour)}-${formatHour(deal.endHour)}`;
  else if (deal.startHour !== undefined) timeInfo = `${formatHour(deal.startHour)}+`;
  return { ...deal, isSingleDay, isDaySpecific, timeInfo };
}

// Sort key — lower sorts first. Premium types first, then single-day before multi-day,
// then local before chain, then alphabetical by restaurant.
const TYPE_RANK: Record<RestaurantType, number> = { sponsored: 0, exclusive: 1, local: 2, chain: 3 };
function sortKey(r: Restaurant, d: EnhancedDeal): [number, number, number, string] {
  const premium = r.type === 'sponsored' || r.type === 'exclusive' ? 0 : 1;
  const daySpec = d.isSingleDay ? 0 : d.isDaySpecific ? 1 : 2;
  return [premium, daySpec, TYPE_RANK[r.type], r.name.toLowerCase()];
}

export function getDealsGroupedByRestaurant(
  citySlug: string,
  date: Date = getCurrentTime(),
  showAll = false,
): Array<{ restaurant: Restaurant; activeDeals: EnhancedDeal[] }> {
  const city = getCity(citySlug);
  if (!city) return [];
  const rows: Array<{ restaurant: Restaurant; deal: EnhancedDeal }> = [];
  for (const r of city.restaurants)
    for (const d of r.deals)
      if (showAll || isDealActive(d, date)) rows.push({ restaurant: r, deal: enhanceDeal(d) });
  rows.sort((a, b) => {
    const ka = sortKey(a.restaurant, a.deal);
    const kb = sortKey(b.restaurant, b.deal);
    for (let i = 0; i < ka.length; i++) {
      if (ka[i] < kb[i]) return -1;
      if (ka[i] > kb[i]) return 1;
    }
    return 0;
  });
  return rows.map(({ restaurant, deal }) => ({ restaurant, activeDeals: [deal] }));
}

export function getDayName(d: number): DayName {
  return DAY_NAMES[d];
}

export function formatHour(h: number): string {
  if (h === 0) return '12:00 AM';
  if (h === 12) return '12:00 PM';
  return h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`;
}
