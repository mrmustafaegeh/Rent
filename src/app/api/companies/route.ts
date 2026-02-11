import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    await dbConnect();
    
    let query: any = {};
    if (status === 'pending') {
        query.isActive = false;
    } else if (status === 'approved') {
        query.isActive = true;
    }

    const companies = await Company.find(query).populate('owner', 'firstName lastName email phone').sort({ createdAt: -1 });
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}
