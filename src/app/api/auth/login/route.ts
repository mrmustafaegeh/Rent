import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { rateLimit, getIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = getIp(request);
    if (rateLimit(ip, 5, 60000)) { // 5 requests per minute
      return NextResponse.json({ success: false, error: 'Too many requests, please try again later.' }, { status: 429 });
    }

    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Please provide an email and password' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

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
    }, { status: 200 });

    response.headers.set('Set-Cookie', serialized);
    return response;

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
