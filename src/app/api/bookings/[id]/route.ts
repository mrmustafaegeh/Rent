import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { sendBookingConfirmationEmail } from '@/lib/emailService';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { status } = await request.json();
        const { id } = await params;
        
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
        }

        if (!process.env.JWT_SECRET) {
             return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string, role: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user || (user.role !== 'ADMIN' && user.role !== 'PARTNER')) {
            return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
        }

        const booking = await prisma.booking.update({
            where: { id },
            data: { status: (status as string).toUpperCase() as any }, // Normalizing status
            include: {
                vehicle: true,
                customer: true
            }
        });
        
        // If confirmed, maybe send another email or update vehicle availability (not implemented here yet)
        if (status === 'confirmed' || status === 'CONFIRMED') {
             // Handle email sending
             // Note: customer is relation, name might be split or stored as `name`.
             // In Prisma schema User has `name`.
             const customerName = booking.customer.name || 'Valued Customer';
             
             sendBookingConfirmationEmail(booking.customer.email, {
                bookingNumber: booking.bookingNumber,
                vehicleName: `${booking.vehicle.brand} ${booking.vehicle.vehicleModel}`,
                startDate: booking.startDate.toISOString(), // ensure string format if needed by email service
                endDate: booking.endDate.toISOString(),
                pickupLocation: booking.pickupLocation || '',
                dropoffLocation: booking.dropoffLocation || '',
                totalPrice: Number(booking.totalPrice),
                status: 'Confirmed'
            }).catch(console.error);
        }

        return NextResponse.json({ success: true, data: booking });
    } catch (error: any) {
        console.error('Error updating booking:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
        }
        return NextResponse.json({ success: false, error: 'Failed to update booking' }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                vehicle: true,
                customer: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });
            
        if (!booking) {
            return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: booking });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch booking' }, { status: 500 });
    }
}
