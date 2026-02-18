import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

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
    '/contact',
    '/blog',
    '/car-rental-north-cyprus',
    '/car-rental-kyrenia',
    '/car-rental-nicosia',
    '/car-rental-famagusta',
    '/ercan-airport-car-rental',
    '/luxury-car-rental-north-cyprus',
    '/cheap-car-rental-north-cyprus',
    '/legal/terms',
    '/legal/privacy',
    '/legal/refunds',
  ];

  // Dynamic vehicle routes
  let vehicles: Array<{ id: string; updatedAt: Date }> = [];
  try {
    vehicles = await prisma.vehicle.findMany({
        where: { status: 'APPROVED' },
        select: { id: true, updatedAt: true }
    });
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
            url: `${baseUrl}/${locale}/cars/${vehicle.id}`,
            lastModified: vehicle.updatedAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        });
    });
  });

  return allRoutes;
}
