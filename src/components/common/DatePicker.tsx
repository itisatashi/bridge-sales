import React, { forwardRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  onChange?: (date: Date | null) => void;
  value?: Date | null;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      onChange,
      value,
      minDate,
      maxDate,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(value || new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
    
    // Format date for input display
    const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    
    // Navigate to previous/next month
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    
    // Generate calendar days
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    const calendarDays = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });
    
    // Handle date selection
    const handleDateClick = (day: Date) => {
      // Check if date is within allowed range
      if (
        (minDate && day < minDate) ||
        (maxDate && day > maxDate)
      ) {
        return;
      }
      
      setSelectedDate(day);
      if (onChange) {
        onChange(day);
      }
      setIsOpen(false);
    };
    
    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      if (!inputValue) {
        setSelectedDate(null);
        if (onChange) {
          onChange(null);
        }
        return;
      }
      
      const date = new Date(inputValue);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setCurrentMonth(date);
        if (onChange) {
          onChange(date);
        }
      }
    };
    
    // Handle input focus
    const handleInputFocus = () => {
      setIsOpen(true);
    };
    
    // Handle click outside
    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        setIsOpen(false);
      }
    };
    
    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
            <Calendar className="w-5 h-5" />
          </div>
          
          <input
            ref={ref}
            type="date"
            className={`appearance-none rounded-md border ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
            } bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-1 dark:text-white pl-10 pr-3 py-2 ${
              fullWidth ? 'w-full' : ''
            } ${className}`}
            value={formattedDate}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            {...props}
          />
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
        
        {/* Calendar dropdown */}
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleClickOutside}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-72">
              {/* Calendar header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                  const isTodayDate = isToday(day);
                  const isDisabled =
                    (minDate && day < minDate) || (maxDate && day > maxDate);
                  
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => handleDateClick(day)}
                      disabled={isDisabled}
                      className={`
                        py-2 rounded-full text-sm
                        ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : ''}
                        ${isSelected ? 'bg-primary-600 text-white' : ''}
                        ${
                          isTodayDate && !isSelected
                            ? 'border border-primary-600 text-primary-600 dark:text-primary-400'
                            : ''
                        }
                        ${
                          isCurrentMonth && !isSelected && !isTodayDate
                            ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                            : ''
                        }
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
              
              {/* Footer with today button */}
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    if (
                      !(minDate && today < minDate) &&
                      !(maxDate && today > maxDate)
                    ) {
                      setSelectedDate(today);
                      setCurrentMonth(today);
                      if (onChange) {
                        onChange(today);
                      }
                    }
                  }}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Today
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
