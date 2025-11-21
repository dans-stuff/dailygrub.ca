'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DealCard } from '@/components/DealCard';
import { DaySelector } from '@/components/DaySelector';
import { getDealsGroupedByRestaurant, getCurrentTime, getDayName, getCity } from '@/lib/deals';

export default function CityPage() {
  const params = useParams();
  const citySlug = params.city as string;

  // Initialize with current day to avoid flash
  const initialTime = getCurrentTime();
  const [selectedDay, setSelectedDay] = useState<number>(initialTime.getDay());
  const [currentTime, setCurrentTime] = useState<Date>(initialTime);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);

  const city = getCity(citySlug);

  useEffect(() => {
    if (!city) {
      setCityNotFound(true);
    }
  }, [city]);

  // Reset expanded deal when day changes
  useEffect(() => {
    setExpandedDealId(null);
  }, [selectedDay]);

  if (cityNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">City not found</h1>
          <p className="text-gray-600 mb-4">We don't have deals for this city yet.</p>
          <Link href="/" className="text-gray-900 hover:underline">
            Back to city selector
          </Link>
        </div>
      </div>
    );
  }

  if (!city) {
    return null;
  }

  // Create a date object for the selected day at current time
  const selectedDate = new Date(currentTime);
  if (selectedDay !== -1) {
    selectedDate.setDate(
      selectedDate.getDate() + ((selectedDay - currentTime.getDay() + 7) % 7)
    );
  }

  const isToday = selectedDay === currentTime.getDay();
  const isAllDays = selectedDay === -1;
  // Filter by day only (no time filtering)
  const dealsGrouped = getDealsGroupedByRestaurant(citySlug, selectedDate, isAllDays);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-0.5">Daily Grub</h1>
              <div className="flex items-baseline gap-2 flex-wrap mb-1">
                <p className="text-sm text-gray-600">Food & drink deals in</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-emerald-600 transition-colors group"
                  title="Change city"
                >
                  <span>{city.name}</span>
                  <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-0.5">Missing a deal?</p>
              <a
                href="mailto:support@lunoh.com"
                className="text-sm text-gray-900 hover:underline font-medium"
              >
                support@lunoh.com
              </a>
            </div>
          </div>
        </header>

        {/* Day Selector */}
        <div className="mb-6">
          <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />
        </div>

        {/* Deals List */}
        <div className="space-y-2 mb-12">
          {dealsGrouped.length === 0 ? (
            <div className="bg-white border border-gray-300 rounded-lg p-12 shadow-sm text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 font-medium">No deals for this day</p>
              <p className="text-sm text-gray-400 mt-1">Try another day</p>
            </div>
          ) : (
            dealsGrouped.map(({ restaurant, activeDeals }) =>
              activeDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  restaurant={restaurant}
                  deal={deal}
                  cityName={city.name}
                  citySlug={citySlug}
                  isExpanded={expandedDealId === deal.id}
                  onToggle={() => setExpandedDealId(expandedDealId === deal.id ? null : deal.id)}
                />
              ))
            )
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-xs sm:text-sm text-gray-500">
          <div className="space-y-3">
            <p className="text-gray-600">
              Restaurants sorted to prioritize local places and one day deals.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">
                Privacy
              </Link>
              <span className="text-gray-300">•</span>
              <span>{city.name}, {city.province}</span>
            </div>
            <p className="text-gray-400">
              Verify with restaurants. Info may be outdated.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
