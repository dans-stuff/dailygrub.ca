'use client';

import { getDayName } from '@/lib/deals';

interface DaySelectorProps {
  selectedDay: number;
  onDayChange: (day: number) => void;
}

export function DaySelector({ selectedDay, onDayChange }: DaySelectorProps) {
  const days = [0, 1, 2, 3, 4, 5, 6]; // Sunday to Saturday

  const getDayAbbr = (day: number): string => {
    const abbrs = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return abbrs[day];
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {days.map((day) => {
        const isSelected = selectedDay === day;
        return (
          <button
            key={day}
            onClick={() => onDayChange(day)}
            className={`flex-shrink-0 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isSelected
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <span className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                {getDayAbbr(day)}
              </span>
              <span className="hidden sm:inline">{getDayName(day)}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
