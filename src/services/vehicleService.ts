import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export interface VehicleFilterParams {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  transmission?: string;
  fuelType?: string;
  search?: string;
  featured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
  type?: 'rent' | 'sale' | 'all';
  status?: string;
  ownerId?: string;
  startDate?: Date;
  endDate?: Date;
}

export async function getVehicles(params: VehicleFilterParams) {
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    seats,
    transmission,
    fuelType,
    search,
    featured,
    sort = 'newest',
    page = 1,
    limit = 12,
    type = 'rent',
    status,
    ownerId,
    startDate,
    endDate
  } = params;

  const skip = (page - 1) * limit;
  const where: any = {};

  if (type === 'rent') {
    where.type = 'rent';
    
    // Date availability check (for rentals)
    // Note: This logic assumes exclusive availability (quantity=1). 
    // Vehicles with quantity > 1 might be hidden even if partially available.
    if (startDate && endDate) {
       where.bookings = {
         none: {
           status: { in: ['CONFIRMED', 'IN_PROGRESS', 'PENDING_PAYMENT'] },
           startDate: { lt: endDate },
           endDate: { gt: startDate }
         }
       };
    }
  } else if (type === 'sale') {
    where.type = 'sale';
  }

  if (ownerId) {
    where.ownerId = ownerId;
    if (status) where.status = status.toUpperCase() as any;
  } else {
    where.status = 'APPROVED';
  }

  if (category) where.category = category.toUpperCase() as any;
  if (featured) where.isFeatured = true;
  if (brand) where.brand = brand;
  if (transmission) where.transmission = transmission.toUpperCase() as any;
  if (fuelType) where.fuelType = fuelType.toUpperCase() as any;
  if (seats) where.seats = { gte: seats };

  if (minPrice || maxPrice) {
    const priceField = type === 'sale' ? 'salePrice' : 'dailyPrice';
    where[priceField] = {
      gte: minPrice,
      lte: maxPrice
    };
  }

  if (search) {
    where.OR = [
      { brand: { contains: search, mode: 'insensitive' } },
      { vehicleModel: { contains: search, mode: 'insensitive' } }
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') {
    orderBy = type === 'sale' ? { salePrice: 'asc' } : { dailyPrice: 'asc' };
  } else if (sort === 'price_desc') {
    orderBy = type === 'sale' ? { salePrice: 'desc' } : { dailyPrice: 'desc' };
  }

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images: true,
        owner: {
            select: { name: true, image: true }
        }
      }
    }),
    prisma.vehicle.count({ where })
  ]);

  return {
    vehicles,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    }
  };
}

export async function getVehicleById(id: string) {
    return prisma.vehicle.findUnique({
        where: { id },
        include: {
            images: true,
            owner: {
                select: { name: true, email: true, phone: true }
            },
            reviews: {
                where: { isApproved: true },
                include: {
                    user: { select: { name: true, image: true } }
                }
            }
        }
    });
}
