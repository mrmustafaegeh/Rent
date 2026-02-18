import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import jwt from 'jsonwebtoken';

// Helper to get authenticated user ID
async function getUserId(req: NextRequest) {
    // Try custom JWT first
    const token = req.cookies.get('token')?.value;
    if (token && process.env.JWT_SECRET) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
            return decoded.id;
        } catch (error) {
            // Token invalid, try NextAuth
        }
    }

    // Fallback to NextAuth session
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        return user?.id;
    }

    return null;
}

// GET - Fetch user's wishlist
export async function GET(req: NextRequest) {
    try {
        const userId = await getUserId(req);

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        let wishlist = await prisma.wishlist.findUnique({
            where: { userId },
            include: { vehicles: true }
        });
        
        if (!wishlist) {
            wishlist = await prisma.wishlist.create({
                data: { userId },
                include: { vehicles: true }
            });
        }

        return NextResponse.json({ success: true, data: wishlist });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message || 'An error occurred' }, { status: 500 });
    }
}

// POST - Add vehicle to wishlist
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserId(req);

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { vehicleId } = await req.json();

        // Check if exists
        const wishlist = await prisma.wishlist.findUnique({
             where: { userId },
             include: { vehicles: { where: { id: vehicleId } } }
        });

        if (wishlist && wishlist.vehicles.length > 0) {
             return NextResponse.json({ success: false, message: 'Already in wishlist' }, { status: 400 });
        }

        // Add
        const updatedWishlist = await prisma.wishlist.upsert({
            where: { userId },
            create: {
                userId,
                vehicles: { connect: { id: vehicleId } }
            },
            update: {
                vehicles: { connect: { id: vehicleId } }
            },
            include: { vehicles: true }
        });

        return NextResponse.json({ success: true, data: updatedWishlist });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message || 'An error occurred' }, { status: 500 });
    }
}

// DELETE - Remove vehicle from wishlist
export async function DELETE(req: NextRequest) {
    try {
        const userId = await getUserId(req);

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const vehicleId = searchParams.get('vehicleId');

        if (!vehicleId) {
             return NextResponse.json({ success: false, message: 'Missing vehicle ID' }, { status: 400 });
        }

        const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
        
        if (!wishlist) {
            return NextResponse.json({ success: false, message: 'Wishlist not found' }, { status: 404 });
        }

        const updatedWishlist = await prisma.wishlist.update({
             where: { userId },
             data: {
                 vehicles: { disconnect: { id: vehicleId } }
             },
             include: { vehicles: true }
        });

        return NextResponse.json({ success: true, data: updatedWishlist });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message || 'An error occurred' }, { status: 500 });
    }
}
