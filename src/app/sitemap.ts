import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Static routes
  const routes = [
    '',
    '/fleet',
    '/locations',
    '/how-it-works',
    '/about',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic vehicle routes
  let vehicles: any[] = [];
  try {
    await dbConnect();
    vehicles = await Vehicle.find({ available: true }).select('_id updatedAt').exec();
  } catch (error) {
    console.warn('Sitemap generation: failed to fetch vehicles', error);
  }

  const vehicleRoutes = vehicles.map((vehicle) => ({
    url: `${baseUrl}/vehicles/${vehicle._id}`,
    lastModified: vehicle.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...vehicleRoutes];
}
