import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const locales = ['en', 'ar', 'ru', 'tr', 'el'];
  
  // Static base routes
  const staticRoutes = [
    '',
    '/cars',
    '/locations',
    '/how-it-works',
    '/about',
    '/auth/login',
    '/auth/register',
  ];

  // Dynamic vehicle routes
  let vehicles: Array<{ _id: { toString(): string }; updatedAt?: Date }> = [];
  try {
    await dbConnect();
    vehicles = await Vehicle.find({ status: 'approved' }).select('_id updatedAt').exec();
  } catch (error) {
    console.warn('Sitemap generation: failed to fetch vehicles', error);
  }

  const allRoutes: MetadataRoute.Sitemap = [];

  // Generate routes for all locales
  locales.forEach((locale) => {
    // Add static routes
    staticRoutes.forEach((route) => {
        allRoutes.push({
            url: `${baseUrl}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: route === '' ? 1.0 : 0.8,
        });
    });

    // Add vehicle routes
    vehicles.forEach((vehicle) => {
        allRoutes.push({
            url: `${baseUrl}/${locale}/cars/${vehicle._id}`,
            lastModified: vehicle.updatedAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        });
    });
  });

  return allRoutes;
}
