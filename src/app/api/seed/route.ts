import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Clear existing data (Demo only!)
    // Order matters due to foreign keys
    await prisma.review.deleteMany({});
    await prisma.bookingNote.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.wishlist.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.user.deleteMany({
        where: { email: 'admin@rental.com' }
    });
    await prisma.company.deleteMany({});
    await prisma.location.deleteMany({});

    // Create Admin User with pre-hashed password
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.create({
        data: {
            name: 'System Admin', // Maps to name in Prisma
            email: 'admin@rental.com',
            phone: '+1234567890',
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true
        }
    });

    // Create Company
    const company = await prisma.company.create({
        data: {
            name: 'Prestige Motors',
            email: 'contact@prestige.com',
            phone: '+1234567890',
            address: 'Downtown Dubai',
            description: 'Luxury car rental service.',
            isActive: true
        }
    });
    
    // Link admin to company if needed, or just leave as separate entities. 
    // In Mongoose seed, admin was owner. In Prisma User has companyId?
    // Let's update admin to be partner of this company if that was the intent, or just leave as ADMIN.
    // The previous seed set `owner: admin.id`. Admin Schema usually doesn't have owner field unless role is Partner.
    // But wait, admin role is 'admin', so maybe they don't own the company.
    // However, let's stick to creating vehicles.

    // Create Vehicles
    const vehiclesData = [
        {
            brand: 'Porsche',
            vehicleModel: '911 GT3',
            year: 2024,
            category: 'Sports',
            transmission: 'Automatic', 
            fuelType: 'PETROL',
            seats: 2,
            dailyPrice: 1200,
            weeklyPrice: 7000,
            images: {
                create: [{ url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop', isPrimary: true }]
            },
            companyId: company.id,
            status: 'APPROVED',
            type: 'rent'
        },
        {
            brand: 'Mercedes-Benz',
            vehicleModel: 'S-Class',
            year: 2023,
            category: 'Luxury',
            transmission: 'Automatic',
            fuelType: 'HYBRID',
            seats: 5,
            dailyPrice: 450,
            weeklyPrice: 2800,
            images: {
                create: [{ url: 'https://images.unsplash.com/photo-1622354779261-7589b257523f?q=80&w=2621&auto=format&fit=crop', isPrimary: true }]
            },
            companyId: company.id,
            status: 'APPROVED',
            type: 'rent'
        },
        {
            brand: 'Range Rover',
            vehicleModel: 'Sport Autobiography',
            year: 2024,
            category: 'SUV',
            transmission: 'Automatic',
            fuelType: 'DIESEL',
            seats: 5,
            dailyPrice: 600,
            weeklyPrice: 3500,
            images: {
                create: [{ url: 'https://images.unsplash.com/photo-1606219665804-98ae8b50f771?q=80&w=2069&auto=format&fit=crop', isPrimary: true }]
            },
            companyId: company.id,
            status: 'APPROVED',
            type: 'rent'
        }
    ];

    for (const v of vehiclesData) {
        await prisma.vehicle.create({
            data: v as any 
        });
    }

    // Create Locations
    const locations = [
      {
        name: 'Dubai Downtown HQ',
        address: 'Sheikh Mohammed bin Rashid Blvd',
        city: 'Dubai',
        lat: 25.1972, 
        lng: 55.2744,
        phone: '+971 4 123 4567',
        email: 'dubai@rentalx.com',
        operatingHours: '24/7',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea904ac6605?q=80&w=2070&auto=format&fit=crop'
      },
      {
        name: 'Abu Dhabi Corniche',
        address: 'Corniche Road, Al Khubeirah',
        city: 'Abu Dhabi',
        lat: 24.4672, 
        lng: 54.3482,
        phone: '+971 2 987 6543',
        email: 'abudhabi@rentalx.com',
        operatingHours: '9:00 AM - 10:00 PM',
        image: 'https://images.unsplash.com/photo-1599839572678-09d71a938c35?q=80&w=1974&auto=format&fit=crop'
      },
      {
        name: 'Sharjah Airport Branch',
        address: 'Sharjah International Airport',
        city: 'Sharjah',
        lat: 25.3289, 
        lng: 55.5136,
        phone: '+971 6 555 1234',
        email: 'sharjah@rentalx.com',
        operatingHours: '24/7',
        image: 'https://images.unsplash.com/photo-1577908865612-426c1122a762?q=80&w=2070&auto=format&fit=crop'
      }
    ];

    await prisma.location.createMany({
        data: locations
    });

    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
