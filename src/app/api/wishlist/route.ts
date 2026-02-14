import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

// GET - Fetch user's wishlist
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Try custom JWT first
        const token = req.cookies.get('token')?.value;
        let userId = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
                userId = decoded.id;
            } catch (error) {
                // Token invalid, try NextAuth
            }
        }

        // Fallback to NextAuth session
        if (!userId) {
            const session = await getServerSession(authOptions);
            if (session?.user?.email) {
                const user = await User.findOne({ email: session.user.email as string });
                userId = user?._id;
            }
        }

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        let wishlist = await Wishlist.findOne({ user: userId }).populate('vehicles');
        
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, vehicles: [] });
        }

        return NextResponse.json({ success: true, data: wishlist });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}

// POST - Add vehicle to wishlist
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { vehicleId } = await req.json();

        // Try custom JWT first
        const token = req.cookies.get('token')?.value;
        let userId = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
                userId = decoded.id;
            } catch (error) {
                // Token invalid, try NextAuth
            }
        }

        // Fallback to NextAuth session
        if (!userId) {
            const session = await getServerSession(authOptions);
            if (session?.user?.email) {
                const user = await User.findOne({ email: session.user.email as string });
                userId = user?._id;
            }
        }

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        let wishlist = await Wishlist.findOne({ user: userId });
        
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, vehicles: [vehicleId] });
        } else {
            // Check if already in wishlist
            if (wishlist.vehicles.includes(vehicleId)) {
                return NextResponse.json({ success: false, message: 'Already in wishlist' }, { status: 400 });
            }
            wishlist.vehicles.push(vehicleId);
            await wishlist.save();
        }

        return NextResponse.json({ success: true, data: wishlist });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}

// DELETE - Remove vehicle from wishlist
export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const vehicleId = searchParams.get('vehicleId');

        // Try custom JWT first
        const token = req.cookies.get('token')?.value;
        let userId = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
                userId = decoded.id;
            } catch (error) {
                // Token invalid, try NextAuth
            }
        }

        // Fallback to NextAuth session
        if (!userId) {
            const session = await getServerSession(authOptions);
            if (session?.user?.email) {
                const user = await User.findOne({ email: session.user.email as string });
                userId = user?._id;
            }
        }

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const wishlist = await Wishlist.findOne({ user: userId });
        
        if (!wishlist) {
            return NextResponse.json({ success: false, message: 'Wishlist not found' }, { status: 404 });
        }

        // Filter out the vehicle
        if (wishlist.vehicles) {
             wishlist.vehicles = wishlist.vehicles.filter((id: { toString: () => string }) => id.toString() !== vehicleId);
             await wishlist.save();
        }

        return NextResponse.json({ success: true, data: wishlist });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}
