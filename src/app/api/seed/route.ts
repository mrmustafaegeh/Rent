import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import Company from '@/models/Company';
import User from '@/models/User';
import Location from '@/models/Location';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing data (Demo only!)
    await Vehicle.deleteMany({});
    await Company.deleteMany({});
    await User.deleteMany({ email: 'admin@rental.com' }); 
    await Location.deleteMany({});

    // Create Admin User with pre-hashed password
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = new User({
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@rental.com',
        phone: '+1234567890',
        password: hashedPassword,
        role: 'admin'
    });
    // Save without triggering pre-save hook
    await admin.save({ validateBeforeSave: true });

    // Create Company
    const company = new Company({
        name: 'Prestige Motors',
        slug: 'prestige-motors', // Set slug manually
        email: 'contact@prestige.com',
        phone: '+1234567890',
        owner: admin._id,
        isActive: true,
        description: 'Luxury car rental service.'
    });
    await company.save({ validateBeforeSave: true });

    // Create Vehicles
    const vehicles = [
        {
            brand: 'Porsche',
            vehicleModel: '911 GT3',
            year: 2024,
            category: 'Sports',
            transmission: 'Automatic', 
            fuelType: 'Petrol',
            seats: 2,
            pricing: { daily: 1200, weekly: 7000 },
            images: [{ url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop', isPrimary: true }],
            company: company._id,
            available: true,
            isApproved: true
        },
        {
            brand: 'Mercedes-Benz',
            vehicleModel: 'S-Class',
            year: 2023,
            category: 'Luxury',
            transmission: 'Automatic',
            fuelType: 'Hybrid',
            seats: 5,
            pricing: { daily: 450, weekly: 2800 },
            images: [{ url: 'https://images.unsplash.com/photo-1622354779261-7589b257523f?q=80&w=2621&auto=format&fit=crop', isPrimary: true }],
            company: company._id,
            available: true,
            isApproved: true
        },
        {
            brand: 'Range Rover',
            vehicleModel: 'Sport Autobiography',
            year: 2024,
            category: 'SUV',
            transmission: 'Automatic',
            fuelType: 'Diesel',
            seats: 5,
            pricing: { daily: 600, weekly: 3500 },
            images: [{ url: 'https://images.unsplash.com/photo-1606219665804-98ae8b50f771?q=80&w=2069&auto=format&fit=crop', isPrimary: true }],
            company: company._id,
            available: true,
            isApproved: true
        }
    ];

    await Vehicle.insertMany(vehicles);

    // Create Locations
    const locations = [
      {
        name: 'Dubai Downtown HQ',
        address: 'Sheikh Mohammed bin Rashid Blvd',
        city: 'Dubai',
        coordinates: { lat: 25.1972, lng: 55.2744 },
        phone: '+971 4 123 4567',
        email: 'dubai@rentalx.com',
        operatingHours: '24/7',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea904ac6605?q=80&w=2070&auto=format&fit=crop'
      },
      {
        name: 'Abu Dhabi Corniche',
        address: 'Corniche Road, Al Khubeirah',
        city: 'Abu Dhabi',
        coordinates: { lat: 24.4672, lng: 54.3482 },
        phone: '+971 2 987 6543',
        email: 'abudhabi@rentalx.com',
        operatingHours: '9:00 AM - 10:00 PM',
        image: 'https://images.unsplash.com/photo-1599839572678-09d71a938c35?q=80&w=1974&auto=format&fit=crop'
      },
      {
        name: 'Sharjah Airport Branch',
        address: 'Sharjah International Airport',
        city: 'Sharjah',
        coordinates: { lat: 25.3289, lng: 55.5136 },
        phone: '+971 6 555 1234',
        email: 'sharjah@rentalx.com',
        operatingHours: '24/7',
        image: 'https://images.unsplash.com/photo-1577908865612-426c1122a762?q=80&w=2070&auto=format&fit=crop'
      }
    ];

    await Location.insertMany(locations);

    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
