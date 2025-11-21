import { Deal, Restaurant } from '@/types/deals';
import dealsData from '@/data/deals.json';

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

  if (deal.type === 'daily') {
    return deal.dayOfWeek === dayOfWeek;
  }

  if (deal.type === 'hourly') {
    const isDayMatch = deal.daysOfWeek?.includes(dayOfWeek) ?? true;
    const isHourMatch =
      currentHour >= (deal.startHour ?? 0) && currentHour < (deal.endHour ?? 24);
    return isDayMatch && isHourMatch;
  }

  return false;
}

/**
 * Get all active deals for a given date/time
 */
export function getActiveDeals(date: Date = getLethbridgeTime()): Array<{
  restaurant: Restaurant;
  deal: Deal;
}> {
  const activeDeals: Array<{ restaurant: Restaurant; deal: Deal }> = [];

  dealsData.restaurants.forEach((restaurant) => {
    restaurant.deals.forEach((deal) => {
      if (isDealActive(deal, date)) {
        activeDeals.push({ restaurant, deal });
      }
    });
  });

  return activeDeals;
}

/**
 * Get deals grouped by restaurant for a given date/time
 */
export function getDealsGroupedByRestaurant(date: Date = getLethbridgeTime()): Array<{
  restaurant: Restaurant;
  activeDeals: Deal[];
}> {
  const grouped = new Map<string, { restaurant: Restaurant; activeDeals: Deal[] }>();

  dealsData.restaurants.forEach((restaurant) => {
    const activeDeals = restaurant.deals.filter((deal) => isDealActive(deal, date));
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
