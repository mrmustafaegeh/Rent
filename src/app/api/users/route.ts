import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            companyId: true
        }
    });

    const usersWithNames = users.map(user => {
        const nameParts = (user.name || '').split(' ');
        return {
            ...user,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || ''
        };
    });

    return NextResponse.json({ success: true, data: usersWithNames });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
