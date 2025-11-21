'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DealCard } from '@/components/DealCard';
import { DaySelector } from '@/components/DaySelector';
import { getDealsGroupedByRestaurant, getLethbridgeTime, getDayName } from '@/lib/deals';

export default function Home() {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Initialize with current day in Lethbridge timezone
  useEffect(() => {
    const lethbridgeTime = getLethbridgeTime();
    setSelectedDay(lethbridgeTime.getDay());
    setCurrentTime(lethbridgeTime);
  }, []);

  // Create a date object for the selected day at current time
  const selectedDate = new Date(currentTime);
  selectedDate.setDate(
    selectedDate.getDate() + ((selectedDay - currentTime.getDay() + 7) % 7)
  );

  const dealsGrouped = getDealsGroupedByRestaurant(selectedDate);
  const isToday = selectedDay === currentTime.getDay();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Daily Grub</h1>
          <p className="text-sm text-gray-600">Lethbridge food & drink deals</p>
        </header>

        {/* Day Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">
              {isToday ? "Today's Deals" : `${getDayName(selectedDay)}'s Deals`}
            </h2>
            {dealsGrouped.length > 0 && (
              <span className="text-xs text-gray-500">
                {dealsGrouped.reduce((acc, { activeDeals }) => acc + activeDeals.length, 0)} deals
              </span>
            )}
          </div>
          <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />
        </div>

        {/* Legend */}
        {dealsGrouped.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span>All-day special</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-orange-100 border border-orange-200 flex items-center justify-center">
                <svg className="w-3 h-3 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Happy hour / time-limited</span>
            </div>
          </div>
        )}

        {/* Deals List */}
        <div className="space-y-2 mb-12">
          {dealsGrouped.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 font-medium">No deals for this day</p>
              <p className="text-sm text-gray-400 mt-1">Try another day</p>
            </div>
          ) : (
            dealsGrouped.map(({ restaurant, activeDeals }) =>
              activeDeals.map((deal) => (
                <DealCard key={deal.id} restaurant={restaurant} deal={deal} />
              ))
            )
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <div className="space-y-2">
            <div>
              <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                Privacy
              </Link>
              {' • '}
              <span>Lethbridge, AB</span>
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
