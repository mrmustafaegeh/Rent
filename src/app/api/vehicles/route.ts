import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getVehicles } from '@/services/vehicleService';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const my = searchParams.get('my') === 'true';
    let ownerId;

    if (my) {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
             return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            ownerId = decoded.id;
        } catch(err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
    }

    const params = {
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
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : (my ? 50 : 12),
      ownerId,
      status: searchParams.get('status') || undefined,
      type: (searchParams.get('type') as any) || 'rent',
      startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
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
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Basic validation
    if (!body.brand || !body.vehicleModel || !body.category) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const vehicleData: any = {
        brand: body.brand,
        vehicleModel: body.vehicleModel,
        year: parseInt(body.year) || 2024,
        category: body.category.toUpperCase(),
        type: body.type || 'rent',
        transmission: (body.transmission || 'AUTOMATIC').toUpperCase(),
        fuelType: (body.fuelType || 'PETROL').toUpperCase(),
        seats: parseInt(body.seats) || 5,
        doors: parseInt(body.doors) || 4,
        description: body.description,
        ownerId: user.id,
        status: 'APPROVED', // Default for now
    };

    if (vehicleData.type === 'rent') {
        vehicleData.dailyPrice = parseFloat(body.dailyPrice || body.pricing?.daily || body.priceDaily || 0);
        vehicleData.weeklyPrice = parseFloat(body.weeklyPrice || body.pricing?.weekly || body.priceWeekly) || null;
        vehicleData.monthlyPrice = parseFloat(body.monthlyPrice || body.pricing?.monthly || body.priceMonthly) || null;
    } else {
        vehicleData.salePrice = parseFloat(body.salePrice || 0);
    }

    const vehicle = await prisma.vehicle.create({
        data: {
            ...vehicleData,
            images: {
                create: body.images?.map((img: any) => ({ url: img.url })) || []
            }
        }
    });

    return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
  } catch (error: any) {
    console.error('Vehicle creation error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create vehicle' }, { status: 500 });
  }
}
