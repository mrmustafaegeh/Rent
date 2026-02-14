import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Static routes
  const routes = [
    '',
    '/cars',
    '/locations',
    '/how-it-works',
    '/about',
    '/auth/login',
    '/auth/register',
  ].map((route) => ({
    url: `${baseUrl}/en${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic vehicle routes
  let vehicles: Array<{ _id: { toString(): string }; updatedAt?: Date }> = [];
  try {
    await dbConnect();
    vehicles = await Vehicle.find({ available: true }).select('_id updatedAt').exec();
  } catch (error) {
    console.warn('Sitemap generation: failed to fetch vehicles', error);
  }

  const vehicleRoutes = vehicles.map((vehicle) => ({
    url: `${baseUrl}/en/cars/${vehicle._id}`,
    lastModified: vehicle.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...vehicleRoutes];
}
