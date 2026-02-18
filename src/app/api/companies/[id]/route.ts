import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const company = await prisma.company.findUnique({
        where: { id },
        include: {
            users: {
                where: { role: 'PARTNER' },
                select: { name: true, email: true, phone: true }
            }
        }
    });

    if (!company) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Map owner data
    const owner = company.users[0];
    let ownerData = null;
    
    if (owner) {
        const names = owner.name ? owner.name.split(' ') : [''];
        ownerData = {
            firstName: names[0],
            lastName: names.slice(1).join(' ') || '',
            email: owner.email,
            phone: owner.phone
        };
    }

    return NextResponse.json({
        ...company,
        owner: ownerData,
        users: undefined
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { isActive } = body;

        const company = await prisma.company.update({
            where: { id },
            data: { isActive }
        });
        
        return NextResponse.json(company);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
    }
}
