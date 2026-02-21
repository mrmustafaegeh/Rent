const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding with high-quality variety...');

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

  const vehicles = [
    {
      brand: 'BMW',
      vehicleModel: 'M4 Competition',
      year: 2024,
      category: 'LUXURY',
      dailyPrice: 150,
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL',
      seats: 4,
      location: 'Kyrenia',
      imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1000'
    },
    {
      brand: 'Mercedes-Benz',
      vehicleModel: 'S-Class Executive',
      year: 2023,
      category: 'LUXURY',
      dailyPrice: 200,
      transmission: 'AUTOMATIC',
      fuelType: 'HYBRID',
      seats: 5,
      location: 'Nicosia',
      imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1000'
    },
    {
      brand: 'Porsche',
      vehicleModel: '911 Carrera S',
      year: 2024,
      category: 'SPORTS',
      dailyPrice: 250,
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL',
      seats: 2,
      location: 'Kyrenia',
      imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000'
    },
    {
      brand: 'Range Rover',
      vehicleModel: 'Autobiography',
      year: 2023,
      category: 'SUV',
      dailyPrice: 120,
      transmission: 'AUTOMATIC',
      fuelType: 'DIESEL',
      seats: 5,
      location: 'Ercan',
      imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=1000'
    },
    {
      brand: 'Nissan',
      vehicleModel: 'Patrol V8',
      year: 2022,
      category: 'SUV',
      dailyPrice: 100,
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL',
      seats: 7,
      location: 'Famagusta',
      imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1000'
    },
    {
      brand: 'Toyota',
      vehicleModel: 'Yaris Hybrid',
      year: 2023,
      category: 'ECONOMY',
      dailyPrice: 35,
      transmission: 'AUTOMATIC',
      fuelType: 'HYBRID',
      seats: 5,
      location: 'Nicosia',
      imageUrl: 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?auto=format&fit=crop&q=80&w=1000'
    },
    {
      brand: 'Hyundai',
      vehicleModel: 'i10 Grand',
      year: 2022,
      category: 'ECONOMY',
      dailyPrice: 30,
      transmission: 'MANUAL',
      fuelType: 'PETROL',
      seats: 4,
      location: 'Famagusta',
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000'
    },
    {
      brand: 'Volkswagen',
      vehicleModel: 'Golf 8 GTI',
      year: 2023,
      category: 'HATCHBACK',
      dailyPrice: 45,
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL',
      seats: 5,
      location: 'Kyrenia',
      imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1000'
    },
    {
      brand: 'Audi',
      vehicleModel: 'A3 Sportback',
      year: 2022,
      category: 'HATCHBACK',
      dailyPrice: 55,
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL',
      seats: 5,
      location: 'Ercan',
      imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1000'
    },
    {
      brand: 'Tesla',
      vehicleModel: 'Model 3 Dual Motor',
      year: 2023,
      category: 'ELECTRIC',
      dailyPrice: 80,
      transmission: 'AUTOMATIC',
      fuelType: 'ELECTRIC',
      seats: 5,
      location: 'Nicosia',
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000'
    }
  ];

  // Clear existing data to avoid mess and constraints
  await prisma.review.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.vehicleImage.deleteMany({});
  await prisma.vehicle.deleteMany({});

  for (const v of vehicles) {
    await prisma.vehicle.create({
      data: {
        brand: v.brand,
        vehicleModel: v.vehicleModel,
        year: v.year,
        category: v.category,
        type: 'rent',
        dailyPrice: v.dailyPrice,
        transmission: v.transmission,
        fuelType: v.fuelType,
        seats: v.seats,
        location: v.location,
        status: 'APPROVED',
        ownerId: partner.id,
        isFeatured: v.category === 'LUXURY' || v.category === 'SPORTS',
        images: {
          create: [
            { url: v.imageUrl, isPrimary: true }
          ]
        }
      },
    });
  }

  console.log('Seeding finished with 10 unique vehicles across North Cyprus.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
