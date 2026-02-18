import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

async function authorizeAdmin() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        
        if (user && user.role === 'ADMIN') {
            return user;
        }
    } catch (error) {
        console.error('Auth error:', error);
    }
    return null;
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await authorizeAdmin();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();

        const updatedMessage = await prisma.message.update({
            where: { id },
            data: {
                status: body.status
            }
        });

        return NextResponse.json({ success: true, data: updatedMessage });
    } catch (error) {
        console.error('Update message error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update message' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await authorizeAdmin();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.message.delete({ where: { id } });
        return NextResponse.json({ success: true, message: 'Message deleted' });
    } catch (error) {
        console.error('Delete message error:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete message' }, { status: 500 });
    }
}
