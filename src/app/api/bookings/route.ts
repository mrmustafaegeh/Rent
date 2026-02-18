import { NextResponse } from 'next/server';
import { generateContractBuffer } from '@/lib/pdf/generateContractBuffer';
import prisma from '@/lib/prisma';
import { createBooking } from '@/services/bookingService';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { sendBookingConfirmationEmail } from '@/lib/emailService';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { 
        customer, 
        vehicleId, 
        startDate, 
        endDate, 
        pickupLocation, 
        dropoffLocation, 
        totalPrice,
        driversLicense,
        passport,
        status,
        paymentStatus
    } = body;
    
    if (!customer?.email || !vehicleId || !startDate || !endDate || !pickupLocation || !dropoffLocation) {
        return NextResponse.json({ error: 'Missing required booking information' }, { status: 400 });
    }
    
    // Find or create customer using Prisma
    let user = await prisma.user.findUnique({ where: { email: customer.email } });
    
    if (!user) {
         // Create a new user for the guest
         const randomPassword = Math.random().toString(36).slice(-10);
         const hashedPassword = await bcrypt.hash(randomPassword, 10);
         
         user = await prisma.user.create({
             data: {
                 name: `${customer.firstName} ${customer.lastName}`,
                 email: customer.email,
                 phone: customer.phone,
                 password: hashedPassword,
                 role: 'CUSTOMER'
             }
         });
    }

    // Create booking using our service (handles availability check)
    const booking = await createBooking({
        customerId: user.id,
        vehicleId,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        totalPrice: totalPrice || 0,
        driversLicense,
        passport,
        status,
        paymentStatus
    });

    // Generate Contract PDF
    let pdfBuffer: Buffer | undefined;
    try {
        pdfBuffer = await generateContractBuffer(booking);
    } catch (e) {
        console.error('Failed to generate contract for email:', e);
    }

    // Send Confirmation Email (Fire and forget)
    // We fetch the vehicle details back from the created booking for the email
    sendBookingConfirmationEmail(user.email, {
        bookingNumber: booking.bookingNumber,
        vehicleName: `${booking.vehicle.brand} ${booking.vehicle.vehicleModel}`,
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        pickupLocation,
        dropoffLocation,
        totalPrice: booking.totalPrice,
        status: booking.status
    }, pdfBuffer).catch(console.error);
    
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error: any) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ 
        success: false, 
        error: error.message || 'Failed to create booking' 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        let where: any = {};
        
        const url = new URL(request.url);
        const fromDate = url.searchParams.get('from');
        const toDate = url.searchParams.get('to');

        if (fromDate && toDate) {
            where.AND = [
                { startDate: { lte: new Date(toDate) } },
                { endDate: { gte: new Date(fromDate) } }
            ];
        }

        if (user.role === 'CUSTOMER') {
            where.customerId = user.id;
        } else if (user.role === 'PARTNER') {
             // For partners, show bookings for their vehicles
             where.vehicle = { ownerId: user.id };
        } else if (user.role !== 'ADMIN') {
             // If not admin, partner or customer (e.g. unknown role), fallback to empty set or error
             return NextResponse.json({ success: false, error: 'Unauthorized role' }, { status: 403 });
        }
        // Admin gets all (filtered by date if provided)
        
        const bookings = await prisma.booking.findMany({
            where,
            include: {
                vehicle: {
                    include: {
                        images: true
                    }
                },
                customer: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                reviews: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        return NextResponse.json({ success: true, data: bookings });
    } catch (error) {
        console.error('Booking fetch error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
    }
}
