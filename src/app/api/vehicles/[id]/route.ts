import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getVehicleById } from '@/services/vehicleService';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const vehicle = await getVehicleById(id);

        if (!vehicle) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        return NextResponse.json(vehicle);
    } catch (error) {
        console.error('Vehicle Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch vehicle' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Standardize data for Prisma
        const updateData: any = {};
        if (body.brand) updateData.brand = body.brand;
        if (body.vehicleModel) updateData.vehicleModel = body.vehicleModel;
        if (body.year) updateData.year = parseInt(body.year);
        if (body.category) updateData.category = body.category;
        if (body.status) updateData.status = body.status.toUpperCase();
        if (body.dailyPrice) updateData.dailyPrice = parseFloat(body.dailyPrice);
        if (body.salePrice) updateData.salePrice = parseFloat(body.salePrice);
        if (typeof body.available === 'boolean') updateData.available = body.available;

        const vehicle = await prisma.vehicle.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(vehicle);
    } catch (error) {
        console.error('Vehicle Update Error:', error);
        return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        await prisma.vehicle.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Vehicle Delete Error:', error);
        return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
    }
}
