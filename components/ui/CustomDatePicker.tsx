'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function CustomDatePicker({
  label,
  value = '',
  onChange,
  className = '',
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [viewDate, setViewDate] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return 'yyyy-mm-dd';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const formatted = formatDate(date);
    onChange?.(formatted);
    setIsOpen(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const previousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = getDaysInMonth(viewDate);

  return (
    <div ref={dropdownRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-purple-300 mb-2 font-pixel">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2 rounded-lg
          border-4 border-[#3f3454]
          bg-[#1a1625]
          text-white
          font-pixel text-sm
          focus:outline-none
          focus:ring-2 focus:ring-purple-500
          focus:border-purple-500
          transition-all
          hover:border-purple-500
          flex items-center justify-between
          ${className}
        `}
      >
        <span className={selectedDate ? '' : 'text-purple-400'}>
          {formatDate(selectedDate)}
        </span>
        <Calendar className="w-4 h-4 text-purple-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 bg-[#2a2139] border-4 border-[#3f3454] rounded-lg shadow-2xl p-4 w-full min-w-[300px]"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={previousMonth}
                className="p-1 hover:bg-purple-800/50 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-purple-300" />
              </button>

              <div className="font-pixel text-sm text-white">
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </div>

              <button
                type="button"
                onClick={nextMonth}
                className="p-1 hover:bg-purple-800/50 rounded transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-purple-300" />
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div
                  key={i}
                  className="text-center text-xs font-pixel text-purple-400 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => (
                <div key={index}>
                  {date ? (
                    <button
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      className={`
                        w-full aspect-square
                        rounded
                        text-xs font-pixel
                        transition-all
                        ${
                          isSelected(date)
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400'
                            : isToday(date)
                            ? 'bg-purple-800/50 text-yellow-400 border-2 border-yellow-400'
                            : 'text-purple-200 hover:bg-purple-800/30'
                        }
                      `}
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <div className="w-full aspect-square" />
                  )}
                </div>
              ))}
            </div>

            {/* Footer buttons */}
            <div className="flex gap-2 mt-4 pt-4 border-t-2 border-purple-700">
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(null);
                  onChange?.('');
                  setIsOpen(false);
                }}
                className="flex-1 px-3 py-2 bg-[#1a1625] text-purple-300 font-bold rounded border-2 border-[#3f3454] hover:border-purple-500 hover:text-white transition-all font-pixel text-xs"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setSelectedDate(today);
                  onChange?.(formatDate(today));
                  setIsOpen(false);
                }}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded border-2 border-purple-400 hover:from-purple-500 hover:to-pink-500 transition-all font-pixel text-xs"
              >
                Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
