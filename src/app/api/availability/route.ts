import { NextResponse } from 'next/server';
import { checkVehicleAvailability } from '@/services/bookingService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get('vehicleId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!vehicleId || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const isAvailable = await checkVehicleAvailability({
      vehicleId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return NextResponse.json({ available: isAvailable });
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}
