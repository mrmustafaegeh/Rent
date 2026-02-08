import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import VehicleDetailClient from './VehicleDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  await dbConnect();
  
  try {
    const vehicle = await Vehicle.findById(id).populate('company', 'name').lean();
    if (!vehicle) return { title: 'Vehicle Not Found - RENTALX' };

    const title = `${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.year} Rent in Dubai`;
    const description = `Rent ${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.year} in Dubai from AED ${vehicle.pricing.daily}/day. ${vehicle.category} car with ${vehicle.transmission} transmission. Book now!`;

    const imageUrl = vehicle.images?.[0]?.url || '';

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
  await dbConnect();
  
  let vehicle;
  try {
     vehicle = await Vehicle.findById(id)
      .populate('company', 'name logo phone rating')
      .lean();
  } catch (e) {
     notFound();
  }

  if (!vehicle) {
    notFound();
  }

  // Convert MongoDB document to plain object for Client Component
  const vehicleData = JSON.parse(JSON.stringify(vehicle));

  return <VehicleDetailClient vehicle={vehicleData} />;
}
