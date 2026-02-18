import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query: any = {};
    if (status === 'pending') {
        query.isActive = false;
    } else if (status === 'approved') {
        query.isActive = true;
    }

    const companies = await prisma.company.findMany({
        where: query,
        include: {
            users: {
                where: { role: 'PARTNER' },
                select: { 
                    name: true, 
                    email: true, 
                    phone: true 
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const formattedCompanies = companies.map((company: any) => {
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

        return {
            ...company,
            owner: ownerData,
            users: undefined // Remove users array from response to match matching Mongoose behavior closely
        };
    });

    return NextResponse.json(formattedCompanies);
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}
