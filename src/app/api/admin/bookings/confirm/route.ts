import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Vehicle from '@/models/Vehicle';
import User from '@/models/User';
import { sendEmail, emailTemplates } from '@/lib/email';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Helper to authenticate admin/company owner
async function authorizeAdmin(req?: Request) {
    try {
        const cookieStore = await cookies();
        let token = cookieStore.get('token')?.value;
        
        if (!token && req) {
            const authHeader = req.headers.get('Authorization');
            if (authHeader) {
                token = authHeader.startsWith('Bearer ') 
                    ? authHeader.substring(7) 
                    : authHeader;
            }
        }

        if (!token || !process.env.JWT_SECRET) {
            return null;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { 
            id: string; 
            userId?: string;
        };

        await dbConnect();
        const userId = decoded.id || decoded.userId;
        if (!userId) return null;

        const user = await User.findById(userId);
        
        if (!user || (user.role !== 'admin' && user.role !== 'company_owner')) {
            return null;
        }

        return user;
    } catch (error) {
        console.error('[Auth] Error:', error);
        return null;
    }
}

// POST - Confirm booking and send email
export async function POST(request: Request) {
    console.log('\n🟢 POST /api/admin/bookings/confirm - Request received');
    
    const adminUser = await authorizeAdmin(request);
    
    if (!adminUser) {
        console.log('❌ Unauthorized');
        return NextResponse.json({ 
            success: false,
            error: 'Unauthorized',
            message: 'Admin authentication required' 
        }, { status: 401 });
    }

    console.log('✅ Authorized as:', adminUser.email);

    try {
        await dbConnect();
        
        const body = await request.json();
        const { bookingId } = body;

        console.log('[CONFIRM] Booking ID:', bookingId);

        if (!bookingId) {
            return NextResponse.json({ 
                success: false,
                error: 'Missing booking ID' 
            }, { status: 400 });
        }

        // Find booking with populated data
        const booking = await Booking.findById(bookingId)
            .populate('vehicle', 'brand vehicleModel images owner company')
            .populate('customer', 'firstName lastName email phone');

        if (!booking) {
            console.log('[CONFIRM] ❌ Booking not found');
            return NextResponse.json({ 
                success: false,
                error: 'Booking not found' 
            }, { status: 404 });
        }

        console.log('[CONFIRM] Booking found:', booking.bookingNumber);

        // Check authorization for company owners
        if (adminUser.role === 'company_owner') {
            const vehicle = booking.vehicle as any;
            const isOwner = vehicle.owner && vehicle.owner.toString() === adminUser._id.toString();
            const isCompany = adminUser.companyId && vehicle.company && 
                            vehicle.company.toString() === adminUser.companyId.toString();
            
            if (!isOwner && !isCompany) {
                console.log('[CONFIRM] ❌ Not authorized for this booking');
                return NextResponse.json({ 
                    success: false,
                    error: 'Unauthorized',
                    message: 'You do not have access to this booking' 
                }, { status: 403 });
            }
        }

        // Check if already confirmed
        if (booking.status === 'confirmed') {
            console.log('[CONFIRM] ⚠️ Booking already confirmed');
            return NextResponse.json({ 
                success: false,
                error: 'Booking already confirmed' 
            }, { status: 400 });
        }

        // Update booking status
        booking.status = 'confirmed';
        booking.paymentStatus = 'pending'; // or 'paid' if payment was processed
        
        // Add confirmation note
        booking.notes = booking.notes || [];
        booking.notes.push({
            text: `Booking confirmed by ${adminUser.role}: ${adminUser.firstName} ${adminUser.lastName}`,
            addedBy: adminUser._id,
            date: new Date()
        });

        await booking.save();

        console.log('[CONFIRM] ✅ Booking status updated to confirmed');

        // Prepare email data
        const customer = booking.customer as any;
        const vehicle = booking.vehicle as any;
        
        const emailData = {
            customerName: `${customer.firstName} ${customer.lastName}`,
            bookingNumber: booking.bookingNumber,
            vehicleName: `${vehicle.brand} ${vehicle.vehicleModel}`,
            startDate: new Date(booking.startDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            endDate: new Date(booking.endDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            totalPrice: booking.totalPrice,
            pickupLocation: booking.pickupLocation || 'Office'
        };

        // Send confirmation email
        console.log('[CONFIRM] Sending confirmation email to:', customer.email);
        
        const emailTemplate = emailTemplates.bookingConfirmation(emailData);
        const emailSent = await sendEmail({
            to: customer.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
        });

        if (emailSent) {
            console.log('[CONFIRM] ✅ Confirmation email sent successfully');
        } else {
            console.log('[CONFIRM] ⚠️ Email service not configured or failed to send');
        }

        // Populate for response
        await booking.populate('vehicle', 'brand vehicleModel images');
        await booking.populate('customer', 'firstName lastName email phone');

        return NextResponse.json({ 
            success: true, 
            data: booking,
            emailSent,
            message: emailSent 
                ? 'Booking confirmed and email sent to customer' 
                : 'Booking confirmed (email not sent - check email configuration)'
        });
        
    } catch (error: any) {
        console.error('[CONFIRM] ❌ Error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to confirm booking',
            message: error.message 
        }, { status: 500 });
    }
}
