import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { 
        firstName, lastName, email, phone, password, // User details
        companyName, companyEmail, companyPhone, companyAddress, companyDescription // Company details
    } = body;

    // 1. Validation
    if (!email || !password || !firstName || !lastName || !companyName) {
        return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    // 2. Check if user exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`.trim();

    // 3. Transactions for User and Company creation
    const result = await prisma.$transaction(async (tx: any) => {
        // Create Company
        const company = await tx.company.create({
            data: {
                name: companyName,
                email: companyEmail || email,
                phone: companyPhone || phone,
                address: companyAddress,
            }
        });

        // Create User
        const user = await tx.user.create({
            data: {
                name: fullName,
                email,
                phone,
                password: hashedPassword,
                role: 'PARTNER',
                companyId: company.id
            }
        });

        return { user, company };
    });

    // 4. Return success
    return NextResponse.json({ 
        success: true, 
        message: 'Partner account created. Please wait for admin approval.',
        data: {
            user: { id: result.user.id, email: result.user.email, role: result.user.role },
            company: { id: result.company.id, name: result.company.name }
        }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Partner register error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
