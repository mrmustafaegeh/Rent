import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    // apiVersion: '2023-10-16', // Let it use the default or package-defined version
});

export async function POST(request: Request) {
    try {
        const { vehicleId, days } = await request.json();

        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId }
        });

        if (!vehicle) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        // Calculate amount (in cents) with tiered pricing
        let dailyRate = vehicle.dailyPrice;
        
        // Tiered pricing logic (convert total period price to daily rate if needed)
        if (days >= 30 && vehicle.monthlyPrice) dailyRate = vehicle.monthlyPrice / 30;
        else if (days >= 7 && vehicle.weeklyPrice) dailyRate = vehicle.weeklyPrice / 7;
        else if (days >= 7) dailyRate = vehicle.dailyPrice * 0.85;
        else if (days >= 3) dailyRate = vehicle.dailyPrice * 0.9;
        
        const total = Math.round(days * dailyRate);
        const amount = Math.round(total * 100); // Convert to cents

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                vehicleId,
                vehicleName: `${vehicle.brand} ${vehicle.vehicleModel}`,
                days: days.toString()
            }
        });

        return NextResponse.json({ 
            clientSecret: paymentIntent.client_secret 
        });

    } catch (error: any) {
        console.error('Stripe Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
