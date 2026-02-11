import nodemailer from 'nodemailer';

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

// Create reusable transporter
const createTransporter = () => {
    // Support multiple email services
    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
        // Custom SMTP
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        // Gmail
        return nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    } else {
        console.warn('⚠️ Email service not configured. Emails will not be sent.');
        return null;
    }
};

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
    const transporter = createTransporter();
    
    if (!transporter) {
        console.log('📧 Email not sent (no transporter configured):', options.subject);
        return false;
    }

    try {
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'Rental Platform'}" <${process.env.EMAIL_FROM || process.env.GMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully to:', options.to);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return false;
    }
};

// Email Templates
export const emailTemplates = {
    // Booking Confirmation
    bookingConfirmation: (data: {
        customerName: string;
        bookingNumber: string;
        vehicleName: string;
        startDate: string;
        endDate: string;
        totalPrice: number;
        pickupLocation: string;
    }) => ({
        subject: `Booking Confirmation - ${data.bookingNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
                    .detail-label { font-weight: bold; color: #6b7280; }
                    .detail-value { color: #111827; }
                    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                    .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🚗 Booking Confirmed!</h1>
                    </div>
                    <div class="content">
                        <p>Dear ${data.customerName},</p>
                        <p>Thank you for your booking! Your reservation has been confirmed.</p>
                        
                        <div class="booking-details">
                            <h2 style="margin-top: 0;">Booking Details</h2>
                            <div class="detail-row">
                                <span class="detail-label">Booking Number:</span>
                                <span class="detail-value">${data.bookingNumber}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Vehicle:</span>
                                <span class="detail-value">${data.vehicleName}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Pickup Date:</span>
                                <span class="detail-value">${data.startDate}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Return Date:</span>
                                <span class="detail-value">${data.endDate}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Pickup Location:</span>
                                <span class="detail-value">${data.pickupLocation}</span>
                            </div>
                            <div class="detail-row" style="border-bottom: none; font-size: 18px; margin-top: 10px;">
                                <span class="detail-label">Total Price:</span>
                                <span class="detail-value" style="color: #3B82F6; font-weight: bold;">€${data.totalPrice}</span>
                            </div>
                        </div>
                        
                        <p>We look forward to serving you!</p>
                        
                        <div class="footer">
                            <p>If you have any questions, please contact us.</p>
                            <p>&copy; ${new Date().getFullYear()} Rental Platform. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Booking Confirmed!

Dear ${data.customerName},

Your booking has been confirmed.

Booking Number: ${data.bookingNumber}
Vehicle: ${data.vehicleName}
Pickup Date: ${data.startDate}
Return Date: ${data.endDate}
Pickup Location: ${data.pickupLocation}
Total Price: €${data.totalPrice}

Thank you for choosing our service!
        `
    }),

    // Welcome Email (New User)
    welcomeEmail: (data: { name: string; email: string; tempPassword?: string }) => ({
        subject: 'Welcome to Our Rental Platform!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #10B981 0%, #34D399 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .credentials { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
                    .button { display: inline-block; background: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Welcome!</h1>
                    </div>
                    <div class="content">
                        <p>Dear ${data.name},</p>
                        <p>Welcome to our car rental platform! We're excited to have you on board.</p>
                        
                        ${data.tempPassword ? `
                        <div class="credentials">
                            <h3 style="margin-top: 0;">Your Account Details</h3>
                            <p><strong>Email:</strong> ${data.email}</p>
                            <p><strong>Temporary Password:</strong> ${data.tempPassword}</p>
                            <p style="color: #b45309; margin-bottom: 0;"><strong>⚠️ Please change your password after first login</strong></p>
                        </div>
                        ` : ''}
                        
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="button">Login to Your Account</a>
                        
                        <p>If you have any questions, feel free to reach out to our support team.</p>
                        
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Rental Platform. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Welcome to Our Rental Platform!

Dear ${data.name},

Welcome! We're excited to have you on board.

${data.tempPassword ? `
Your Account Details:
Email: ${data.email}
Temporary Password: ${data.tempPassword}

⚠️ Please change your password after first login
` : ''}

Login at: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login

If you have any questions, feel free to reach out!
        `
    }),

    // Booking Status Update
    bookingStatusUpdate: (data: {
        customerName: string;
        bookingNumber: string;
        vehicleName: string;
        status: string;
        statusMessage: string;
    }) => ({
        subject: `Booking ${data.status} - ${data.bookingNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📋 Booking Status Update</h1>
                    </div>
                    <div class="content">
                        <p>Dear ${data.customerName},</p>
                        <p>Your booking status has been updated.</p>
                        
                        <p><strong>Booking Number:</strong> ${data.bookingNumber}</p>
                        <p><strong>Vehicle:</strong> ${data.vehicleName}</p>
                        <p><strong>New Status:</strong> <span class="status-badge" style="background: #dbeafe; color: #1e40af;">${data.status}</span></p>
                        
                        <p>${data.statusMessage}</p>
                        
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Rental Platform. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Booking Status Update

Dear ${data.customerName},

Your booking status has been updated.

Booking Number: ${data.bookingNumber}
Vehicle: ${data.vehicleName}
New Status: ${data.status}

${data.statusMessage}
        `
    }),
};
