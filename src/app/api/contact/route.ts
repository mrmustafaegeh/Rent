import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const message = await prisma.message.create({
      data: {
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.name,
        email: data.email,
        phone: data.phone,
        content: data.content || data.message,
      }
    });

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
