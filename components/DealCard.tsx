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
      posthog.capture('deal_opened', {
        deal_id: deal.id,
        deal_title: deal.title,
        restaurant_id: restaurant.id,
        restaurant_name: restaurant.name,
        deal_type: deal.type,
      });
    }
    setIsExpanded(!isExpanded);
  };

  const getDealTimeInfo = () => {
    if (deal.startHour !== undefined && deal.endHour !== undefined) {
      return `${formatHour(deal.startHour)} - ${formatHour(deal.endHour)}`;
    } else if (deal.startHour !== undefined) {
      return `${formatHour(deal.startHour)} onwards`;
    }
    return null;
  };

  const timeInfo = getDealTimeInfo();
  const isTimeLimited = deal.startHour !== undefined || deal.endHour !== undefined;

  const getTypeIcon = () => {
    if (deal.type === 'food') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      );
    } else if (deal.type === 'drink') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    );
  };

  return (
    <div
      onClick={handleClick}
      className={`border rounded-lg p-3 cursor-pointer transition-all ${
        isTimeLimited
          ? 'border-orange-200 bg-orange-50/30 hover:border-orange-400 hover:bg-orange-50/50'
          : 'border-gray-200 bg-white hover:border-gray-400'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isTimeLimited ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {isTimeLimited ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900">{deal.title}</h3>
                {deal.price && (
                  <span className="text-sm font-bold text-green-700">{deal.price}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{restaurant.name}</p>
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

          {/* Tags - always same height to prevent layout shift */}
          <div className="flex items-center gap-1.5 mt-1.5 min-h-[20px]">
            {timeInfo && (
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 bg-white/80 text-orange-700 rounded border border-orange-200">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {timeInfo}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
              {getTypeIcon()}
              <span>{deal.type === 'both' ? 'Food & Drink' : deal.type.charAt(0).toUpperCase() + deal.type.slice(1)}</span>
            </span>
          </div>

          <p className="text-sm text-gray-700 mt-2">{deal.summary}</p>

          {/* Expanded content - uses max-height for smooth animation without layout shift */}
          <div
            className={`grid transition-all duration-200 ${
              isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">{deal.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
