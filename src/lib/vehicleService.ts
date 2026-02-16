
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
  type?: 'rent' | 'sale' | 'all';
  status?: string;
  owner?: string;
  location?: string;
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
    limit = 12,
    type = 'rent',
    status,
    owner,
    location
  } = params;

  const skip = (page - 1) * limit;
  const query: any = {};
    
  if (type === 'all') {
      // No type filter
  } else if (type === 'rent') {
    query.type = { $ne: 'sale' };
  } else {
    query.type = type;
  }

  if (owner) {
      query.owner = owner;
      // In dashboard, show all statuses unless specific one requested
      if (status) query.status = status;
  } else {
      // In public view, default to approved
      if (status) {
          if (status !== 'all') query.status = status;
      } else {
          query.status = 'approved';
      }
  }

  if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
  }

  // Filters
  if (category) query.category = category;
  if (featured) query.isFeatured = true;
  if (brand) query.brand = brand;
  if (transmission) query.transmission = transmission;
  if (fuelType) query.fuelType = fuelType;
  if (seats) query.seats = { $gte: seats };
  
  // Price Range
  const priceField = type === 'sale' ? 'salePrice' : 'pricing.daily';
  if (minPrice || maxPrice) {
    query[priceField] = {};
    if (minPrice) query[priceField].$gte = minPrice;
    if (maxPrice) query[priceField].$lte = maxPrice;
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
      sortOption[priceField] = 1;
      break;
    case 'price_desc':
      sortOption[priceField] = -1;
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
      limit: limit || 12
    }
  };
}

export async function getVehicleBrands(): Promise<string[]> {
  await dbConnect();
  // Using distinct to get unique brands
  return await Vehicle.distinct('brand');
}
