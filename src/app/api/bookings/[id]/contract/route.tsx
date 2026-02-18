import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { renderToStream } from '@react-pdf/renderer';
import { RentalContract } from '@/lib/pdf/RentalContract';
import React from 'react';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                vehicle: true,
                customer: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });

        if (!booking) {
            return new NextResponse('Booking not found', { status: 404 });
        }

        // Generate PDF using @react-pdf/renderer
        const stream = await renderToStream(<RentalContract booking={booking} />);
        
        // Convert Node stream to Web ReadableStream
        // Note: Using 'any' since node types differ slightly from fetch types
        const webStream = new ReadableStream({
            start(controller) {
                stream.on('data', (chunk) => controller.enqueue(chunk));
                stream.on('end', () => controller.close());
                stream.on('error', (err) => controller.error(err));
            }
        });

        return new NextResponse(webStream, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="contract-${booking.bookingNumber}.pdf"`
            }
        });

    } catch (error) {
        console.error('PDF Generation Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
