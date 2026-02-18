import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateRentalContract } from '@/services/pdfService';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                customer: true,
                vehicle: true,
            }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const pdfBuffer = await generateRentalContract(booking);

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Contract-${booking.bookingNumber}.pdf"`,
            },
        });
    } catch (error) {
        console.error('PDF Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}
