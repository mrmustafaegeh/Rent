import prisma from '@/lib/prisma';

export interface CheckAvailabilityParams {
  vehicleId: string;
  startDate: Date;
  endDate: Date;
}

export async function checkVehicleAvailability({
  vehicleId,
  startDate,
  endDate
}: CheckAvailabilityParams): Promise<boolean> {
  // 1. Fetch vehicle details (quantity, global availability)
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    select: { quantity: true, available: true, status: true }
  });

  if (!vehicle) return false;
  if (!vehicle.available) return false;
  if (vehicle.status !== 'APPROVED') return false;

  // 2. Count overlapping bookings
  // A booking overlaps if it starts before the requested end date AND ends after the requested start date
  const conflictingBookingsCount = await prisma.booking.count({
    where: {
      vehicleId,
      status: {
        in: ['CONFIRMED', 'IN_PROGRESS', 'PENDING_PAYMENT']
      },
      startDate: { 
        lt: endDate 
      },
      endDate: { 
        gt: startDate 
      }
    }
  });

  // 3. Check if we have capacity
  return conflictingBookingsCount < vehicle.quantity;
}

export async function createBooking(data: any) {
  const { 
    customerId, 
    vehicleId, 
    startDate, 
    endDate, 
    pickupLocation, 
    dropoffLocation, 
    totalPrice,
    driversLicense,
    passport,
    status,
    paymentStatus
  } = data;

  // Final availability check before creation
  const isAvailable = await checkVehicleAvailability({
    vehicleId,
    startDate: new Date(startDate),
    endDate: new Date(endDate)
  });

  if (!isAvailable) {
    throw new Error('Vehicle is already booked for these dates');
  }

  // Generate unique booking number
  const bookingNumber = `BK-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  return await prisma.booking.create({
    data: {
      bookingNumber,
      customerId,
      vehicleId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      pickupLocation,
      dropoffLocation,
      totalPrice,
      driversLicense,
      passport,
      status: (status?.toUpperCase() || 'PENDING') as any,
      paymentStatus: (paymentStatus?.toUpperCase() || 'PENDING') as any
    },
    include: {
      vehicle: true,
      customer: true
    }
  });
}
