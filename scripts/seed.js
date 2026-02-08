// Manual seed script - Run with: node scripts/seed.js
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection from .env.local
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
}

console.log('🔗 Connecting to MongoDB...');

// Simple schemas without middleware
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    phone: String,
    isActive: Boolean,
    createdAt: { type: Date, default: Date.now }
});

const companySchema = new mongoose.Schema({
    name: String,
    slug: String,
    email: String,
    phone: String,
    owner: mongoose.Schema.Types.ObjectId,
    isActive: Boolean,
    description: String,
    createdAt: { type: Date, default: Date.now }
});

const vehicleSchema = new mongoose.Schema({
    brand: String,
    vehicleModel: String,
    year: Number,
    category: String,
    transmission: String,
    fuelType: String,
    seats: Number,
    pricing: {
        daily: Number,
        weekly: Number
    },
    images: [{
        url: String,
        isPrimary: Boolean
    }],
    company: mongoose.Schema.Types.ObjectId,
    available: Boolean,
    isApproved: Boolean,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Company = mongoose.model('Company', companySchema);
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({ email: 'admin@rental.com' });
        await Company.deleteMany({});
        await Vehicle.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create admin user
        const hashedPassword = await bcrypt.hash('password123', 10);
        const admin = await User.create({
            firstName: 'System',
            lastName: 'Admin',
            email: 'admin@rental.com',
            phone: '+1234567890',
            password: hashedPassword,
            role: 'admin',
            isActive: true
        });
        console.log('👤 Created admin user');

        // Create company
        const company = await Company.create({
            name: 'Prestige Motors',
            slug: 'prestige-motors',
            email: 'contact@prestige.com',
            phone: '+1234567890',
            owner: admin._id,
            isActive: true,
            description: 'Luxury car rental service.'
        });
        console.log('🏢 Created company');

        // Create vehicles
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
        console.log('🚗 Created 3 vehicles');

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📝 Login credentials:');
        console.log('   Email: admin@rental.com');
        console.log('   Password: password123\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
}

seed();
