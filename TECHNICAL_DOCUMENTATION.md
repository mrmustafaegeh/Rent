# 🛠️ RentalX Technical Documentation & Developer Guide

This document contains all technical details, setup instructions, and deployment guides for the RentalX Car Rental Marketplace.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Local Development Setup](#local-development-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup (MongoDB)](#database-setup-mongodb)
6. [Service Integrations](#service-integrations)
   - [Cloudinary (Images)](#1-cloudinary-images)
   - [Google & Facebook OAuth](#2-google--facebook-oauth)
   - [Email Service](#3-email-service)
   - [ReCAPTCHA](#4-recaptcha-protection)
   - [Sentry (Error Monitoring)](#5-sentry-error-monitoring)
7. [Deployment Guide](#deployment-guide)
8. [Project Structure](#project-structure)
9. [Key Features Implementation](#key-features-implementation)

---

## 🚀 Project Overview

RentalX is a premium, full-stack car rental marketplace built with maintaining scalability, performance, and user experience in mind. It supports multi-language (i18n), comprehensive admin management, and seamless booking flows.

---

## 💻 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js
- **Forms/Validation**: React Hook Form
- **Internationalization**: `next-intl` (English, Arabic, Russian, Turkish, Greek)
- **Monitoring**: Sentry

---

## 🛠️ Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd rental
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in the required credentials (see [Environment Configuration](#environment-configuration)).

4. **Seed the Database**:
   ```bash
   npm run seed
   # or visit http://localhost:3000/api/seed after starting server
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 🔑 Environment Configuration

Create a `.env.local` file in the root directory. Required variables:

```env
# Core
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_key_here

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/rentalx

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

# Email Service (SMTP or Gmail)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
# Or Custom SMTP
SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=key

# Security
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

---

## 🗄️ Database Setup (MongoDB)

### Recommended: MongoDB Atlas (Cloud)
1. **Create Account**: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Create Cluster**: Select **M0 Free Tier**.
3. **Database Access**: Create a user (e.g., `admin`) and password.
4. **Network Access**: Whitelist IP `0.0.0.0/0` (Allow from anywhere) for development.
5. **Connection String**: 
   - Get the URI (e.g., `mongodb+srv://admin:pass@cluster0...`).
   - Add to `MONGODB_URI` in `.env.local`.

### Local MongoDB (Alternative)
- Install Community Server via Homebrew: `brew install mongodb-community`
- Start Service: `brew services start mongodb-community`
- URI: `mongodb://127.0.0.1:27017/rentalx`

---

## 🔌 Service Integrations

### 1. Cloudinary (Images)
Used for storing vehicle images and user avatars.
- **Dashboard**: [cloudinary.com/console](https://cloudinary.com/console)
- **Get Credentials**: Copy Cloud Name, API Key, and API Secret from the dashboard.
- **Troubleshooting**: If upload fails, ensure `CLOUDINARY_CLOUD_NAME` matches exactly (case-sensitive).

### 2. Google & Facebook OAuth
- **Google Cloud Console**: Create credentials for "Web Application".
  - Authorized Redirect URI: `http://localhost:3000/api/auth/callback/google`
- **Meta/Facebook Developers**: Create an App ("Consumer" type).
  - Add "Facebook Login" product.
  - Valid OAuth Redirect URI: `http://localhost:3000/api/auth/callback/facebook`

### 3. Email Service
Used for booking confirmations and welcome emails.
- **Gmail**: Generate an **App Password** (Account > Security > 2-Step Verification > App Passwords).
- **Custom SMTP**: Use SendGrid or AWS SES credentials.

### 4. ReCAPTCHA Protection
Protects Login and Register forms from bots.
- **Admin**: [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
- **Type**: Select **reCAPTCHA v3**.
- **Domains**: Add `localhost` and your production domain.

### 5. Sentry (Error Monitoring)
- **Setup**: Create a project in [Sentry.io](https://sentry.io).
- **In Code**: `sentry.client.config.ts`, `sentry.server.config.ts` handles initialization.

---

## 🚀 Deployment Guide

### Vercel (Recommended)
1. **Push to GitHub**.
2. **Import Project** in Vercel.
3. **Environment Variables**: accurate copy/paste from `.env.local`.
4. **Deploy**: Vercel handles build/serverless functions automatically.

### Docker / VPS
1. **Build**: `docker build -t rentalx .`
2. **Run**: `docker run -p 3000:3000 --env-file .env.local rentalx`

---

## 📂 Project Structure

```
/src
  /app           # Next.js App Router Pages
    /[locale]    # Internationalized routes (en, ar, etc.)
    /api         # Backend API Routes
    /dashboard   # Admin & User Dashboard
  /components    # React Components
  /lib           # Utilities (db, auth, email, etc.)
  /models        # Mongoose/MongoDB Schemas
  /messages      # i18n Translation Files (en.json, ar.json)
  /hooks         # Custom React Hooks
```

---

## ✨ Key Features Implementation

### Internationalization (i18n)
- Uses `next-intl`.
- Routes are wrapped in `/[locale]`.
- Arabic (RTL) is automatically handled via `dir="rtl"` in layout.

### Wishlist & Favorites
- Authenticated users can "favorite" vehicles.
- API: `/api/wishlist` handles CRUD operations.
- Frontend: `VehicleCard` toggles state instantly with optimistic UI updates.

### Admin Dashboard
- **Access**: Role-based access (admin users only).
- **Capabilities**:
  - Manage Vehicles (Create, Edit, Delete).
  - Manage Bookings (Approve, Reject, Calendar View).
  - Manage Users.

### Booking System
- **Flow**: User selects dates -> Stripe Payment (or Pay Later) -> Pending Status -> Admin Approval.
- **Emails**: Automated emails sent on "Pending" (to Admin) and "Confirmed" (to User).
