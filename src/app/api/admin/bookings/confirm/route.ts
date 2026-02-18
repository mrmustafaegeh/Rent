import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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

        const userId = decoded.id || decoded.userId;
        if (!userId) return null;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        
        if (!user) return null;

        const isAdmin = user.role === 'ADMIN';
        const isPartner = user.role === 'PARTNER';

        if (isAdmin || isPartner) {
            return user;
        }
    } catch (error) {
        console.error('[Auth] Error:', error);
    }
    return null;
}

// POST - Confirm booking and send email
export async function POST(request: Request) {
    const adminUser = await authorizeAdmin(request);
    
    if (!adminUser) {
        return NextResponse.json({ 
            success: false,
            error: 'Unauthorized',
            message: 'Admin authentication required' 
        }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { bookingId } = body;

        if (!bookingId) {
            return NextResponse.json({ 
                success: false,
                error: 'Missing booking ID' 
            }, { status: 400 });
        }

        // Find booking with populated data
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                vehicle: true,
                customer: true
            }
        });

        if (!booking) {
            return NextResponse.json({ 
                success: false,
                error: 'Booking not found' 
            }, { status: 404 });
        }

        // Check authorization for company owners
        if (adminUser.role === 'PARTNER') {
            const isOwner = booking.vehicle.ownerId === adminUser.id;
            const isCompany = adminUser.companyId && booking.vehicle.companyId === adminUser.companyId;
            
            if (!isOwner && !isCompany) {
                return NextResponse.json({ 
                    success: false,
                    error: 'Unauthorized',
                    message: 'You do not have access to this booking' 
                }, { status: 403 });
            }
        }

        // Check if already confirmed
        if (booking.status === 'CONFIRMED') {
            return NextResponse.json({ 
                success: false,
                error: 'Booking already confirmed' 
            }, { status: 400 });
        }

        // Update booking status and add note in a transaction
        const updatedBooking = await prisma.$transaction(async (tx: any) => {
            // Add confirmation note
            await tx.bookingNote.create({
                data: {
                    text: `Booking confirmed by ${adminUser.role}: ${adminUser.name}`,
                    bookingId: booking.id,
                    userId: adminUser.id
                }
            });

            // Update booking
            return await tx.booking.update({
                where: { id: booking.id },
                data: {
                    status: 'CONFIRMED',
                    paymentStatus: booking.paymentStatus === 'PENDING' ? 'PENDING' : booking.paymentStatus, // Keep existing or update? Code said pending.
                    // If payment was not processed, usually it remains pending or updated to PAID elsewhere.
                    // Original code: booking.paymentStatus = 'pending';
                },
                include: {
                    vehicle: true,
                    customer: true
                }
            });
        });

        // Prepare email data
        const customer = updatedBooking.customer;
        const vehicle = updatedBooking.vehicle;
        
        const emailData = {
            customerName: customer.name || 'Valued Customer',
            bookingNumber: updatedBooking.bookingNumber,
            vehicleName: `${vehicle.brand} ${vehicle.vehicleModel}`,
            startDate: new Date(updatedBooking.startDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            endDate: new Date(updatedBooking.endDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            totalPrice: updatedBooking.totalPrice,
            pickupLocation: updatedBooking.pickupLocation || 'Office'
        };

        // Send confirmation email
        let emailSent = false;
        try {
            const emailTemplate = emailTemplates.bookingConfirmation(emailData);
            emailSent = await sendEmail({
                to: customer.email,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
                text: emailTemplate.text,
            });
        } catch (emailError) {
            console.error('Failed to send confirmation email', emailError);
        }

        return NextResponse.json({ 
            success: true, 
            data: updatedBooking,
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

