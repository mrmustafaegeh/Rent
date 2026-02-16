import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import { getVehicles, VehicleFilterParams } from '@/lib/vehicleService';
import User from '@/models/User';
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
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : (my ? 50 : 12),
      owner: ownerId,
      status: searchParams.get('status') || undefined,
      type: (searchParams.get('type') as any) || 'rent'
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
    
    // Authenticate
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    let user;
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            user = await User.findById(decoded.id);
        } catch(e) {}
    }

    if (!user) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Basic validation
    if (!body.brand || !body.vehicleModel || !body.category) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (!body.type || body.type === 'rent') {
        // Only Admin/Owner can list rentals
        if (user.role !== 'admin' && user.role !== 'company_owner') {
             return NextResponse.json({ error: 'Only partners can list rentals.' }, { status: 403 });
        }

        if (!body.pricing || !body.pricing.daily) {
            return NextResponse.json({ error: 'Daily pricing is required for rental vehicles' }, { status: 400 });
        }
        
        // Auto-approve rentals from verified partners/admins
        if (!body.status) body.status = 'approved';

    } else if (body.type === 'sale') {
        if (!body.salePrice) {
             return NextResponse.json({ error: 'Sale price is required' }, { status: 400 });
        }
        // Force pending status for sale listings
        body.status = 'pending';
    }

    // Assign owner
    if (!body.owner) body.owner = user._id;

    // Assign company if applicable
    if (user.role === 'company_owner' && user.companyId && !body.company) {
         body.company = user.companyId;
    }

    const vehicle = await Vehicle.create(body);
    return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create vehicle';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
