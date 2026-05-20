export type DealItemType = 'food' | 'drink' | 'both';

export interface Deal {
  id: string;
  title: string;
  description: string;
  type: DealItemType;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday) for single-day deals
  daysOfWeek?: number[]; // for multi-day deals
  startHour?: number; // 0-23 for hourly deals
  endHour?: number; // 0-23 for hourly deals
  lastVerified?: string; // ISO date string (YYYY-MM-DD)
}

// Enhanced deal with computed properties for display and sorting
export interface EnhancedDeal extends Deal {
  isSingleDay: boolean;
  isDaySpecific: boolean;
  timeInfo: string | null;
}

export type RestaurantType = 'sponsored' | 'exclusive' | 'local' | 'chain';

export interface Restaurant {
  id: string;
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
  cities: {
    [citySlug: string]: City;
  };
}
