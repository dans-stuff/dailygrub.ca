'use client';

import { getDayName } from '@/lib/deals';

interface DaySelectorProps {
  selectedDay: number;
  today: number;
  onDayChange: (day: number) => void;
}

export function DaySelector({ selectedDay, today, onDayChange }: DaySelectorProps) {
  // For display: day name or "All"
  const getDisplayName = (day: number) => {
    if (day === -1) return 'All';
    return getDayName(day);
  };

  // Mobile cycling: just go through days 0-6 (no "All")
  // If on "All", start from today
  const cycleDay = selectedDay === -1 ? today : selectedDay;
  const prevDay = (cycleDay - 1 + 7) % 7;
  const nextDay = (cycleDay + 1) % 7;

  return (
    <>
      {/* Mobile: Left/Right Navigation */}
      <div className="sm:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDayChange(prevDay)}
            className="flex-shrink-0 p-2 border border-gray-300 rounded-lg bg-white shadow-sm text-gray-700 hover:border-emerald-400 hover:shadow-md active:scale-95 transition-all"
            aria-label="Previous day"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-1 text-center">
            <div className="inline-block px-4 py-2 bg-emerald-600 text-white border border-emerald-600 rounded-lg font-medium shadow-sm">
              {getDisplayName(selectedDay)}
            </div>
          </div>

          <button
            onClick={() => onDayChange(nextDay)}
            className="flex-shrink-0 p-2 border border-gray-300 rounded-lg bg-white shadow-sm text-gray-700 hover:border-emerald-400 hover:shadow-md active:scale-95 transition-all"
            aria-label="Next day"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onDayChange(today)}
            disabled={selectedDay === today}
            className={`flex-1 px-3 py-1.5 border rounded-lg text-sm font-medium transition-all ${
              selectedDay === today
                ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 shadow-sm hover:border-emerald-400 hover:shadow-md active:scale-95'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => onDayChange(-1)}
            disabled={selectedDay === -1}
            className={`flex-1 px-3 py-1.5 border rounded-lg text-sm font-medium transition-all ${
              selectedDay === -1
                ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 shadow-sm hover:border-emerald-400 hover:shadow-md active:scale-95'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Desktop: All Days Visible */}
      <div className="hidden sm:flex gap-2">
        {[-1, 0, 1, 2, 3, 4, 5, 6].map((day) => (
          <button
            key={day}
            onClick={() => onDayChange(day)}
            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedDay === day
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 shadow-sm hover:border-emerald-400 hover:shadow-md active:scale-95'
            }`}
          >
            {getDisplayName(day)}
          </button>
        ))}
      </div>
    </>
  );
}
