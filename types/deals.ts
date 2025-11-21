export type DealItemType = 'food' | 'drink' | 'both';

export interface Deal {
  id: string;
  title: string;
  summary: string;
  description: string;
  type: DealItemType;
  price?: string;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday) for single-day deals
  daysOfWeek?: number[]; // for multi-day deals
  startHour?: number; // 0-23 for hourly deals
  endHour?: number; // 0-23 for hourly deals
  lastVerified?: string; // ISO date string (YYYY-MM-DD)
  isActive: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  deals: Deal[];
}

export interface City {
  name: string;
  province: string;
  restaurants: Restaurant[];
}

export interface DealsData {
  cities: {
    [citySlug: string]: City;
  };
}
