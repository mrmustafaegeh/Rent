
import Vehicle, { IVehicle } from '@/models/Vehicle';
import dbConnect from '@/lib/mongodb';

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
}

export interface VehicleResult {
  vehicles: IVehicle[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export async function getVehicles(params: VehicleFilterParams): Promise<VehicleResult> {
  await dbConnect();
  
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
    limit = 12
  } = params;

  const skip = (page - 1) * limit;
  const query: any = {};
    
  // Filters
  if (category) query.category = category;
  if (featured) query.featured = true;
  if (brand) query.brand = brand;
  if (transmission) query.transmission = transmission;
  if (fuelType) query.fuelType = fuelType;
  if (seats) query.seats = { $gte: seats };
  
  // Price Range
  if (minPrice || maxPrice) {
    query['pricing.daily'] = {};
    if (minPrice) query['pricing.daily'].$gte = minPrice;
    if (maxPrice) query['pricing.daily'].$lte = maxPrice;
  }

  // Search (Brand or Model)
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { brand: searchRegex },
      { vehicleModel: searchRegex }
    ];
  }

  // Sorting
  let sortOption: any = {};
  switch (sort) {
    case 'price_asc':
      sortOption['pricing.daily'] = 1;
      break;
    case 'price_desc':
      sortOption['pricing.daily'] = -1;
      break;
    case 'newest':
    default:
      sortOption['createdAt'] = -1;
  }
  
  const total = await Vehicle.countDocuments(query);
  const vehicles = await Vehicle.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);
  
  return {
    vehicles: JSON.parse(JSON.stringify(vehicles)), // Serialization fix for Next.js SSR
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    }
  };
}

export async function getVehicleBrands(): Promise<string[]> {
  await dbConnect();
  // Using distinct to get unique brands
  return await Vehicle.distinct('brand');
}
