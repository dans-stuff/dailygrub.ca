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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Daily Grub
          </h1>
          <p className="text-lg text-gray-600">
            Lethbridge's best food & drink deals
          </p>
        </header>

        {/* Day Selector */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 px-1">
            {isToday ? "Today's Deals" : `${getDayName(selectedDay)}'s Deals`}
          </h2>
          <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />
        </div>

        {/* Deals List */}
        <div className="space-y-3 sm:space-y-4 mb-12">
          {dealsGrouped.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-100 rounded-xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">No deals found for this day</p>
              <p className="text-gray-400 text-sm mt-2">Try selecting a different day</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4 px-1">
                <p className="text-sm text-gray-600">
                  {dealsGrouped.reduce((acc, { activeDeals }) => acc + activeDeals.length, 0)} deals available
                </p>
              </div>
              {dealsGrouped.map(({ restaurant, activeDeals }) =>
                activeDeals.map((deal) => (
                  <DealCard key={deal.id} restaurant={restaurant} deal={deal} />
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-300">•</span>
              <span>Lethbridge, AB</span>
            </div>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">
              Deal information is provided as-is and may change. Please verify with restaurants directly.
              Daily Grub is not responsible for outdated or incorrect information.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
