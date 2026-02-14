import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Vehicle from '@/models/Vehicle';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { vehicleId, rating, comment } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ vehicle: vehicleId, user: user._id });
    if (existingReview) {
        return NextResponse.json({ success: false, error: 'You have already reviewed this vehicle' }, { status: 400 });
    }

    const review = await Review.create({
        vehicle: vehicleId,
        user: user._id,
        rating,
        comment,
        isApproved: true // Auto-allow for MVP
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error('Create Review Error:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: number }).code === 11000) {
        return NextResponse.json({ success: false, error: 'You have already reviewed this vehicle' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create review' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const vehicleId = searchParams.get('vehicleId');

        if (!vehicleId) {
            return NextResponse.json({ success: false, error: 'Vehicle ID required' }, { status: 400 });
        }

        const reviews = await Review.find({ vehicle: vehicleId, isApproved: true })
            .populate('user', 'firstName lastName image')
            .sort({ createdAt: -1 });
        
        return NextResponse.json({ success: true, data: reviews });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
