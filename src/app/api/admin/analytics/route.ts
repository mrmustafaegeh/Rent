import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth'; // or your auth method
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
    try {
        // Auth check
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
        if (decoded.role !== 'ADMIN') {
             return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 1. Total Revenue & Bookings
        const totalStats = await prisma.booking.aggregate({
            _sum: { totalPrice: true },
            _count: { id: true },
            where: {
                status: { not: 'CANCELLED' }
            }
        });

        // 2. Revenue over time (Monthly for the last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const monthlyBookings = await prisma.booking.findMany({
            where: {
                createdAt: { gte: sixMonthsAgo },
                status: { not: 'CANCELLED' }
            },
            select: {
                createdAt: true,
                totalPrice: true
            }
        });

        // Process monthly data in JS
        const revenueByMonth = monthlyBookings.reduce((acc: any, booking) => {
            const month = booking.createdAt.toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + booking.totalPrice;
            return acc;
        }, {});

        const revenueChartData = Object.entries(revenueByMonth).map(([name, value]) => ({ name, value }));

        // 3. Bookings by Status
        const statusDistribution = await prisma.booking.groupBy({
            by: ['status'],
            _count: { id: true }
        });

        const statusChartData = statusDistribution.map(item => ({
             name: item.status,
             value: item._count.id
        }));

        // 4. Vehicle Utilization (Top 5 Vehicles)
        const popularVehicles = await prisma.booking.groupBy({
            by: ['vehicleId'],
            _count: { id: true },
            orderBy: {
                _count: { id: 'desc' }
            },
            take: 5
        });

        // Fetch vehicle details for the IDs
        const vehicleIds = popularVehicles.map(p => p.vehicleId);
        const vehicles = await prisma.vehicle.findMany({
            where: { id: { in: vehicleIds } },
            select: { id: true, brand: true, vehicleModel: true }
        });

        const vehiclePerformanceData = popularVehicles.map(item => {
            const vehicle = vehicles.find(v => v.id === item.vehicleId);
            return {
                name: vehicle ? `${vehicle.brand} ${vehicle.vehicleModel}` : 'Unknown',
                value: item._count.id
            };
        });

        return NextResponse.json({
            summary: {
                revenue: totalStats._sum.totalPrice || 0,
                bookings: totalStats._count.id || 0,
                // Add fleet size if needed
            },
            revenueChart: revenueChartData,
            statusChart: statusChartData,
            vehicleChart: vehiclePerformanceData
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
