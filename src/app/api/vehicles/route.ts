import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import { getVehicles, VehicleFilterParams } from '@/lib/vehicleService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params: VehicleFilterParams = {
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      seats: searchParams.get('seats') ? parseInt(searchParams.get('seats')!) : undefined,
      transmission: searchParams.get('transmission') || undefined,
      fuelType: searchParams.get('fuelType') || undefined,
      search: searchParams.get('search') || undefined,
      featured: searchParams.get('featured') === 'true',
      sort: searchParams.get('sort') || 'newest',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 12,
    };
    
    const result = await getVehicles(params);
    
    return NextResponse.json({
      success: true,
      vehicles: result.vehicles,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Vehicle fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Basic validation
    if (!body.brand || !body.vehicleModel || !body.category || !body.company) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (!body.pricing || !body.pricing.daily) {
        return NextResponse.json({ error: 'Daily pricing is required' }, { status: 400 });
    }

    const vehicle = await Vehicle.create(body);
    return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create vehicle' }, { status: 500 });
  }
}
