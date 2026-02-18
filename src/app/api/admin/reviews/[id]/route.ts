import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
        
        // Double check admin status from DB if needed, or rely on token role
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user || user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { action } = body;

        if (action === 'approve') {
            await prisma.review.update({
                where: { id },
                data: { isApproved: true }
            });
        } else if (action === 'reject') {
            await prisma.review.delete({
                where: { id }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[REVIEW_ACTION]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
