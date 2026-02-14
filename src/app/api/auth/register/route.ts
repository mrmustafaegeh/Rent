import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { sendWelcomeEmail } from '@/lib/emailService';
import { rateLimit, getIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = getIp(request);
    if (rateLimit(ip, 3, 60000 * 60)) { // 3 registrations per hour per IP to prevent spam
      return NextResponse.json({ success: false, error: 'Too many registration attempts, please try again later.' }, { status: 429 });
    }

    await dbConnect();
    const { firstName, lastName, email, password, phone, role } = await request.json();

    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'customer'
    });

    // Send Welcome Email (Fire and forget)
    sendWelcomeEmail(email, firstName).catch(console.error);

    const token = jwt.sign({ id: user._id } as object, process.env.JWT_SECRET as string, {
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
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      }
    }, { status: 201 });

    response.headers.set('Set-Cookie', serialized);
    return response;

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
