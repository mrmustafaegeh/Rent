import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // apiVersion: '2023-10-16', // Use latest or your preferred version
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
    const body = await request.text();
    const sig = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        if (!endpointSecret) throw new Error('Webhook secret not found');
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentSuccess(paymentIntent);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const { vehicleId, days } = paymentIntent.metadata;
    // Basic logic: We might want to find a pending booking linked to this PI
    // or create one if we passed all needed info in metadata.
    // simpler: update booking status if we stored bookingId in metadata
    
    // For this MVP, we might rely on client-side creation calling /api/bookings,
    // but a robust app would confirm payment here.
    
    // Example: If we passed bookingId in metadata
    if (paymentIntent.metadata.bookingId) {
        await prisma.booking.update({
            where: { id: paymentIntent.metadata.bookingId },
            data: {
                paymentStatus: 'PAID',
                status: 'CONFIRMED'
            }
        });
    }
}
