# 🚀 Quick Reference Guide

## Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm start                # Start production server

# Database
# Visit http://localhost:3000/api/seed to seed database

# Testing
curl http://localhost:3000/api/vehicles  # Test API
```

---

## 🔑 Demo Credentials

**Admin Login**
```
Email: admin@rental.com
Password: password123
```

---

## 📍 Important URLs

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/` | Featured vehicles |
| Login | `/auth/login` | User login |
| Register | `/auth/register` | New user signup |
| Dashboard | `/dashboard` | User dashboard |
| My Bookings | `/dashboard/bookings` | Customer bookings |
| Manage Fleet | `/dashboard/vehicles` | Admin vehicle management |
| All Bookings | `/dashboard/all-bookings` | Admin booking management |
| Add Vehicle | `/dashboard/vehicles/new` | Add new vehicle |
| Vehicle Details | `/vehicles/[id]` | Dynamic vehicle page |
| Checkout | `/checkout` | Payment page |

---

## 🛠️ Common Tasks

### Add a New Vehicle (Admin)
1. Login as admin
2. Go to Dashboard → Manage Vehicles
3. Click "Add New Vehicle"
4. Fill form:
   - Brand: e.g., "BMW"
   - Model: e.g., "M4 Competition"
   - Year: 2024
   - Category: Sports
   - Seats: 4
   - Transmission: Automatic
   - Fuel: Petrol
   - Price: 800
   - Image URL: (use Unsplash)
5. Submit

### Make a Booking (Customer)
1. Login or register
2. Click "Rent Now" on any vehicle
3. Select dates
4. Click "Proceed to Checkout"
5. Complete payment
6. View in "My Bookings"

### Approve a Booking (Admin)
1. Login as admin
2. Go to Dashboard → All Bookings
3. Find pending booking
4. Click "Approve"

---

## 🎨 Image URLs (Unsplash)

Use these for adding vehicles:

```
Porsche:
https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070

Mercedes:
https://images.unsplash.com/photo-1622354779261-7589b257523f?q=80&w=2621

Range Rover:
https://images.unsplash.com/photo-1606219665804-98ae8b50f771?q=80&w=2069

BMW:
https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070

Lamborghini:
https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2074

Tesla:
https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071
```

---

## 🔧 Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm run dev
```

### MongoDB connection error
```bash
# Check if MongoDB is running
mongosh

# Or use MongoDB Atlas connection string in .env.local
MONGODB_URI=mongodb+srv://...
```

### Stripe not working
1. Check `.env.local` has Stripe keys
2. Use test keys from Stripe Dashboard
3. Test card: `4242 4242 4242 4242`

### Build errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

---

## 📊 Database Schema Quick Reference

### User
```typescript
{
  firstName: string
  lastName: string
  email: string (unique)
  password: string (hashed)
  role: 'customer' | 'admin' | 'company_owner'
  phone: string
  isActive: boolean
}
```

### Vehicle
```typescript
{
  brand: string
  vehicleModel: string
  year: number
  category: 'Luxury' | 'Sports' | 'SUV' | 'Sedan' | 'Electric'
  transmission: 'Automatic' | 'Manual'
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'
  seats: number
  pricing: { daily: number }
  images: [{ url: string, isPrimary: boolean }]
  available: boolean
  company: ObjectId
}
```

### Booking
```typescript
{
  bookingNumber: string (auto-generated)
  customer: ObjectId
  vehicle: ObjectId
  company: ObjectId
  startDate: Date
  endDate: Date
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
}
```

---

## 🎯 API Testing with curl

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rental.com",
    "password": "password123"
  }'
```

### Get Vehicles
```bash
curl http://localhost:3000/api/vehicles
```

### Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "admin@rental.com",
    "vehicleId": "VEHICLE_ID_HERE",
    "startDate": "2024-03-01",
    "endDate": "2024-03-05"
  }'
```

---

## 🚀 Deployment Quick Steps

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_production_secret
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 💡 Pro Tips

1. **Use MongoDB Atlas** for production (free tier available)
2. **Enable Stripe webhooks** for production
3. **Add rate limiting** to API routes
4. **Set up monitoring** with Vercel Analytics
5. **Use environment-specific configs**
6. **Add error tracking** (Sentry)
7. **Implement caching** for vehicle listings
8. **Add image optimization** with Next.js Image

---

## 📞 Support

- Check README.md for full documentation
- Review PROJECT_SUMMARY.md for overview
- See DEPLOYMENT.md for deployment guide

---

**Happy Coding! 🎉**
