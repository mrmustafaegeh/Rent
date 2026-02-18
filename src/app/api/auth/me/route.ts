import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: Request) {
  try {
    // Get token from cookies or auth header
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            const user = await prisma.user.findUnique({ where: { id: decoded.id } });
            if (!user) {
                 return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 });
            }
            const nameParts = (user.name || '').split(' ');
            const userData = {
                ...user,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || ''
            };
            return NextResponse.json({ success: true, data: userData });
        } catch (err) {
             return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
        }
    }

    // Fallback: Check NextAuth Session
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({ where: { email: session.user.email as string } });
        if (user) {
             const nameParts = (user.name || '').split(' ');
             const userData = {
                 ...user,
                 firstName: nameParts[0] || '',
                 lastName: nameParts.slice(1).join(' ') || ''
             };
             return NextResponse.json({ success: true, data: userData });
        }
    }

    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });

  } catch (error: any) {
    console.error('Me GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
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
        if (body.name) updateData.name = body.name;
        // If legacy frontend sends firstName/lastName
        else if (body.firstName || body.lastName) {
            updateData.name = `${body.firstName || ''} ${body.lastName || ''}`.trim();
        }
        
        if (body.phone) updateData.phone = body.phone;
        if (body.image) {
            if (!body.image.startsWith('http')) {
                 return NextResponse.json({ success: false, error: 'Invalid image URL' }, { status: 400 });
            }
            updateData.image = body.image;
        }

        const user = await prisma.user.update({
            where: { id: decoded.id },
            data: updateData
        });
        
        return NextResponse.json({ success: true, data: user });
    } catch (err) {
        console.error('Me PUT Auth Error:', err);
        return NextResponse.json({ success: false, error: 'Not authorized or invalid data' }, { status: 401 });
    }

  } catch (error: any) {
    console.error('Me PUT Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
