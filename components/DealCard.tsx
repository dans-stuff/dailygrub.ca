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
      // Track the deal open event in PostHog
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

  const getDealTypeIcon = () => {
    if (deal.type === 'food') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      );
    } else if (deal.type === 'drink') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
      </svg>
    );
  };

  const getTypeColor = () => {
    if (deal.type === 'food') return 'bg-orange-100 text-orange-700';
    if (deal.type === 'drink') return 'bg-blue-100 text-blue-700';
    return 'bg-purple-100 text-purple-700';
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border-2 border-gray-100 rounded-xl p-5 cursor-pointer hover:border-blue-200 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${getTypeColor()}`}>
              {getDealTypeIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 truncate">
                {deal.title}
              </h3>
              <p className="text-sm text-gray-600 truncate">{restaurant.name}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {timeInfo && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {timeInfo}
              </span>
            )}
            {deal.price && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                {deal.price}
              </span>
            )}
          </div>

          <p className="text-gray-700 font-medium">{deal.summary}</p>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
              <p className="text-gray-600 leading-relaxed">{deal.description}</p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <div
            className={`p-2 rounded-full bg-gray-100 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
