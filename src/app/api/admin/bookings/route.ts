import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Vehicle from '@/models/Vehicle';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { sendEmail, emailTemplates } from '@/lib/email';

// Helper to authenticate admin/company owner
async function authorizeAdmin(req?: Request) {
    console.log('\n=== AUTHORIZATION DEBUG START ===');
    
    try {
        // Try to get token from cookies first
        const cookieStore = await cookies();
        let token = cookieStore.get('token')?.value;
        
        console.log('[AUTH] Cookies available:', cookieStore.getAll().map(c => c.name));
        console.log('[AUTH] Token from cookies:', token ? 'Found' : 'Not found');
        
        // If no token in cookies, try Authorization header
        if (!token && req) {
            const authHeader = req.headers.get('Authorization');
            console.log('[AUTH] Authorization header:', authHeader ? 'Found' : 'Not found');
            
            if (authHeader) {
                // Support both "Bearer TOKEN" and just "TOKEN"
                token = authHeader.startsWith('Bearer ') 
                    ? authHeader.substring(7) 
                    : authHeader;
                console.log('[AUTH] Token extracted from header:', token ? 'Yes' : 'No');
            }
        }

        if (!token) {
            console.log('[AUTH] ❌ No token found in cookies or headers');
            console.log('=== AUTHORIZATION DEBUG END ===\n');
            return null;
        }

        // Verify JWT
        console.log('[AUTH] Attempting to verify JWT...');
        console.log('[AUTH] JWT_SECRET exists:', !!process.env.JWT_SECRET);
        
        if (!process.env.JWT_SECRET) {
            console.error('[AUTH] ❌ JWT_SECRET is not defined in environment variables!');
            console.log('=== AUTHORIZATION DEBUG END ===\n');
            return null;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { 
            id: string; 
            userId?: string;
            role: string;
            email?: string;
        };
        
        console.log('[AUTH] ✅ Token decoded successfully');
        console.log('[AUTH] Decoded payload:', {
            id: decoded.id || decoded.userId || 'missing',
            role: decoded.role || 'missing',
            email: decoded.email || 'not provided'
        });

        // Connect to database
        await dbConnect();
        console.log('[AUTH] ✅ Database connected');

        // Find user by ID (support both 'id' and 'userId' in token)
        const userId = decoded.id || decoded.userId;
        if (!userId) {
            console.log('[AUTH] ❌ No user ID in token payload');
            console.log('=== AUTHORIZATION DEBUG END ===\n');
            return null;
        }

        const user = await User.findById(userId);
        
        if (!user) {
            console.log('[AUTH] ❌ User not found in database with ID:', userId);
            console.log('=== AUTHORIZATION DEBUG END ===\n');
            return null;
        }

        console.log('[AUTH] ✅ User found in database');
        console.log('[AUTH] User details:', {
            id: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        });

        // Check if user has admin privileges
        const isAdmin = user.role === 'admin';
        const isCompanyOwner = user.role === 'company_owner';
        
        console.log('[AUTH] Role check:', {
            isAdmin,
            isCompanyOwner,
            authorized: isAdmin || isCompanyOwner
        });

        if (isAdmin || isCompanyOwner) {
            console.log('[AUTH] ✅ User authorized as:', user.role);
            console.log('=== AUTHORIZATION DEBUG END ===\n');
            return user;
        }
        
        console.log('[AUTH] ❌ User role not authorized:', user.role);
        console.log('[AUTH] Expected: "admin" or "company_owner"');
        console.log('=== AUTHORIZATION DEBUG END ===\n');
        
    } catch (error: any) {
        console.error('[AUTH] ❌ Authorization error:', error.message);
        console.error('[AUTH] Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack?.split('\n')[0]
        });
        console.log('=== AUTHORIZATION DEBUG END ===\n');
    }
    
    return null;
}

// GET - Fetch bookings
export async function GET(request: Request) {
    console.log('\n🔵 GET /api/admin/bookings - Request received');
    
    const adminUser = await authorizeAdmin(request);
    
    if (!adminUser) {
        console.log('❌ GET request rejected - Unauthorized');
        return NextResponse.json({ 
            success: false,
            error: 'Unauthorized',
            message: 'Admin authentication required. Please log in with admin credentials.' 
        }, { status: 401 });
    }

    console.log('✅ GET request authorized for user:', adminUser.email);

    try {
        await dbConnect();
        
        const { searchParams } = new URL(request.url);
        const vehicleId = searchParams.get('vehicleId');
        
        console.log('[GET] Vehicle ID filter:', vehicleId || 'None (fetching all)');

        let query: any = {};
        
        // Filter by vehicle if specified
        if (vehicleId) {
            query.vehicle = vehicleId;
            console.log('[GET] Filtering by vehicle:', vehicleId);
        }

        // If company owner, filter by their vehicles only
        if (adminUser.role === 'company_owner') {
            console.log('[GET] Company owner detected - filtering by owned vehicles');
            
            const vehicleQuery: any = { 
                $or: [{ owner: adminUser._id }] 
            };
            
            if (adminUser.companyId) {
                vehicleQuery.$or.push({ company: adminUser.companyId });
                console.log('[GET] Including company vehicles:', adminUser.companyId);
            }
            
            const vehicles = await Vehicle.find(vehicleQuery).select('_id');
            console.log('[GET] Found', vehicles.length, 'owned vehicles');
            
            if (vehicleId) {
                // Check if the specified vehicle is owned by this company owner
                const isOwned = vehicles.some((v: any) => v._id.toString() === vehicleId);
                if (!isOwned) {
                    console.log('[GET] ❌ Vehicle not owned by this company owner');
                    return NextResponse.json({ 
                        success: false,
                        error: 'Unauthorized',
                        message: 'You do not have access to bookings for this vehicle' 
                    }, { status: 403 });
                }
            } else {
                // Filter all bookings by owned vehicles
                query.vehicle = { $in: vehicles.map((v: any) => v._id) };
            }
        }

        console.log('[GET] Fetching bookings with query:', JSON.stringify(query));

        const bookings = await Booking.find(query)
            .populate('vehicle', 'brand vehicleModel images plateNumber')
            .populate('customer', 'firstName lastName email phone')
            .sort({ startDate: -1 });

        console.log('[GET] ✅ Found', bookings.length, 'bookings');

        return NextResponse.json({ 
            success: true, 
            data: bookings,
            count: bookings.length 
        });
        
    } catch (error: any) {
        console.error('[GET] ❌ Error fetching bookings:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch bookings',
            message: error.message 
        }, { status: 500 });
    }
}

// PATCH - Update booking status
export async function PATCH(request: Request) {
    console.log('\n🟡 PATCH /api/admin/bookings - Request received');
    
    const adminUser = await authorizeAdmin(request);
    
    if (!adminUser) {
        console.log('❌ PATCH request rejected - Unauthorized');
        return NextResponse.json({ 
            success: false,
            error: 'Unauthorized',
            message: 'Admin authentication required' 
        }, { status: 401 });
    }

    console.log('✅ PATCH request authorized for user:', adminUser.email);

    try {
        await dbConnect();
        
        const body = await request.json();
        const { id, status } = body;

        console.log('[PATCH] Updating booking:', id, 'to status:', status);

        if (!id || !status) {
            return NextResponse.json({ 
                success: false,
                error: 'Missing required fields',
                message: 'Booking ID and status are required' 
            }, { status: 400 });
        }

        const booking = await Booking.findById(id).populate('vehicle');
        
        if (!booking) {
            console.log('[PATCH] ❌ Booking not found:', id);
            return NextResponse.json({ 
                success: false,
                error: 'Booking not found' 
            }, { status: 404 });
        }

        // Check company owner authorization
        if (adminUser.role === 'company_owner') {
            const vehicle = booking.vehicle as any;
            const isOwner = vehicle.owner && vehicle.owner.toString() === adminUser._id.toString();
            const isCompany = adminUser.companyId && vehicle.company && vehicle.company.toString() === adminUser.companyId.toString();
            
            console.log('[PATCH] Company owner authorization check:', { isOwner, isCompany });
            
            if (!isOwner && !isCompany) {
                console.log('[PATCH] ❌ Company owner not authorized for this booking');
                return NextResponse.json({ 
                    success: false,
                    error: 'Unauthorized',
                    message: 'You do not have access to this booking' 
                }, { status: 403 });
            }
        }

        booking.status = status;
        await booking.save();
        
        console.log('[PATCH] ✅ Booking updated successfully');

        return NextResponse.json({ 
            success: true, 
            data: booking,
            message: 'Booking status updated successfully' 
        });
        
    } catch (error: any) {
        console.error('[PATCH] ❌ Error updating booking:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to update booking',
            message: error.message 
        }, { status: 500 });
    }
}

// POST - Create manual booking
export async function POST(request: Request) {
    console.log('\n🟢 POST /api/admin/bookings - Request received');
    
    const adminUser = await authorizeAdmin(request);
    
    if (!adminUser) {
        console.log('❌ POST request rejected - Unauthorized');
        return NextResponse.json({ 
            success: false,
            error: 'Unauthorized',
            message: 'Admin authentication required. Please log in with admin credentials.' 
        }, { status: 401 });
    }

    console.log('✅ POST request authorized for user:', adminUser.email);

    try {
        await dbConnect();
        
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

        console.log('[POST] Creating booking with data:', {
            vehicleId,
            startDate,
            endDate,
            customerEmail,
            customerName
        });

        // Validation
        if (!vehicleId || !startDate || !endDate || !customerEmail) {
            console.log('[POST] ❌ Missing required fields');
            return NextResponse.json({ 
                success: false,
                error: 'Missing required fields',
                message: 'Vehicle ID, dates, and customer email are required' 
            }, { status: 400 });
        }

        // 1. Check Vehicle exists
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            console.log('[POST] ❌ Vehicle not found:', vehicleId);
            return NextResponse.json({ 
                success: false,
                error: 'Vehicle not found' 
            }, { status: 404 });
        }

        console.log('[POST] ✅ Vehicle found:', vehicle.brand, vehicle.vehicleModel);

        // Check company owner authorization for this vehicle
        if (adminUser.role === 'company_owner') {
            const isOwner = vehicle.owner && vehicle.owner.toString() === adminUser._id.toString();
            const isCompany = adminUser.companyId && vehicle.company && vehicle.company.toString() === adminUser.companyId.toString();
            
            console.log('[POST] Company owner authorization check:', { isOwner, isCompany });
            
            if (!isOwner && !isCompany) {
                console.log('[POST] ❌ Company owner not authorized for this vehicle');
                return NextResponse.json({ 
                    success: false,
                    error: 'Unauthorized',
                    message: 'You do not have access to create bookings for this vehicle' 
                }, { status: 403 });
            }
        }

        // 2. Find or Create User
        let user = await User.findOne({ email: customerEmail.toLowerCase() });
        
        if (!user) {
            console.log('[POST] User not found, creating new user:', customerEmail);
            
            // Create a new user with random password
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            const names = customerName ? customerName.trim().split(/\s+/) : ['Guest', 'User'];
            
            user = await User.create({
                firstName: names[0] || 'Guest',
                lastName: names.slice(1).join(' ') || 'User',
                email: customerEmail.toLowerCase(),
                password: hashedPassword,
                role: 'customer',
                phone: customerPhone || ''
            });

            console.log('[POST] ✅ New user created:', user._id);
            // TODO: Send welcome email with password
        } else {
            console.log('[POST] ✅ Existing user found:', user._id);
        }

        // 3. Calculate price if not provided
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Validate dates
        if (end <= start) {
            console.log('[POST] ❌ Invalid dates: end date must be after start date');
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
            bookingPrice = diffDays * (vehicle.pricing?.daily || 50);
            console.log('[POST] Auto-calculated price:', bookingPrice, `(${diffDays} days x €${vehicle.pricing?.daily || 50})`);
        } else {
            console.log('[POST] Using provided price:', bookingPrice);
        }

        // 4. Create Booking
        const bookingData: any = {
            customer: user._id,
            vehicle: vehicleId,
            startDate: start,
            endDate: end,
            pickupLocation: pickupLocation || vehicle.location || 'Office',
            dropoffLocation: dropoffLocation || vehicle.location || 'Office',
            totalPrice: bookingPrice,
            status: 'confirmed',
            paymentStatus: 'pending',
            notes: [{
                text: `Manual booking created by ${adminUser.role}: ${adminUser.firstName} ${adminUser.lastName}`,
                addedBy: adminUser._id,
                date: new Date()
            }]
        };

        if (vehicle.company) {
            bookingData.company = vehicle.company;
        }

        const booking = await Booking.create(bookingData);
        
        console.log('[POST] ✅ Booking created successfully:', booking._id);
        
        // Populate for response
        await booking.populate('vehicle', 'brand vehicleModel images');
        await booking.populate('customer', 'firstName lastName email phone');

        // Send emails
        const customer = booking.customer as any;
        const vehicleData = booking.vehicle as any;
        
        // If new user was created, send welcome email
        if (!user) {
            console.log('[POST] Sending welcome email to new user:', customer.email);
            const welcomeTemplate = emailTemplates.welcomeEmail({
                name: `${customer.firstName} ${customer.lastName}`,
                email: customer.email,
                tempPassword: 'Please contact support for password reset'
            });
            
            await sendEmail({
                to: customer.email,
                subject: welcomeTemplate.subject,
                html: welcomeTemplate.html,
                text: welcomeTemplate.text,
            });
        }
        
        // Send booking confirmation email
        console.log('[POST] Sending booking confirmation email to:', customer.email);
        const confirmationTemplate = emailTemplates.bookingConfirmation({
            customerName: `${customer.firstName} ${customer.lastName}`,
            bookingNumber: booking.bookingNumber,
            vehicleName: `${vehicleData.brand} ${vehicleData.vehicleModel}`,
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
            pickupLocation: booking.pickupLocation
        });
        
        const emailSent = await sendEmail({
            to: customer.email,
            subject: confirmationTemplate.subject,
            html: confirmationTemplate.html,
            text: confirmationTemplate.text,
        });
        
        console.log('[POST] Email sent:', emailSent ? 'Yes' : 'No (check email config)');

        return NextResponse.json({ 
            success: true, 
            data: booking,
            emailSent,
            message: emailSent 
                ? 'Booking created and confirmation email sent' 
                : 'Booking created (email not sent - check email configuration)' 
        });
        
    } catch (error: any) {
        console.error('[POST] ❌ Error creating booking:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to create booking',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}