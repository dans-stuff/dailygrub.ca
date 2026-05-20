'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { DealCard } from '@/app/_components/DealCard';
import { DaySelector } from '@/app/_components/DaySelector';
import { getDealsGroupedByRestaurant, getCity } from '@/lib/deals';

interface CityPageClientProps {
  citySlug: string;
}

export default function CityPageClient({ citySlug }: CityPageClientProps) {
  // Lazy initializer - runs once on client mount, uses user's local timezone
  const [today] = useState(() => new Date().getDay());
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDay());
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);

  const city = getCity(citySlug);

  // Handle day change and reset expanded deal
  const handleDayChange = useCallback((day: number) => {
    setSelectedDay(day);
    setExpandedDealId(null);
  }, []);

  if (!city) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">City not found</h1>
          <p className="text-gray-600 mb-4">We don&apos;t have deals for this city yet.</p>
          <Link href="/" className="text-gray-900 hover:underline">
            Back to city selector
          </Link>
        </div>
      </div>
    );
  }

  // Create a date object for the selected day
  const now = new Date();
  const selectedDate = new Date(now);
  if (selectedDay !== -1) {
    selectedDate.setDate(now.getDate() + ((selectedDay - today + 7) % 7));
  }

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
              <Link href="/" className="text-2xl sm:text-3xl font-bold text-gray-900 hover:text-emerald-600 transition-colors">
                Daily Grub
              </Link>
              <p className="text-sm text-gray-500 mb-1">Cheap eats every day of the week</p>
              <h1 className="flex items-baseline gap-2 flex-wrap mb-1">
                <span className="text-sm text-gray-600">Deals in</span>
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
              </h1>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-0.5">Missing a deal?</p>
              <a
                href="https://github.com/dans-stuff/dailygrub.ca?tab=contributing-ov-file"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-900 hover:underline font-medium"
              >
                Add it on GitHub
              </a>
            </div>
          </div>
        </header>

        {/* Per-city external site — driven by cities.yaml `website` */}
        {city.website && (
          <a
            href={city.website}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-6 bg-emerald-50 border border-emerald-200 hover:border-emerald-400 rounded-lg px-4 py-2.5 transition-colors text-sm text-emerald-800 hover:underline"
          >
            If you live in {city.name}, check out{' '}
            <span className="font-semibold">
              {city.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </span>{' '}
            &rarr;
          </a>
        )}

        {/* Day Selector */}
        <div className="mb-6">
          <DaySelector selectedDay={selectedDay} today={today} onDayChange={handleDayChange} />
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
            dealsGrouped.map(({ restaurant, activeDeals }, i) =>
              activeDeals.map((deal, j) => {
                // Index-based — uniqueness is a rendering concern, not a data concern.
                const key = `${i}-${j}`;
                return (
                  <DealCard
                    key={key}
                    restaurant={restaurant}
                    deal={deal}
                    cityName={city.name}
                    citySlug={citySlug}
                    isExpanded={expandedDealId === key}
                    onToggle={() => setExpandedDealId(expandedDealId === key ? null : key)}
                  />
                );
              })
            )
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-xs sm:text-sm text-gray-500">
          <div className="space-y-3">
            <p className="text-gray-600">
              Deals are sorted by sponsored, exclusive, then local over chain, with daily specials first. Always confirm deals directly with the restaurant.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">
                Privacy
              </Link>
              <span className="text-gray-300">•</span>
              <span>{city.name}, {city.province}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-400">Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out food & drink deals in ${city.name}!`)}&url=${encodeURIComponent(`https://dailygrub.ca/${citySlug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Share on X"
              >
                X
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://dailygrub.ca/${citySlug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Share on Facebook"
              >
                FB
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
