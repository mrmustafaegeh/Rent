# 🚀 New Features Setup Guide

This guide will help you configure the newly added features: Email Notifications, reCAPTCHA, and Sentry Error Monitoring.

## 📧 Email Notifications

### Setup Options

#### Option 1: Gmail (Easiest for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Create an App Password**:
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Select "Mail" and your device
   - Copy the 16-digit password
3. **Add to `.env.local`**:
   ```env
   GMAIL_USER=your.email@gmail.com
   GMAIL_APP_PASSWORD=your_16_digit_app_password
   EMAIL_FROM_NAME=Your Company Name
   ```

#### Option 2: Custom SMTP (Production)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Your Company Name
```

Popular SMTP providers:
- **SendGrid**: Free tier (100 emails/day)
- **Mailgun**: Free tier (5,000 emails/month)
- **AWS SES**: Very cheap, requires verification

### Email Templates Available

✅ **Booking Confirmation** - Sent when admin creates a booking
✅ **Welcome Email** - Sent to new users with temporary password
✅ **Status Update** - Sent when booking status changes

### Testing

```bash
# The emails will be sent automatically when:
# - Admin creates a booking (booking confirmation to customer)
# - New user is created (welcome email)
# - Booking status is updated
```

---

## 🛡️ Google reCAPTCHA v3

reCAPTCHA v3 protects your forms from bots without user interaction.

### Setup Steps

1. **Get reCAPTCHA Keys**:
   - Go to https://www.google.com/recaptcha/admin
   - Register a new site
   - Choose **reCAPTCHA v3**
   - Add your domain (use `localhost` for development)
   - Copy the **Site Key** and **Secret Key**

2. **Add to `.env.local`**:
   ```env
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
   RECAPTCHA_SECRET_KEY=your_secret_key_here
   RECAPTCHA_MIN_SCORE=0.5
   ```

3. **Score Interpretation**:
   - `1.0` = Very likely a human
   - `0.5` = Medium (recommended threshold)
   - `0.0` = Very likely a bot

### Usage in Forms

```tsx
import { useRecaptcha } from '@/hooks/useRecaptcha';

function LoginForm() {
  const { executeRecaptcha, ready } = useRecaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get reCAPTCHA token
    const token = await executeRecaptcha('login');
    
    // Send with your API request
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        recaptchaToken: token, // Include this
      }),
    });
  };
}
```

### Server-Side Verification

```ts
import { verifyRecaptchaFromRequest } from '@/lib/recaptcha';

export async function POST(request: Request) {
  const body = await request.json();
  
  // Verify reCAPTCHA
  const captchaResult = await verifyRecaptchaFromRequest(body, 'login');
  
  if (!captchaResult.success) {
    return NextResponse.json({ 
      error: 'Bot detected' 
    }, { status: 403 });
  }
  
  // Continue with login...
}
```

---

## 🔍 Sentry Error Monitoring

Sentry helps you track and fix errors in production.

### Setup Steps

1. **Create Sentry Account**:
   - Go to https://sentry.io
   - Create a free account
   - Create a new Next.js project

2. **Get DSN**:
   - After creating project, copy the **DSN** (looks like: `https://xxx@xxx.ingest.sentry.io/xxx`)

3. **Add to `.env.local`**:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

4. **Configure Next.js** (add to `next.config.js`):
   ```js
   const { withSentryConfig } = require('@sentry/nextjs');

   const moduleExports = {
     // Your existing Next.js config
   };

   const sentryWebpackPluginOptions = {
     silent: true,
     org: "your-org",
     project: "your-project",
   };

   module.exports = withSentryConfig(
     moduleExports,
     sentryWebpackPluginOptions
   );
   ```

### Features

✅ **Automatic Error Tracking** - All unhandled errors are sent to Sentry
✅ **Performance Monitoring** - Track slow pages and API routes
✅ **Session Replay** - See what users did before an error
✅ **Release Tracking** - Know which version has issues

### Manual Error Reporting

```ts
import * as Sentry from '@sentry/nextjs';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'payment',
      userId: user.id,
    },
  });
}
```

---

## 🎯 Quick Start Checklist

- [ ] **Email Setup**
  - [ ] Create Gmail App Password OR configure SMTP
  - [ ] Add credentials to `.env.local`
  - [ ] Test by creating a booking

- [ ] **reCAPTCHA Setup**
  - [ ] Register site at https://www.google.com/recaptcha/admin
  - [ ] Add keys to `.env.local`
  - [ ] Add reCAPTCHA to login/signup forms

- [ ] **Sentry Setup**
  - [ ] Create account at https://sentry.io
  - [ ] Add DSN to `.env.local`
  - [ ] Configure `next.config.js`
  - [ ] Deploy and test error tracking

---

## 🧪 Testing

### Test Email
Create a test booking through the admin panel to trigger a confirmation email.

### Test reCAPTCHA
Try to submit a form multiple times rapidly - it should block or flag suspicious activity.

### Test Sentry
Throw a test error:
```ts
throw new Error('Test Sentry integration');
```
Check your Sentry dashboard for the error.

---

## 📚 Additional Resources

- [Nodemailer Docs](https://nodemailer.com/)
- [reCAPTCHA v3 Docs](https://developers.google.com/recaptcha/docs/v3)
- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

## ⚠️ Important Notes

1. **Never commit `.env.local`** - Keep your secrets safe
2. **Use different keys** for development and production
3. **Monitor email quota** - Free tiers have limits
4. **Check Sentry quota** - Free tier: 5K errors/month
5. **Test in development** first before deploying

---

Need help? Check the logs in your terminal for detailed error messages! 🐛
