/**
 * Deals data layer for the static site.
 *
 * IMPORTANT: Runs at BUILD TIME only. Data is embedded in the JS bundle.
 *
 * Reads from data/deals.json (synced from Netlify Blob via `npm run sync`)
 *
 * See CLAUDE.md for architecture.
 */
import { Deal, Restaurant, DealsData, City, EnhancedDeal } from '@/types/deals';
import dealsJson from '@/data/deals.json';

const dealsData: DealsData = dealsJson as DealsData;

/**
 * Get all available cities
 */
export function getCities(): Array<{ slug: string; name: string; province: string; dealCount: number }> {
  return Object.entries(dealsData.cities).map(([slug, city]) => {
    const dealCount = city.restaurants.reduce((sum, restaurant) => {
      return sum + restaurant.deals.filter(deal => deal.isActive).length;
    }, 0);
    return {
      slug,
      name: city.name,
      province: city.province,
      dealCount
    };
  });
}

/**
 * Get city data by slug
 */
export function getCity(citySlug: string): City | null {
  return dealsData.cities[citySlug] || null;
}

/**
 * Get current date/time in Mountain Time (America/Edmonton)
 * Used for Alberta cities: Lethbridge, Calgary, etc.
 */
export function getCurrentTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Edmonton' }));
}

// Backwards compatibility alias
export const getLethbridgeTime = getCurrentTime;

/**
 * Check if a deal is active for the given day (ignores time)
 */
export function isDealActive(deal: Deal, date: Date): boolean {
  if (!deal.isActive) return false;

  const dayOfWeek = date.getDay(); // 0-6

  // Check if deal is valid for the day
  if (deal.dayOfWeek !== undefined) {
    // Single day deal
    return deal.dayOfWeek === dayOfWeek;
  } else if (deal.daysOfWeek && deal.daysOfWeek.length > 0) {
    // Multi-day deal
    return deal.daysOfWeek.includes(dayOfWeek);
  }

  // No day restriction, available all days
  return true;
}

/**
 * Get all active deals for a given city and date/time
 */
export function getActiveDeals(citySlug: string, date: Date = getCurrentTime()): Array<{
  restaurant: Restaurant;
  deal: Deal;
}> {
  const city = getCity(citySlug);
  if (!city) return [];

  const activeDeals: Array<{ restaurant: Restaurant; deal: Deal }> = [];

  city.restaurants.forEach((restaurant) => {
    restaurant.deals.forEach((deal) => {
      if (isDealActive(deal, date)) {
        activeDeals.push({ restaurant, deal });
      }
    });
  });

  return activeDeals;
}

/**
 * Enhance a deal with computed properties for display and sorting
 */
function enhanceDeal(deal: Deal): EnhancedDeal {
  // Single-day deal (e.g., Friday only)
  const isSingleDay = deal.dayOfWeek !== undefined;

  // Day-specific deal (not all 7 days)
  const isDaySpecific = isSingleDay ||
    (deal.daysOfWeek && deal.daysOfWeek.length > 0 && deal.daysOfWeek.length < 7) ||
    false;

  // Time info string
  let timeInfo: string | null = null;
  if (deal.startHour !== undefined && deal.endHour !== undefined) {
    timeInfo = `${formatHour(deal.startHour)}-${formatHour(deal.endHour)}`;
  } else if (deal.startHour !== undefined) {
    timeInfo = `${formatHour(deal.startHour)}+`;
  }

  return {
    ...deal,
    isSingleDay,
    isDaySpecific,
    timeInfo,
  };
}

/**
 * Get deals grouped by restaurant for a given city and date/time
 * Deals are enhanced with computed properties and sorted by:
 * 1. Sponsored deals first
 * 2. Local single-day deals
 * 3. Chain single-day deals
 * 4. Local multi-day deals
 * 5. Chain multi-day deals
 * Within each category, sorted alphabetically by restaurant name
 */
export function getDealsGroupedByRestaurant(
  citySlug: string,
  date: Date = getCurrentTime(),
  showAll: boolean = false
): Array<{
  restaurant: Restaurant;
  activeDeals: EnhancedDeal[];
}> {
  const city = getCity(citySlug);
  if (!city) return [];

  // Collect all deals as flat list with restaurant info
  const allDeals: Array<{ restaurant: Restaurant; deal: EnhancedDeal }> = [];

  city.restaurants.forEach((restaurant) => {
    const deals = showAll
      ? restaurant.deals.filter((deal) => deal.isActive)
      : restaurant.deals.filter((deal) => isDealActive(deal, date));

    deals.forEach((deal) => {
      allDeals.push({ restaurant, deal: enhanceDeal(deal) });
    });
  });

  // Define sort order for restaurant types
  const typePriority: Record<string, number> = {
    sponsored: 0,
    local: 1,
    chain: 2,
  };

  // Sort deals:
  // 1. Sponsored first
  // 2. Single-day local
  // 3. Single-day chain
  // 4. Multi-day local
  // 5. Multi-day chain
  // Within same category: alphabetically by restaurant name
  allDeals.sort((a, b) => {
    // Sponsored always first
    if (a.restaurant.type === 'sponsored' && b.restaurant.type !== 'sponsored') return -1;
    if (a.restaurant.type !== 'sponsored' && b.restaurant.type === 'sponsored') return 1;

    // Single-day deals come before multi-day
    if (a.deal.isSingleDay && !b.deal.isSingleDay) return -1;
    if (!a.deal.isSingleDay && b.deal.isSingleDay) return 1;

    // Within same deal type (single or multi), local before chain
    const typeDiff = typePriority[a.restaurant.type] - typePriority[b.restaurant.type];
    if (typeDiff !== 0) return typeDiff;

    // Same type and same deal specificity: alphabetically by restaurant name
    return a.restaurant.name.localeCompare(b.restaurant.name);
  });

  // Convert back to grouped format (each deal as its own entry for rendering)
  return allDeals.map(({ restaurant, deal }) => ({
    restaurant,
    activeDeals: [deal],
  }));
}

/**
 * Get day name from day number (0-6)
 */
export function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
}

/**
 * Format hour to 12-hour time
 */
export function formatHour(hour: number): string {
  if (hour === 0) return '12:00 AM';
  if (hour === 12) return '12:00 PM';
  if (hour < 12) return `${hour}:00 AM`;
  return `${hour - 12}:00 PM`;
}
