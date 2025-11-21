'use client';

import { useState } from 'react';
import { Deal, Restaurant } from '@/types/deals';
import { posthog } from '@/lib/posthog';
import { formatHour } from '@/lib/deals';

interface DealCardProps {
  restaurant: Restaurant;
  deal: Deal;
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
        deal_summary: deal.summary,
        restaurant_id: restaurant.id,
        restaurant_name: restaurant.name,
        deal_type: deal.type,
        has_price: !!deal.price,
        price: deal.price || null,
        is_time_limited: deal.startHour !== undefined || deal.endHour !== undefined,
        city_name: cityName || null,
        city_slug: citySlug || null,
      });
    }
    onToggle();
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

  // Pick icon based on deal content
  const getIcon = () => {
    const text = (deal.summary + deal.title).toLowerCase();

    // Wings
    if (text.includes('wing')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      );
    }

    // Drinks
    if (text.includes('drink') || text.includes('cocktail') || text.includes('beer') ||
        text.includes('wine') || text.includes('whiskey') || text.includes('margarita') ||
        text.includes('paralyzers') || text.includes('sangria') || text.includes('pint')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      );
    }

    // Tacos
    if (text.includes('taco')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      );
    }

    // Pizza/Pasta
    if (text.includes('pizza') || text.includes('pasta')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    }

    // Burger
    if (text.includes('burger')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
    }

    // Dessert
    if (text.includes('dessert') || text.includes('cake') || text.includes('cheesecake')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
        </svg>
      );
    }

    // Ribs/BBQ
    if (text.includes('rib') || text.includes('bbq')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    }

    // Brunch/Breakfast
    if (text.includes('brunch') || text.includes('breakfast')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }

    // Appetizers
    if (text.includes('appy') || text.includes('appetizer')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    }

    // Steak
    if (text.includes('steak') || text.includes('sirloin')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    }

    // Generic food
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all duration-150 active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            {getIcon()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Summary is the headline */}
              <h3 className="font-bold text-gray-900 leading-tight">{deal.summary}</h3>

              {/* Restaurant name secondary */}
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-500">{restaurant.name}</p>
                {timeInfo && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {timeInfo}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Details button */}
            <div className="flex-shrink-0 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span>Details</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
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
                {deal.price && (
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-md">
                      {deal.price}
                    </span>
                  </div>
                )}
                <p className="text-sm text-gray-600 leading-relaxed">{deal.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
