'use client';

import { getDayName } from '@/lib/deals';

interface DaySelectorProps {
  selectedDay: number;
  onDayChange: (day: number) => void;
}

export function DaySelector({ selectedDay, onDayChange }: DaySelectorProps) {
  const days = [-1, 0, 1, 2, 3, 4, 5, 6]; // -1 for "All", then Sunday to Saturday
  const today = new Date().getDay();

  const currentIndex = days.indexOf(selectedDay);
  const prevDay = days[(currentIndex - 1 + days.length) % days.length];
  const nextDay = days[(currentIndex + 1) % days.length];

  const getDisplayName = (day: number) => {
    if (day === -1) return 'All';
    return getDayName(day);
  };

  const handlePrev = () => onDayChange(prevDay);
  const handleNext = () => onDayChange(nextDay);
  const handleToday = () => onDayChange(today);
  const handleAll = () => onDayChange(-1);

  return (
    <>
      {/* Mobile: Left/Right Navigation */}
      <div className="sm:hidden">
        <div className="flex items-center gap-2">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="flex-shrink-0 p-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-emerald-300 hover:shadow-sm active:scale-95 transition-all"
            aria-label="Previous day"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Current Day Display */}
          <div className="flex-1 text-center">
            <div className="inline-block px-4 py-2 bg-emerald-600 text-white border border-emerald-600 rounded-lg font-medium shadow-sm">
              {getDisplayName(selectedDay)}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="flex-shrink-0 p-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-emerald-300 hover:shadow-sm active:scale-95 transition-all"
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
            onClick={handleToday}
            disabled={selectedDay === today}
            className={`flex-1 px-3 py-1.5 border rounded-lg text-sm font-medium transition-all ${
              selectedDay === today
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:shadow-sm active:scale-95'
            }`}
          >
            Today
          </button>
          <button
            onClick={handleAll}
            disabled={selectedDay === -1}
            className={`flex-1 px-3 py-1.5 border rounded-lg text-sm font-medium transition-all ${
              selectedDay === -1
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:shadow-sm active:scale-95'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Desktop: All Days Visible */}
      <div className="hidden sm:flex gap-2">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          const dayName = getDisplayName(day);

          return (
            <button
              key={day}
              onClick={() => onDayChange(day)}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:shadow-sm active:scale-95'
              }`}
            >
              {dayName}
            </button>
          );
        })}
      </div>
    </>
  );
}
