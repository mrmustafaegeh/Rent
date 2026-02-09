import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { sendBookingConfirmationEmail } from '@/lib/emailService';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const { status } = await request.json();
        
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
        const user = await User.findById(decoded.id);

        if (!user || (user.role !== 'admin' && user.role !== 'company_owner')) {
            return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
        }

        const booking = await Booking.findByIdAndUpdate(
            params.id, 
            { status }, 
            { new: true }
        ).populate('vehicle').populate('customer');

        if (!booking) {
            return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
        }

        // If confirmed, maybe send another email or update vehicle availability (not implemented here yet)
        if (status === 'confirmed') {
             const populatedBooking = booking as any;
             sendBookingConfirmationEmail(populatedBooking.customer.email, {
                bookingNumber: populatedBooking.bookingNumber,
                vehicleName: `${populatedBooking.vehicle.brand} ${populatedBooking.vehicle.vehicleModel}`,
                startDate: populatedBooking.startDate,
                endDate: populatedBooking.endDate,
                pickupLocation: populatedBooking.pickupLocation,
                dropoffLocation: populatedBooking.dropoffLocation,
                totalPrice: populatedBooking.totalPrice,
                status: 'Confirmed'
            }).catch(console.error);
        }

        return NextResponse.json({ success: true, data: booking });
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json({ success: false, error: 'Failed to update booking' }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const booking = await Booking.findById(params.id)
            .populate('vehicle')
            .populate('customer', 'firstName lastName email phone');
            
        if (!booking) {
            return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: booking });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch booking' }, { status: 500 });
    }
}
