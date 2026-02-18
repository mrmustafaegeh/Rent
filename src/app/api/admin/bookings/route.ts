import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { sendEmail, emailTemplates } from '@/lib/email';
import { generateContractBuffer } from '@/lib/pdf/generateContractBuffer';

// Helper to authenticate admin/company owner
async function authorizeAdmin(req?: Request) {
    try {
        // Try to get token from cookies first
        const cookieStore = await cookies();
        let token = cookieStore.get('token')?.value;
        
        // If no token in cookies, try Authorization header
        if (!token && req) {
            const authHeader = req.headers.get('Authorization');
            if (authHeader) {
                token = authHeader.startsWith('Bearer ') 
                    ? authHeader.substring(7) 
                    : authHeader;
            }
        }

        if (!token) return null;

        if (!process.env.JWT_SECRET) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { 
            id: string; 
            userId?: string;
            role: string;
        };
        
        const userId = decoded.id || decoded.userId;
        if (!userId) return null;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        
        if (!user) return null;

        // Check if user has admin privileges
        const isAdmin = user.role === 'ADMIN';
        const isPartner = user.role === 'PARTNER'; // mapped from company_owner
        
        if (isAdmin || isPartner) {
            return user;
        }
        
    } catch (error: any) {
        console.error('[AUTH] Authorization error:', error.message);
    }
    
    return null;
}

// GET - Fetch bookings
export async function GET(request: Request) {
    const adminUser = await authorizeAdmin(request);
    
    if (!adminUser) {
        return NextResponse.json({ 
            success: false,
            error: 'Unauthorized',
            message: 'Admin authentication required.' 
        }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const vehicleId = searchParams.get('vehicleId');
        
        let where: any = {};
        
        // Filter by vehicle if specified
        if (vehicleId) {
            where.vehicleId = vehicleId;
        }

        // If company owner, filter by their vehicles only
        if (adminUser.role === 'PARTNER') {
            // Find all vehicles owned by this partner or their company
            const ownedVehicles = await prisma.vehicle.findMany({
                where: {
                    OR: [
                        { ownerId: adminUser.id },
                        { companyId: adminUser.companyId }
                    ]
                },
                select: { id: true }
            });
            
            const ownedVehicleIds = ownedVehicles.map((v: { id: string }) => v.id);

            if (vehicleId) {
                // Check if the specified vehicle is owned by this partner
                if (!ownedVehicleIds.includes(vehicleId)) {
                    return NextResponse.json({ 
                        success: false,
                        error: 'Unauthorized',
                        message: 'You do not have access to bookings for this vehicle' 
                    }, { status: 403 });
                }
            } else {
                // Filter all bookings by owned vehicles
                where.vehicleId = { in: ownedVehicleIds };
            }
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                vehicle: {
                    select: {
                        brand: true,
                        vehicleModel: true,
                        // images: true, // Prisma relation returns array of objects usually without select unless using include
                    }
                },
                customer: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                        
                    }
                }
            },
            orderBy: { startDate: 'desc' }
        });

        // Map data to match frontend expectations (handling name split and images)
        // Since we removed vehicle images relation in schema view earlier (it was VehicleImage[] in schema), we need to fetch them if needed. 
        // Or if vehicle has `images` field from Mongoose migration? No, Prisma uses relation.
        // Let's assume frontend handles it or we map it. 
        
        // Wait, VehicleImage model exists in Prisma.
        // I need to include 'images' in vehicle include.
        
        const bookingsWithImages = await prisma.booking.findMany({
            where,
            include: {
                vehicle: {
                    include: {
                        images: true
                    }
                },
                customer: true
            },
            orderBy: { startDate: 'desc' }
        });

        const bookingsWithMappedData = bookingsWithImages.map(booking => {
            const customer = booking.customer;
            const nameParts = (customer?.name || '').split(' ');
            return {
                ...booking,
                customer: customer ? {
                    ...customer,
                    firstName: nameParts[0] || '',
                    lastName: nameParts.slice(1).join(' ') || ''
                } : null
            };
        });

        return NextResponse.json({ 
            success: true, 
            data: bookingsWithMappedData,
            count: bookingsWithMappedData.length 
        });
        
    } catch (error: any) {
        console.error('[GET] Error fetching bookings:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch bookings',
            message: error.message 
        }, { status: 500 });
    }
}

// PATCH - Update booking status
export async function PATCH(request: Request) {
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
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ 
                success: false,
                error: 'Missing required fields',
                message: 'Booking ID and status are required' 
            }, { status: 400 });
        }

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { vehicle: true }
        });
        
        if (!booking) {
            return NextResponse.json({ 
                success: false,
                error: 'Booking not found' 
            }, { status: 404 });
        }

        // Check partner authorization
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

        // Map status strings if needed or assume they match enum strings
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status: (status as string).toUpperCase() as any } 
        });

        return NextResponse.json({ 
            success: true, 
            data: updatedBooking,
            message: 'Booking status updated successfully' 
        });
        
    } catch (error: any) {
        console.error('[PATCH] Error updating booking:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to update booking',
            message: error.message 
        }, { status: 500 });
    }
}

// POST - Create manual booking
export async function POST(request: Request) {
    const adminUser = await authorizeAdmin(request);
    
    if (!adminUser) {
        return NextResponse.json({ 
            success: false,
            error: 'Unauthorized',
            message: 'Admin authentication required.' 
        }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { 
            vehicleId, 
            startDate, 
            endDate, 
            pickupLocation, 
            dropoffLocation, 
            price,
            totalPrice,
            customerEmail,
            customerName,
            customerPhone
        } = body;

        // Validation
        if (!vehicleId || !startDate || !endDate || !customerEmail) {
            return NextResponse.json({ 
                success: false,
                error: 'Missing required fields',
                message: 'Vehicle ID, dates, and customer email are required' 
            }, { status: 400 });
        }

        // 1. Check Vehicle exists
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId }
        });
        
        if (!vehicle) {
            return NextResponse.json({ 
                success: false,
                error: 'Vehicle not found' 
            }, { status: 404 });
        }

        // Check partner authorization for this vehicle
        if (adminUser.role === 'PARTNER') {
            const isOwner = vehicle.ownerId === adminUser.id;
            const isCompany = adminUser.companyId && vehicle.companyId === adminUser.companyId;
            
            if (!isOwner && !isCompany) {
                return NextResponse.json({ 
                    success: false,
                    error: 'Unauthorized',
                    message: 'You do not have access to create bookings for this vehicle' 
                }, { status: 403 });
            }
        }

        // 1.5 Check Availability
        const { checkVehicleAvailability } = await import('@/services/bookingService');
        const isAvailable = await checkVehicleAvailability({
            vehicleId,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });

        if (!isAvailable) {
            return NextResponse.json({ 
                success: false,
                error: 'Vehicle Unavailable',
                message: 'This vehicle is already booked for the selected dates.' 
            }, { status: 409 });
        }

        // 2. Find or Create User
        let user = await prisma.user.findUnique({ where: { email: customerEmail.toLowerCase() } });
        let isNewUser = false;
        
        if (!user) {
            // Create a new user with random password
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            
            user = await prisma.user.create({
                data: {
                    name: customerName || 'Guest User',
                    email: customerEmail.toLowerCase(),
                    password: hashedPassword,
                    role: 'CUSTOMER',
                    phone: customerPhone || ''
                }
            });
            isNewUser = true;
        }

        // 3. Calculate price if not provided
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end <= start) {
            return NextResponse.json({ 
                success: false,
                error: 'Invalid dates',
                message: 'End date must be after start date' 
            }, { status: 400 });
        }
        
        let bookingPrice = price || totalPrice;
        
        if (!bookingPrice) {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
            bookingPrice = diffDays * (vehicle.dailyPrice || 50); // Use dailyPrice from Prisma model
        }

        // 4. Create Booking
        const bookingNumber = `BK-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

        const booking = await prisma.booking.create({
            data: {
                bookingNumber,
                customerId: user.id,
                vehicleId,
                startDate: start,
                endDate: end,
                pickupLocation: pickupLocation || vehicle.location || 'Office',
                dropoffLocation: dropoffLocation || vehicle.location || 'Office',
                totalPrice: Number(bookingPrice),
                status: 'CONFIRMED',
                paymentStatus: 'PENDING',
                companyId: vehicle.companyId // Link booking to company if vehicle belongs to one
            },
            include: {
                vehicle: true, // Need to fetch relations for email
                customer: true
            }
        });
        
        // Send emails
        // If new user was created, send welcome email
        if (isNewUser) {
            const welcomeTemplate = emailTemplates.welcomeEmail({
                name: user.name || 'Guest',
                email: user.email,
                tempPassword: 'Please contact support for password reset'
            });
            
            await sendEmail({
                to: user.email,
                subject: welcomeTemplate.subject,
                html: welcomeTemplate.html,
                text: welcomeTemplate.text,
            });
        }
        
        // Send booking confirmation email
        const confirmationTemplate = emailTemplates.bookingConfirmation({
            customerName: user.name || 'Valued Customer',
            bookingNumber: booking.bookingNumber,
            vehicleName: `${booking.vehicle.brand} ${booking.vehicle.vehicleModel}`,
            startDate: new Date(booking.startDate).toLocaleDateString(),
            endDate: new Date(booking.endDate).toLocaleDateString(),
            totalPrice: booking.totalPrice,
            pickupLocation: booking.pickupLocation
        });
        
        // Generate Contract PDF
        let pdfBuffer: Buffer | undefined;
        try {
            pdfBuffer = await generateContractBuffer(booking);
        } catch (e) {
            console.error('Failed to generate contract for email:', e);
        }

        const emailSent = await sendEmail({
            to: user.email,
            subject: confirmationTemplate.subject,
            html: confirmationTemplate.html,
            text: confirmationTemplate.text,
            attachments: pdfBuffer ? [{
                filename: `RentalContract-${booking.bookingNumber}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf'
            }] : undefined,
        });

        return NextResponse.json({ 
            success: true, 
            data: booking,
            emailSent,
            message: emailSent 
                ? 'Booking created and confirmation email sent' 
                : 'Booking created (email not sent - check email configuration)' 
        });
        
    } catch (error: any) {
        console.error('[POST] Error creating booking:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to create booking',
            message: error.message
        }, { status: 500 });
    }
}
