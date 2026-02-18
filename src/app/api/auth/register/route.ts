import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { sendWelcomeEmail } from '@/lib/emailService';
import { rateLimit, getIp } from '@/lib/rateLimit';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const ip = getIp(request);
    if (rateLimit(ip, 3, 60000 * 60)) { // 3 registrations per hour per IP to prevent spam
      return NextResponse.json({ success: false, error: 'Too many registration attempts, please try again later.' }, { status: 429 });
    }

    const { firstName, lastName, email, password, phone } = await request.json();

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();

    const user = await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: hashedPassword,
        phone,
        role: 'CUSTOMER'
      }
    });

    // Send Welcome Email (Fire and forget)
    sendWelcomeEmail(email, firstName || 'there').catch(console.error);

    const token = jwt.sign({ id: user.id } as object, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRE || '30d') as jwt.SignOptions['expiresIn']
    });

    const serialized = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, { status: 201 });

    response.headers.set('Set-Cookie', serialized);
    return response;

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
