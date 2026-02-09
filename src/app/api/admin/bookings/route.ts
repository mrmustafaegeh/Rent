import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Vehicle from '@/models/Vehicle';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// Helper to authenticate admin/company owner
async function authorizeAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
        if (decoded.role === 'admin' || decoded.role === 'company_owner') {
             await dbConnect();
             return User.findById(decoded.id);
        }
    } catch (e) {
        return null;
    }
    return null;
}

export async function GET(request: Request) {
    const adminUser = await authorizeAdmin();
    if (!adminUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');

    let query: any = {};
    if (vehicleId) {
        query.vehicle = vehicleId;
    }

    // specific logic for company owner to only see their company bookings
    if (adminUser.role === 'company_owner') {
         const vehicleQuery: any = { $or: [{ owner: adminUser._id }] };
         if (adminUser.companyId) vehicleQuery.$or.push({ company: adminUser.companyId });
         const vehicles = await Vehicle.find(vehicleQuery).select('_id');
         // Use existing query object
         query.vehicle = { $in: vehicles.map((v: any) => v._id) };
    }

    try {
        const bookings = await Booking.find(query)
            .populate('vehicle', 'brand vehicleModel images')
            .populate('customer', 'firstName lastName email phone')
            .sort({ startDate: 1 });

        return NextResponse.json({ success: true, data: bookings });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const adminUser = await authorizeAdmin();
    if (!adminUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, status } = body;

        const booking = await Booking.findById(id).populate('vehicle');
        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (adminUser.role === 'company_owner') {
             const vehicle = booking.vehicle as any;
             const isOwner = vehicle.owner && vehicle.owner.toString() === adminUser._id.toString();
             const isCompany = adminUser.companyId && vehicle.company && vehicle.company.toString() === adminUser.companyId.toString();
             
             if (!isOwner && !isCompany) {
                 return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
             }
        }

        booking.status = status;
        await booking.save();
        
        return NextResponse.json({ success: true, booking });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update booking' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const adminUser = await authorizeAdmin();
    if (!adminUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
        vehicleId, 
        startDate, 
        endDate, 
        pickupLocation, 
        dropoffLocation, 
        price, // Override price if needed
        customerEmail,
        customerName, // "FirstName LastName"
        customerPhone
    } = body;

    if (!vehicleId || !startDate || !endDate || !customerEmail) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        // 1. Check Vehicle
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });

        // 2. Find or Create User
        let user = await User.findOne({ email: customerEmail });
        if (!user) {
            // Create a new user with random password
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            const names = customerName ? customerName.split(' ') : ['Guest', 'User'];
            
            user = await User.create({
                firstName: names[0],
                lastName: names.slice(1).join(' ') || 'User',
                email: customerEmail,
                password: hashedPassword,
                role: 'customer',
                phone: customerPhone || ''
            });

            // Ideally send welcome email with password, skipping for now
        }

        // 3. Create Booking
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Calculate price if not provided
        let adminPrice = price;
        if (!adminPrice) {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
            adminPrice = diffDays * vehicle.pricing.daily;
        }

        const booking = await Booking.create({
            customer: user._id,
            vehicle: vehicleId,
            company: vehicle.company,
            startDate: start,
            endDate: end,
            pickupLocation: pickupLocation || vehicle.location || 'Office',
            dropoffLocation: dropoffLocation || vehicle.location || 'Office',
            totalPrice: adminPrice,
            status: 'confirmed', // Admin bookings are auto-confirmed
            notes: [{
                text: 'Created by Admin/Owner manually',
                addedBy: adminUser._id,
                date: new Date()
            }]
        });

        // 4. Update vehicle availability? 
        // Usually we don't set available=false unless it's out of fleet. 
        // Availability is determined by checking booking overlaps.
        
        return NextResponse.json({ success: true, booking });
    } catch (error) {
        console.error('Admin booking creation failed', error);
        return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 });
    }
}
