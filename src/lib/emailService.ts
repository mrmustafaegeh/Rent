
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  // In a real application, you would use a library like nodemailer or an API like SendGrid/Resend.
  // For this demo, we will log the email to the console.
  
  console.log('--- MOCK EMAIL SENDING ---');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('Body:', html); // In real logs, truncate html or don't log it
  console.log('--------------------------');

  return true;
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const subject = 'Welcome to RENTALX!';
  const html = `
    <h1>Welcome, ${name}!</h1>
    <p>Thank you for creating an account with RENTALX. We're excited to help you find your dream car.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/fleet">Browse Fleet</a>
  `;
  return sendEmail({ to: email, subject, html });
};

export const sendBookingConfirmationEmail = async (email: string, bookingDetails: any) => {
  const subject = `Booking Confirmation - ${bookingDetails.bookingNumber}`;
  const html = `
    <h1>Booking Confirmed!</h1>
    <p>Your booking for the <strong>${bookingDetails.vehicleName}</strong> has been received.</p>
    <p>Dates: ${new Date(bookingDetails.startDate).toDateString()} - ${new Date(bookingDetails.endDate).toDateString()}</p>
    <p>Total: $${bookingDetails.totalPrice}</p>
    <p>Status: ${bookingDetails.status}</p>
    <br/>
    <p>You can view your booking details in your dashboard.</p>
  `;
  return sendEmail({ to: email, subject, html });
};
