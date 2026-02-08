import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Get token from cookies or auth header
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            const user = await User.findById(decoded.id);
            if (!user) {
                 return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 });
            }
            return NextResponse.json({ success: true, data: user });
        } catch (err) {
             // If token verify fails, maybe try NextAuth? No, if token is present but invalid, it's 401.
             return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
        }
    }

    // Fallback: Check NextAuth Session
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email as string });
        if (user) {
             return NextResponse.json({ success: true, data: user });
        }
    }

    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const body = await request.json();
        
        // Fields allowed to be updated
        const updateData: any = {};
        if (body.firstName) updateData.firstName = body.firstName;
        if (body.lastName) updateData.lastName = body.lastName;
        if (body.phone) updateData.phone = body.phone;
        if (body.image) {
            // Basic validation to prevent non-http(s) schemes
            if (!body.image.startsWith('http')) {
                 return NextResponse.json({ success: false, error: 'Invalid image URL' }, { status: 400 });
            }
            updateData.image = body.image;
        }
        if (body.address) updateData.address = body.address;
        if (body.preferences) updateData.preferences = body.preferences;

        const user = await User.findByIdAndUpdate(
            decoded.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        
        return NextResponse.json({ success: true, data: user });
    } catch (err) {
        return NextResponse.json({ success: false, error: 'Not authorized or invalid data' }, { status: 401 });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
