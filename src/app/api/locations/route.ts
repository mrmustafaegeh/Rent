import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Parse query params if we want to filter by city later
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    const query: any = {};
    if (city) {
        query.city = { contains: city, mode: 'insensitive' };
    }

    const locations = await prisma.location.findMany({
        where: query
    });
    
    return NextResponse.json({ success: true, locations });
  } catch (error: any) {
    console.error('Location fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch locations' }, { status: 500 });
  }
}
