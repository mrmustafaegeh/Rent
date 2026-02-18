import { getTranslations } from 'next-intl/server';
import BookingCalendar from '@/components/dashboard/BookingCalendar';

export default async function AdminSchedulePage() {
    const t = await getTranslations('Dashboard');

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">
                        Vehicle <span className="text-gold">Schedule</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium text-lg">
                        Manage bookings and visualize fleet availability.
                    </p>
                </div>
            </div>

            <BookingCalendar />
        </div>
    );
}
