'use client';

import React, { useState, useEffect } from 'react';
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
    isWithinInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, User, Car, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ManualBookingDialog from './ManualBookingDialog';

interface Booking {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
    vehicle: {
        brand: string;
        vehicleModel: string;
        images: { url: string }[];
    };
    customer: {
        name: string;
        email: string;
    };
}

export default function BookingCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        
        // Add padding for previous/next month days visible in the grid
        const calendarStart = startOfWeek(start);
        const calendarEnd = endOfWeek(end);

        try {
            const res = await fetch(`/api/bookings?from=${calendarStart.toISOString()}&to=${calendarEnd.toISOString()}`);
            const data = await res.json();
            if (data.success) {
                setBookings(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [currentDate]);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDayBookings = (day: Date) => {
        return bookings.filter(booking => 
            isWithinInterval(day, {
                start: new Date(booking.startDate),
                end: new Date(booking.endDate)
            })
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            case 'COMPLETED': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-heading font-bold text-navy">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500 hover:text-navy">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500 hover:text-navy">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <ManualBookingDialog onBookingCreated={fetchBookings} />
                    <div className="h-8 w-px bg-gray-200 mx-2" />
                    <Button variant="outline" onClick={goToToday} className="font-bold">
                        Today
                    </Button>
                    <Button onClick={fetchBookings} variant="ghost" size="icon" className={loading ? 'animate-spin' : ''}>
                        <Loader2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
                {weekDays.map(day => (
                    <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-fr bg-gray-100 gap-px">
                {days.map((day, dayIdx) => {
                    const dayBookings = getDayBookings(day);
                    
                    return (
                        <div 
                            key={day.toString()} 
                            className={`min-h-[140px] bg-white p-2 flex flex-col gap-1 transition-colors hover:bg-gray-50/50 ${
                                !isSameMonth(day, monthStart) ? 'bg-gray-50/30 text-gray-400' : ''
                            } ${isSameDay(day, new Date()) ? 'bg-blue-50/30' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                                    isSameDay(day, new Date()) 
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                                        : 'text-gray-700'
                                }`}>
                                    {format(day, dateFormat)}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 overflow-y-auto max-h-[100px] custom-scrollbar">
                                {dayBookings.map((booking) => {
                                    const isStart = isSameDay(day, new Date(booking.startDate));
                                    const isEnd = isSameDay(day, new Date(booking.endDate));
                                    
                                    return (
                                        <div 
                                            key={booking.id}
                                            className={`text-[10px] p-1.5 rounded-lg border flex flex-col gap-0.5 shadow-sm hover:shadow-md transition-all cursor-pointer group ${getStatusColor(booking.status)}`}
                                            title={`${booking.vehicle.brand} - ${booking.customer.name}`}
                                        >
                                            <div className="flex items-center gap-1 font-bold truncate">
                                                <Car className="w-3 h-3 flex-shrink-0 opacity-70" />
                                                <span className="truncate">{booking.vehicle.brand} {booking.vehicle.vehicleModel}</span>
                                            </div>
                                            {/* Show customer name only on start or if specific view/hover needed, keeps it clean */}
                                            <div className="flex items-center gap-1 opacity-80 truncate pl-4">
                                                <span className="truncate">{booking.customer.name}</span>
                                            </div>
                                            
                                            {(isStart || isEnd) && (
                                                <div className="mt-1 text-[9px] font-bold uppercase tracking-wider opacity-60 pl-4">
                                                    {isStart ? 'Pickup' : 'Dropoff'}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
