import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    
    // Find user and include company
    const user = await prisma.user.findUnique({
        where: { id: decoded.id || (decoded as any).userId }, // Handle both payload formats
        include: { company: true }
    });
    
    if (!user || !user.company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, company: user.company });
  } catch (error) {
    console.error('Fetch company error:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}
