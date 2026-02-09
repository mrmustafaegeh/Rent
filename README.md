# 🚗 RENTALX - Premium Car Rental Marketplace

A production-ready, full-stack car rental platform built with Next.js 15+, TypeScript, MongoDB, and Stripe

![RentalX Banner](https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop)

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Current Status](#-current-status)
- [Quick Start Guide](#-quick-start-guide)
- [MongoDB Setup](#-mongodb-setup)
- [Project Structure](#-project-structure)
- [Features Implemented](#-features-implemented)
- [Development Roadmap](#-development-roadmap)
- [API Documentation](#-api-documentation)
- [Deployment Guide](#-deployment-guide)
- [Performance & SEO](#-performance--seo)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview
RENTALX is a modern, full-stack car rental marketplace inspired by OneClickDrive.com, featuring:

- **Multi-role Authentication System** (Customer, Admin, Company Owner)
- **Real-time Booking Management** with status tracking
- **Stripe Payment Integration** for secure transactions
- **Admin Dashboard** for fleet and booking management
- **Responsive Dark Theme** with Tailwind CSS v4
- **SEO Optimized** with Next.js metadata API
- **Production Ready** for Vercel deployment

## 🎨 Tech Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15 + TypeScript | React framework with App Router |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework |
| **Backend** | Next.js API Routes | Serverless API endpoints |
| **Database** | MongoDB + Mongoose | NoSQL database with ODM |
| **Auth** | JWT + HTTP-only Cookies | Secure authentication |
| **Payments** | Stripe | Payment processing |
| **Deployment** | Vercel | Serverless hosting |

## ✅ Current Status
### Completed Features (Phase 1-2)
| Feature | Status | Notes |
|---------|--------|-------|
| **Authentication System** | ✅ Complete | Login, Register, JWT, Role-based access |
| **Vehicle Management** | ✅ Complete | CRUD operations, Admin dashboard |
| **Booking System** | ✅ Complete | Create, view, approve bookings |
| **Stripe Integration** | ✅ Complete | Payment Intent, Checkout flow |
| **Admin Dashboard** | ✅ Complete | Fleet management, Booking approval |
| **Responsive UI** | ✅ Complete | Mobile-first design |
| **Dark Theme** | ✅ Complete | Tailwind CSS v4 |
| **Database Models** | ✅ Complete | User, Vehicle, Booking, Company |
| **API Routes** | ✅ Complete | RESTful endpoints |

### Issues Fixed
- ✅ Tailwind CSS v4 compatibility (PostCSS configured)
- ✅ Mongoose pre-save hooks (removed deprecated next())
- ✅ Vehicle API validation (correct schema fields)
- ✅ Missing company ID in Add Vehicle form
- ✅ React hydration warnings

### Current Performance Scores
| Metric | Score | Target |
|--------|-------|--------|
| Functionality | 100% | ✅ |
| SEO | 75% | 🟡 Needs improvement |
| Performance | 85% | 🟡 Needs optimization |
| Accessibility | 90% | ✅ |
| Best Practices | 95% | ✅ |

## 🚀 Quick Start Guide
### Prerequisites
- Node.js 18+
- MongoDB Atlas Account (Free tier)
- Stripe Account (Optional)
- Git installed

### Installation (5 Minutes)
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd rental

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI (see MongoDB Setup section)

# 4. Start development server
npm run dev

# 5. Seed database (create admin user + sample vehicles)
# Open browser: http://localhost:3000/api/seed

# 6. Login as admin
# Email: admin@rental.com
# Password: password123
```
That's it! Visit http://localhost:3000 🎉

## 🗄️ MongoDB Setup
### Option 1: MongoDB Atlas (Recommended - 5 minutes)
FREE cloud database, no installation needed!

1. **Create Free Account** at MongoDB Atlas
2. **Create Free Cluster** (M0 Tier, AWS, your region)
3. **Create Database User**
   - Username: `rentaladmin`
   - Password: `RentalPass123` (Save this!)
   - Privileges: "Atlas admin"
4. **Allow Network Access**
   - Add IP Address -> "Allow Access from Anywhere"
5. **Get Connection String**
   - Connect -> Connect your application -> Copy string
   - Replace `<password>` with actual password

6. **Update Environment Variables** in `.env.local`:
   ```env
   
   ```

## 📁 Project Structure
```
rental/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes (Serverless)
│   │   ├── (public)/                 # Public pages
│   │   ├── auth/                     # Authentication pages
│   │   ├── vehicles/                 # Vehicle pages
│   │   ├── checkout/                 # Checkout flow
│   │   ├── dashboard/                # Protected dashboard
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── components/                   # React components
│   ├── context/                      # React Context
│   ├── lib/                          # Utilities
│   └── models/                       # Mongoose schemas
├── public/                           # Static assets
└── ...config files
```

## 🗺️ Development Roadmap

### 🔴 Phase 3: Core Pages & Features (NEXT PRIORITY)
**3.1 Fleet Catalog Page (/fleet) - HIGH PRIORITY**
- Display all vehicles
- Advanced filtering (Category, Brand, Price, Seats, Transmission, Fuel)
- Sorting options
- Search bar

**3.2 Locations Page (/locations) - MEDIUM PRIORITY**
- Google Maps/Mapbox integration
- Location cards (Dubai, Abu Dhabi, Sharjah)

**3.3 How It Works Page (/how-it-works) - MEDIUM PRIORITY**
- 4-step process guide
- FAQ Accordion

**3.4 About Us Page (/about) - LOW PRIORITY**

### 🔴 Phase 4: Advanced Features (FUTURE)
- User Profile & Settings
- Advanced Search & Filters
- Reviews & Ratings
- Email Notifications
- Multi-language Support
- Analytics Dashboard
- Multi-company Features

### 🔴 Phase 5: Performance & SEO Optimization
- Image Optimization (Next/Image, WebP)
- Code Splitting & Bundle Size
- Metadata Enhancement (JSON-LD, OpenGraph)
- Sitemap & Robots.txt

### 🔴 Phase 6: Production Deployment
- Vercel Deployment
- Custom Domain
- SSL
- Analytics

## 📚 API Documentation
(See full documentation in source)

## 📄 License
This project is open source and available under the MIT License.
