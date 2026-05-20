'use client';

import { EnhancedDeal, Restaurant } from '@/lib/deals';
import { posthog } from '@/lib/posthog';
import { UtensilsCrossed, Martini, Sparkles, Megaphone, Star, MapPin, Building2, ExternalLink } from 'lucide-react';

interface DealCardProps {
  restaurant: Restaurant;
  deal: EnhancedDeal;
  cityName?: string;
  citySlug?: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function DealCard({ restaurant, deal, cityName, citySlug, isExpanded, onToggle }: DealCardProps) {
  const handleClick = () => {
    if (!isExpanded) {
      posthog.capture('deal_opened', {
        deal_id: deal.id,
        deal_title: deal.title,
        restaurant_id: restaurant.id,
        restaurant_name: restaurant.name,
        restaurant_type: restaurant.type,
        deal_type: deal.type,
        is_time_limited: deal.startHour !== undefined || deal.endHour !== undefined,
        is_single_day: deal.isSingleDay,
        city_name: cityName || null,
        city_slug: citySlug || null,
      });
    }
    onToggle();
  };

  // Icon based on deal type: food, drink, or both
  const getIcon = () => {
    if (deal.type === 'drink') {
      return <Martini className="w-5 h-5" />;
    }
    if (deal.type === 'both') {
      return <Sparkles className="w-5 h-5" />;
    }
    // Default: food
    return <UtensilsCrossed className="w-5 h-5" />;
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white border border-gray-300 rounded-lg p-4 shadow-sm cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all duration-150 active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        {/* Icon - muted colors for scannability */}
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            deal.type === 'drink'
              ? 'bg-gray-100 text-violet-400'
              : deal.type === 'both'
              ? 'bg-gray-100 text-amber-400'
              : 'bg-gray-100 text-emerald-400'
          }`}>
            {getIcon()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              {/* Title is the headline */}
              <h3 className="font-bold text-gray-900 leading-tight break-words">{deal.title}</h3>

              {/* Restaurant name secondary */}
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                <p className="text-sm text-gray-500 truncate">{restaurant.name}</p>
                {restaurant.type === 'sponsored' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-amber-500 text-white rounded whitespace-nowrap font-medium">
                    <Megaphone className="w-3 h-3" />
                    Sponsored
                  </span>
                )}
                {restaurant.type === 'exclusive' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-violet-500 text-white rounded whitespace-nowrap font-medium">
                    <Star className="w-3 h-3" />
                    Exclusive
                  </span>
                )}
                {restaurant.type === 'local' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-emerald-500 text-white rounded whitespace-nowrap font-medium">
                    <MapPin className="w-3 h-3" />
                    Local
                  </span>
                )}
                {restaurant.type === 'chain' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded whitespace-nowrap">
                    <Building2 className="w-3 h-3" />
                    Chain
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${
                  deal.isSingleDay
                    ? 'bg-blue-500 text-white font-medium'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {deal.isSingleDay ? 'Daily special' : 'Multi-day'}
                </span>
                {deal.timeInfo && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded whitespace-nowrap">
                      {deal.timeInfo}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Details button */}
            <div className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
              isExpanded
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-600'
            }`}>
              <span>{isExpanded ? 'Hide' : 'Details'}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Expanded content */}
          <div
            className={`grid transition-all duration-200 ${
              isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">{deal.description}</p>

                {/* Restaurant address and website */}
                {(restaurant.address || restaurant.website) && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    {restaurant.address && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{restaurant.address}</span>
                      </div>
                    )}
                    {restaurant.website && (
                      <a
                        href={restaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
