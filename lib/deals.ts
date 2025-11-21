import { Deal, Restaurant, DealsData, City } from '@/types/deals';
import dealsDataRaw from '@/data/deals.json';

const dealsData = dealsDataRaw as DealsData;

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
 * Get current date/time in Lethbridge timezone (America/Edmonton)
 */
export function getLethbridgeTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Edmonton' }));
}

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
export function getActiveDeals(citySlug: string, date: Date = getLethbridgeTime()): Array<{
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
 */
export function getDealsGroupedByRestaurant(
  citySlug: string,
  date: Date = getLethbridgeTime(),
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

  return Array.from(grouped.values());
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
