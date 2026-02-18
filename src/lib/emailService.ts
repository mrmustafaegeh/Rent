import { sendEmail as sendRealEmail } from './email';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({ to, subject, html, text }: EmailOptions) => {
  return sendRealEmail({ to, subject, html, text });
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const subject = 'Welcome to RENTALX!';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h1 style="color: #0A1628;">Welcome, ${name}!</h1>
      <p>Thank you for creating an account with RENTALX. We're excited to help you find your dream car.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/cars" style="background: #EAB308; color: #0A1628; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Browse Fleet</a>
      </div>
      <p style="color: #666; font-size: 14px;">If you have any questions, feel free to reply to this email.</p>
    </div>
  `;
  return sendEmail({ to: email, subject, html });
};

export const sendBookingConfirmationEmail = async (email: string, bookingDetails: any) => {
  const subject = `Booking Confirmation - ${bookingDetails.bookingNumber}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h1 style="color: #0A1628;">Booking Confirmed!</h1>
      <p>Your booking for the <strong>${bookingDetails.vehicleName}</strong> has been received and confirmed.</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Booking:</strong> ${bookingDetails.bookingNumber}</p>
        <p style="margin: 5px 0;"><strong>Dates:</strong> ${new Date(bookingDetails.startDate).toDateString()} - ${new Date(bookingDetails.endDate).toDateString()}</p>
        <p style="margin: 5px 0;"><strong>Pickup:</strong> ${bookingDetails.pickupLocation}</p>
        <p style="margin: 5px 0;"><strong>Dropoff:</strong> ${bookingDetails.dropoffLocation}</p>
        <p style="margin: 5px 0; font-size: 18px; color: #EAB308;"><strong>Total: €${bookingDetails.totalPrice}</strong></p>
      </div>
      
      <p>You can view your booking details and manage your reservation in your dashboard.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings" style="background: #0A1628; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Dashboard</a>
      </div>
    </div>
  `;
  return sendEmail({ to: email, subject, html });
};
