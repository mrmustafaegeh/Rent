import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const company = await Company.findById(id).populate('owner');
    
    if (!company) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { isActive } = body;

        await dbConnect();
        
        const company = await Company.findByIdAndUpdate(id, { isActive }, { new: true });
        
        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        return NextResponse.json(company);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
    }
}
