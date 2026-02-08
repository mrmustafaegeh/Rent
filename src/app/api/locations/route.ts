import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Location from '@/models/Location';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Parse query params if we want to filter by city later
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    const query: any = {};
    if (city) query.city = { $regex: new RegExp(city, 'i') };

    const locations = await Location.find(query);
    
    return NextResponse.json({ success: true, locations });
  } catch (error: any) {
    console.error('Location fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch locations' }, { status: 500 });
  }
}
