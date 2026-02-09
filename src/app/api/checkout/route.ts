import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    // apiVersion: '2023-10-16', // Let it use the default or package-defined version
});

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { vehicleId, days } = await request.json();

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        // Calculate amount (in cents) with tiered pricing
        let rate = vehicle.pricing.daily;
        // Simple logic mirroring BookingWidget (Schema only has monthly/weekly)
        if (days >= 7) rate = vehicle.pricing.weekly || (vehicle.pricing.daily * 0.85);
        else if (days >= 3) rate = (vehicle.pricing.daily * 0.9);
        
        const total = Math.round(days * rate);
        const amount = Math.round(total * 100); // Convert to cents

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'eur', // Updated to Euro
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                vehicleId,
                vehicleName: `${vehicle.brand} ${vehicle.vehicleModel}`, // Use vehicle.vehicleModel as per schema
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
