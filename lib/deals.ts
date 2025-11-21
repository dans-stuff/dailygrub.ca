import { Deal, Restaurant, DealsData, City, EnhancedDeal } from '@/types/deals';
import Papa from 'papaparse';
// @ts-ignore - Raw loader for CSV file
import dealsCsvRaw from '@/data/deals.csv';

// CSV row type
interface DealRow {
  city_slug: string;
  city_name: string;
  city_province: string;
  restaurant_id: string;
  restaurant_name: string;
  restaurant_type: 'local' | 'chain' | 'sponsored';
  deal_id: string;
  deal_title: string;
  deal_summary: string;
  deal_description: string;
  deal_type: 'food' | 'drink' | 'both';
  deal_price: string;
  day_of_week: string;
  days_of_week: string;
  start_hour: string;
  end_hour: string;
  last_verified: string;
  is_active: string;
}

// Parse CSV and build DealsData structure
function loadDealsFromCSV(csvContent: string): DealsData {
  const parsed = Papa.parse<DealRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const dealsData: DealsData = { cities: {} };

  parsed.data.forEach((row) => {
    const citySlug = row.city_slug;

    // Initialize city if not exists
    if (!dealsData.cities[citySlug]) {
      dealsData.cities[citySlug] = {
        name: row.city_name,
        province: row.city_province,
        restaurants: [],
      };
    }

    const city = dealsData.cities[citySlug];

    // Find or create restaurant
    let restaurant = city.restaurants.find((r) => r.id === row.restaurant_id);
    if (!restaurant) {
      restaurant = {
        id: row.restaurant_id,
        name: row.restaurant_name,
        type: row.restaurant_type,
        deals: [],
      };
      city.restaurants.push(restaurant);
    }

    // Parse deal
    const deal: Deal = {
      id: row.deal_id,
      title: row.deal_title,
      summary: row.deal_summary,
      description: row.deal_description,
      type: row.deal_type,
      isActive: row.is_active === 'true',
    };

    // Optional fields
    if (row.deal_price) deal.price = row.deal_price;
    if (row.day_of_week) deal.dayOfWeek = parseInt(row.day_of_week, 10);
    if (row.days_of_week) {
      deal.daysOfWeek = row.days_of_week.split(';').map((d) => parseInt(d, 10));
    }
    if (row.start_hour) deal.startHour = parseInt(row.start_hour, 10);
    if (row.end_hour) deal.endHour = parseInt(row.end_hour, 10);
    if (row.last_verified) deal.lastVerified = row.last_verified;

    restaurant.deals.push(deal);
  });

  return dealsData;
}

const dealsData = loadDealsFromCSV(dealsCsvRaw);

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
 * Deals are enhanced with computed properties and restaurants are sorted by:
 * 1. Type: sponsored > local > chain
 * 2. Deal specificity: single-day > multi-day > all-day
 * 3. Alphabetically by name
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

  const grouped = new Map<string, { restaurant: Restaurant; activeDeals: EnhancedDeal[] }>();

  city.restaurants.forEach((restaurant) => {
    const activeDeals = showAll
      ? restaurant.deals.filter((deal) => deal.isActive).map(enhanceDeal)
      : restaurant.deals.filter((deal) => isDealActive(deal, date)).map(enhanceDeal);
    if (activeDeals.length > 0) {
      grouped.set(restaurant.id, { restaurant, activeDeals });
    }
  });

  // Define sort order for restaurant types
  const typePriority: Record<string, number> = {
    sponsored: 0,
    local: 1,
    chain: 2,
  };

  // Sort restaurants: sponsored first, then single-day (local > chain), then multi-day (local > chain)
  const sortedRestaurants = Array.from(grouped.values()).sort((a, b) => {
    // First: Sponsored always comes first
    if (a.restaurant.type === 'sponsored' && b.restaurant.type !== 'sponsored') return -1;
    if (a.restaurant.type !== 'sponsored' && b.restaurant.type === 'sponsored') return 1;

    // Second: Check if restaurants have single-day deals
    const aHasSingleDay = a.activeDeals.some(deal => deal.isSingleDay);
    const bHasSingleDay = b.activeDeals.some(deal => deal.isSingleDay);

    // If both have single-day or both don't, sort by type (local > chain)
    if (aHasSingleDay === bHasSingleDay) {
      const typeDiff = typePriority[a.restaurant.type] - typePriority[b.restaurant.type];
      if (typeDiff !== 0) return typeDiff;
      return a.restaurant.name.localeCompare(b.restaurant.name);
    }

    // Single-day deals come before multi-day
    if (aHasSingleDay && !bHasSingleDay) return -1;
    if (!aHasSingleDay && bHasSingleDay) return 1;

    // Fallback: alphabetically
    return a.restaurant.name.localeCompare(b.restaurant.name);
  });

  // Sort deals within each restaurant (single-day first, then multi-day, then all-day)
  return sortedRestaurants.map(group => ({
    ...group,
    activeDeals: group.activeDeals.sort((a, b) => {
      // Single-day deals first
      if (a.isSingleDay && !b.isSingleDay) return -1;
      if (!a.isSingleDay && b.isSingleDay) return 1;

      // Then day-specific multi-day deals
      if (a.isDaySpecific && !b.isDaySpecific) return -1;
      if (!a.isDaySpecific && b.isDaySpecific) return 1;

      return 0;
    })
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
