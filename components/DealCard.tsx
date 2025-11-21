'use client';

import { useState } from 'react';
import { Deal, Restaurant } from '@/types/deals';
import { posthog } from '@/lib/posthog';
import { formatHour } from '@/lib/deals';

interface DealCardProps {
  restaurant: Restaurant;
  deal: Deal;
}

export function DealCard({ restaurant, deal }: DealCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (!isExpanded) {
      // Track with full restaurant and deal details
      posthog.capture('deal_opened', {
        deal_id: deal.id,
        deal_title: deal.title,
        restaurant_id: restaurant.id,
        restaurant_name: restaurant.name,
        deal_type: deal.type,
        has_price: !!deal.price,
        is_time_limited: deal.startHour !== undefined || deal.endHour !== undefined,
      });
    }
    setIsExpanded(!isExpanded);
  };

  const getDealTimeInfo = () => {
    if (deal.startHour !== undefined && deal.endHour !== undefined) {
      return `${formatHour(deal.startHour)}-${formatHour(deal.endHour)}`;
    } else if (deal.startHour !== undefined) {
      return `${formatHour(deal.startHour)}+`;
    }
    return null;
  };

  const timeInfo = getDealTimeInfo();
  const isTimeLimited = deal.startHour !== undefined || deal.endHour !== undefined;

  return (
    <div
      onClick={handleClick}
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isTimeLimited
          ? 'border-orange-200 bg-orange-50/30 hover:border-orange-400 hover:bg-orange-50/50 hover:shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Left side - Icon or Price */}
        <div className="flex-shrink-0">
          {deal.price ? (
            <div className="bg-green-100 text-green-800 rounded-lg px-3 py-2 min-w-[60px] text-center">
              <div className="text-lg font-bold leading-none">{deal.price}</div>
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isTimeLimited ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {isTimeLimited ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 leading-tight">{deal.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm text-gray-600">{restaurant.name}</p>
                {timeInfo && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm font-medium text-orange-700">{timeInfo}</span>
                  </>
                )}
              </div>
            </div>

            {/* Expand arrow */}
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
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

          <p className="text-sm text-gray-700 mt-2 leading-relaxed">{deal.summary}</p>

          {/* Expanded content */}
          <div
            className={`grid transition-all duration-200 ${
              isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">{deal.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
