import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Vehicle from '@/models/Vehicle';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { sendBookingConfirmationEmail } from '@/lib/emailService';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate required fields
    const { customer, vehicleId, startDate, endDate, pickupLocation, dropoffLocation, totalPrice, status, paymentStatus } = body;
    
    if (!customer?.email || !vehicleId || !startDate || !endDate || !pickupLocation || !dropoffLocation) {
        return NextResponse.json({ error: 'Missing required booking information' }, { status: 400 });
    }
    
    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    // Find or create customer
    let user = await User.findOne({ email: customer.email });
    
    if (!user) {
         // Create a new user for the guest
         const randomPassword = crypto.randomBytes(8).toString('hex');
         user = await User.create({
             firstName: customer.firstName || 'Guest',
             lastName: customer.lastName || 'User',
             email: customer.email,
             phone: customer.phone,
             password: randomPassword,
             role: 'customer'
         });
         
         // In a real app, send welcome email with password reset link here
    }

    const booking = await Booking.create({
        customer: user._id,
        vehicle: vehicleId,
        company: vehicle.company,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        totalPrice: totalPrice || 0, // Fallback if not provided (though frontend sends it)
        status: status || 'pending',
        paymentStatus: paymentStatus || 'pending'
    });

    // Send Confirmation Email (Fire and forget)
    sendBookingConfirmationEmail(user.email, {
        bookingNumber: booking.bookingNumber,
        vehicleName: `${vehicle.brand} ${vehicle.vehicleModel}`,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        totalPrice: booking.totalPrice,
        status: booking.status
    }).catch(console.error);
    
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        let query = {};
        if (user.role === 'customer') {
            query = { customer: user._id };
        } else if (user.role === 'company_owner') {
             // Find vehicles owned by this user or their company
             const vehicleQuery: any = { $or: [{ owner: user._id }] };
             if (user.companyId) {
                 vehicleQuery.$or.push({ company: user.companyId });
             }
             
             const vehicles = await Vehicle.find(vehicleQuery).select('_id');
             const vehicleIds = vehicles.map(v => v._id);
             
             // Filter bookings for these vehicles
             query = { vehicle: { $in: vehicleIds } };
        }
        
        const bookings = await Booking.find(query)
            .populate('vehicle')
            .populate('customer', 'firstName lastName email')
            .sort({ createdAt: -1 });
        
        return NextResponse.json({ success: true, data: bookings });
    } catch (error) {
        console.error('Booking fetch error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
    }
}
