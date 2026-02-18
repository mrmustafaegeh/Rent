const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create an Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rental.com' },
    update: {},
    create: {
      email: 'admin@rental.com',
      name: 'Super Admin',
      password: 'hashed_password_placeholder', 
      role: 'ADMIN',
    },
  });

  // Create a Partner User
  const partner = await prisma.user.upsert({
    where: { email: 'partner@rental.com' },
    update: {},
    create: {
      email: 'partner@rental.com',
      name: 'Mediterranean Drive',
      password: 'hashed_password_placeholder',
      role: 'PARTNER',
    },
  });

  // Locations to seed: Kyrenia, Nicosia, Famagusta, Ercan
  const cities = ['Kyrenia', 'Nicosia', 'Famagusta', 'Ercan'];
  
  const vehiclesData = [];

  for (const city of cities) {
    // Car 1 for city
    vehiclesData.push({
      brand: 'BMW',
      vehicleModel: '4 Series Convertible',
      year: 2024,
      category: 'LUXURY',
      type: 'rent',
      dailyPrice: 150,
      weeklyPrice: 900,
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL',
      seats: 4,
      location: city,
      isFeatured: true,
      status: 'APPROVED',
      ownerId: partner.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1000', isPrimary: true }
        ]
      }
    });

    // Car 2 for city
    vehiclesData.push({
      brand: 'Mercedes',
      vehicleModel: 'C-Class AMG',
      year: 2023,
      category: 'LUXURY',
      type: 'rent',
      dailyPrice: 120,
      weeklyPrice: 750,
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL',
      seats: 5,
      location: city,
      isFeatured: false,
      status: 'APPROVED',
      ownerId: partner.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1000', isPrimary: true }
        ]
      }
    });

    // Economy car for each city
    vehiclesData.push({
      brand: 'Toyota',
      vehicleModel: 'Vitz',
      year: 2022,
      category: 'ECONOMY',
      type: 'rent',
      dailyPrice: 35,
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL',
      seats: 5,
      location: city,
      status: 'APPROVED',
      ownerId: partner.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000', isPrimary: true }
        ]
      }
    });
  }

  // Clear existing vehicles to avoid duplicates in this test seed
  // (Optional, but helps with "2 cars in each city" requirement)
  // await prisma.vehicle.deleteMany({ where: { ownerId: partner.id } });

  for (const v of vehiclesData) {
    await prisma.vehicle.create({
      data: v,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
