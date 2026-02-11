
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
  type?: 'rent' | 'sale';
  status?: string;
  owner?: string;
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
    owner
  } = params;

  const skip = (page - 1) * limit;
  const query: any = {};
    
  query.type = type;

  if (owner) query.owner = owner;

  if (type === 'sale') {
      // For sale listings, show approved by default unless status specified OR owner (dashboard) is viewing
      if (status) query.status = status;
      else if (!owner && !params.brand && !params.category) query.status = 'approved'; 
      // Actually, keep simple: public view (no owner) defaults to approved.
      else if (!owner) query.status = 'approved';
  } else {
      if (status) query.status = status;
      // For rentals, if public view (no owner), force available=true?
      // "make the costumer to see all the avaliable cars"
      // Maybe the user implies they want to filter out unavailable ones?
      // Or maybe existing logic is somehow hiding them?
      // Current logic: shows everything.
  }

  // Filters
  if (category) query.category = category;
  if (featured) query.featured = true;
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
