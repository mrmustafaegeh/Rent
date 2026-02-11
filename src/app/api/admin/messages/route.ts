import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; 
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
export async function GET(req: Request) {
  try {
    // Check NextAuth session first
    const session = await getServerSession(authOptions);
    let userRole = null;
    let userEmail = null;

    if (session && session.user) {
        userRole = (session.user as any).role;
        userEmail = session.user.email;
    } else {
        // Fallback: Check custom JWT token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
                const dbUser = await User.findById(decoded.id);
                if (dbUser) {
                    userRole = dbUser.role;
                    userEmail = dbUser.email;
                }
            } catch (err) {
                console.error("JWT Verification failed:", err);
            }
        }
    }

    // Detailed logging for debugging
    console.log("Admin Messages API Request:", {
      sessionExists: !!session,
      tokenExists: !!(await cookies()).get('token'),
      role: userRole,
      email: userEmail
    });

    // Enforce Admin Role
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ 
        error: `Unauthorized: User role '${userRole}' is not 'admin'`,
        debug: { role: userRole, email: userEmail } 
      }, { status: 401 });
    }

    await dbConnect();
    const messages = await Message.find({}).sort({ createdAt: -1 });
    console.log(`Found ${messages.length} messages for admin`);

    return NextResponse.json({ 
        success: true, 
        messages,
        debug: {
            count: messages.length,
            user: userEmail,
            role: userRole
        }
    });
  } catch (error: any) {
    console.error("Admin Messages API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
