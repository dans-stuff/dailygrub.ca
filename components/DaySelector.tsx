'use client';

import { getDayName } from '@/lib/deals';

interface DaySelectorProps {
  selectedDay: number;
  onDayChange: (day: number) => void;
}

export function DaySelector({ selectedDay, onDayChange }: DaySelectorProps) {
  const days = [-1, 0, 1, 2, 3, 4, 5, 6]; // -1 for "All", then Sunday to Saturday

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {days.map((day) => {
        const isSelected = selectedDay === day;
        const dayName = day === -1 ? 'All' : getDayName(day);
        const shortName = day === -1 ? 'All' : dayName.slice(0, 3);

        return (
          <button
            key={day}
            onClick={() => onDayChange(day)}
            className={`px-3 py-2 sm:px-4 border rounded-lg text-sm font-medium transition-all duration-200 min-w-[60px] sm:min-w-0 ${
              isSelected
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:shadow-sm active:scale-95'
            }`}
          >
            <span className="sm:hidden">{shortName}</span>
            <span className="hidden sm:inline">{dayName}</span>
          </button>
        );
      })}
    </div>
  );
}
