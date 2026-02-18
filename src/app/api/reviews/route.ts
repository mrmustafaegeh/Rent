import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vehicleId, rating, comment, bookingId } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
        where: { vehicleId, userId: user.id }
    });
    
    if (existingReview) {
        return NextResponse.json({ success: false, error: 'You have already reviewed this vehicle' }, { status: 400 });
    }

    const review = await prisma.review.create({
        data: {
            vehicleId,
            userId: user.id,
            rating,
            comment,
            bookingId: bookingId || undefined,
            isApproved: true // Auto-allow for MVP
        }
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    console.error('Create Review Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create review' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const vehicleId = searchParams.get('vehicleId');

        if (!vehicleId) {
            return NextResponse.json({ success: false, error: 'Vehicle ID required' }, { status: 400 });
        }

        const reviews = await prisma.review.findMany({
            where: { vehicleId, isApproved: true },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        return NextResponse.json({ success: true, data: reviews });
    } catch (error) {
        console.error('Fetch Reviews Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
