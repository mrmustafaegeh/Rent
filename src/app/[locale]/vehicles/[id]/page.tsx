import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import VehicleDetailClient from './VehicleDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: { company: { select: { name: true } } }
    });

    if (!vehicle) return { title: 'Vehicle Not Found - RENTALX' };

    const title = `${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.year} Rent in Dubai`;
    const description = `Rent ${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.year} in Dubai from AED ${vehicle.dailyPrice}/day. ${vehicle.category} car with ${vehicle.transmission} transmission. Book now!`;
    
    // Prisma Image relation or embedded images? Previously Mongoose had images array.
    // Prisma schema has `images: VehicleImage[]`.
    const vehicleWithImages = await prisma.vehicle.findUnique({
        where: { id },
        include: { images: true }
    });
    const imageUrl = vehicleWithImages?.images?.[0]?.url || '';

    return {
      title,
      description,
      keywords: [
        `${vehicle.brand} rental Dubai`,
        `${vehicle.vehicleModel} rent`,
        `${vehicle.category} car rental`,
        'luxury car rental Dubai',
        'rent car Dubai',
      ],
      openGraph: {
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    return { title: 'Error - RENTALX' };
  }
}

export default async function VehicleDetailPage({ params }: Props) {
  const { id } = await params;
  
  let vehicle;
  try {
     vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: {
            company: {
                select: {
                   name: true,
                   // phone: true, // Check if phone exists in Prisma Company model. Yes.
                   // rating: true, // Check if rating exists. No rating in Prisma Company model currently (checked schema earlier, added description & isActive).
                   // logo: true, // Logo field?
                }
            },
            images: true,
            reviews: {
                where: { isApproved: true },
                include: {
                    user: { select: { name: true, image: true } }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
     });
  } catch (e) {
     notFound();
  }

  if (!vehicle) {
    notFound();
  }

  // Convert dates and decimals to ensure serializability if needed
  const vehicleData = {
      ...vehicle,
      dailyPrice: Number(vehicle.dailyPrice),
      weeklyPrice: vehicle.weeklyPrice ? Number(vehicle.weeklyPrice) : null,
      monthlyPrice: vehicle.monthlyPrice ? Number(vehicle.monthlyPrice) : null,
      salePrice: vehicle.salePrice ? Number(vehicle.salePrice) : null,
  };

  return <VehicleDetailClient vehicle={vehicleData} />;
}
