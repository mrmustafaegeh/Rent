
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    const message = await Message.create(data);

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
