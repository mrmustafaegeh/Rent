'use client';

import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isWithinInterval,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Booking {
  startDate: string | Date;
  endDate: string | Date;
  status: string;
  customer?: {
      name?: string;
      email?: string;
  };
  customerName?: string;
}

interface VehicleCalendarProps {
  bookings: Booking[];
  onDateSelect?: (date: Date) => void;
}

export function VehicleCalendar({ bookings, onDateSelect }: VehicleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getBookingForDate = (date: Date) => {
    return bookings.find(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      // Normalize dates to ignore time for comparison
      const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const bookingStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const bookingEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      
      return checkDate >= bookingStart && checkDate <= bookingEnd;
    });
  };

  const getStatusColor = (status: string) => {
      switch (status?.toUpperCase()) {
          case 'CONFIRMED': return 'bg-red-500 text-white';
          case 'PENDING': return 'bg-amber-500 text-white';
          case 'IN_PROGRESS': return 'bg-blue-600 text-white';
          case 'COMPLETED': return 'bg-gray-400 text-white';
          case 'CANCELLED': return 'bg-gray-100 text-gray-400 decoration-line-through';
          default: return 'bg-navy text-white';
      }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-navy">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-full">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-full">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const booking = getBookingForDate(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={day.toString()}
              onClick={() => onDateSelect && onDateSelect(day)}
              className={`
                min-h-[60px] md:min-h-[80px] p-1 md:p-2 rounded-lg md:rounded-xl border border-transparent transition-all relative
                ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-300' : 'bg-white hover:border-gray-200'}
                ${isToday ? 'ring-1 md:ring-2 ring-gold/50' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                  <span className={`text-sm font-bold ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}`}>
                    {format(day, 'd')}
                  </span>
              </div>
              
              {booking && (
                  <div className={`mt-1 text-[10px] font-bold p-1 rounded-md truncate ${getStatusColor(booking.status)}`}>
                      {booking.customerName || booking.customer?.name || 'Booked'}
                  </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex gap-4 mt-6 text-xs text-gray-500 font-medium justify-center">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Confirmed</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Pending</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Active</div>
      </div>
    </div>
  );
}
