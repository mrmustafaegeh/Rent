import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    // apiVersion: '2023-10-16', // Use default or specific if needed
});

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { vehicleId, days } = await request.json();

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        // Calculate amount (in cents)
        const amount = Math.round(vehicle.pricing.daily * days * 100);

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                vehicleId,
                vehicleName: `${vehicle.brand} ${vehicle.vehicleModel}`
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
