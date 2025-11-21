import { Deal, Restaurant, DealsData, City } from '@/types/deals';
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
 * Check if a deal is active for the given date and time
 */
export function isDealActive(deal: Deal, date: Date): boolean {
  if (!deal.isActive) return false;

  const dayOfWeek = date.getDay(); // 0-6
  const currentHour = date.getHours(); // 0-23

  // Check if deal is valid for the current day
  let isDayMatch = false;

  if (deal.dayOfWeek !== undefined) {
    // Single day deal
    isDayMatch = deal.dayOfWeek === dayOfWeek;
  } else if (deal.daysOfWeek && deal.daysOfWeek.length > 0) {
    // Multi-day deal
    isDayMatch = deal.daysOfWeek.includes(dayOfWeek);
  } else {
    // No day restriction, available all days
    isDayMatch = true;
  }

  if (!isDayMatch) return false;

  // Check if deal is valid for the current time
  if (deal.startHour !== undefined || deal.endHour !== undefined) {
    const startHour = deal.startHour ?? 0;
    const endHour = deal.endHour ?? 24;

    // Handle deals that don't have an end hour (e.g., "after 2pm")
    if (deal.endHour === undefined && deal.startHour !== undefined) {
      return currentHour >= startHour;
    }

    return currentHour >= startHour && currentHour < endHour;
  }

  // No time restriction, available all day
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
 * Get deals grouped by restaurant for a given city and date/time
 * Restaurants are sorted by type: sponsored > local > chain
 */
export function getDealsGroupedByRestaurant(
  citySlug: string,
  date: Date = getCurrentTime(),
  showAll: boolean = false
): Array<{
  restaurant: Restaurant;
  activeDeals: Deal[];
}> {
  const city = getCity(citySlug);
  if (!city) return [];

  const grouped = new Map<string, { restaurant: Restaurant; activeDeals: Deal[] }>();

  city.restaurants.forEach((restaurant) => {
    const activeDeals = showAll
      ? restaurant.deals.filter((deal) => deal.isActive)
      : restaurant.deals.filter((deal) => isDealActive(deal, date));
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

  // Sort by type (sponsored > local > chain), then alphabetically by name
  return Array.from(grouped.values()).sort((a, b) => {
    const typeDiff = typePriority[a.restaurant.type] - typePriority[b.restaurant.type];
    if (typeDiff !== 0) return typeDiff;
    return a.restaurant.name.localeCompare(b.restaurant.name);
  });
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
