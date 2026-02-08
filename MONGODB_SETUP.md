# 🔧 MongoDB Setup Guide

## Issue
Your app is showing errors because MongoDB is not running. You need a database to store vehicles, bookings, and users.

---

## ✅ Quick Fix: Use MongoDB Atlas (Recommended - 5 minutes)

**MongoDB Atlas is a FREE cloud database** - no installation needed!

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google (FREE - no credit card)

### Step 2: Create Free Cluster
1. Click "Build a Database"
2. Choose **M0 FREE** tier
3. Select a cloud provider (AWS recommended)
4. Choose a region close to you
5. Click "Create Cluster" (takes 1-3 minutes)

### Step 3: Create Database User
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `rentaladmin`
5. Password: `RentalPass123` (or create your own)
6. User Privileges: "Atlas admin"
7. Click "Add User"

### Step 4: Allow Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go back to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like this):
   ```
   mongodb+srv://rentaladmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

### Step 6: Update .env.local
Open `/Users/mustafaegeh/rental/.env.local` and replace line 3:

**FROM:**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/car-rental-marketplace
```

**TO:**
```env
MONGODB_URI=mongodb+srv://rentaladmin:RentalPass123@cluster0.xxxxx.mongodb.net/car-rental?retryWrites=true&w=majority
```
(Use YOUR actual connection string!)

### Step 7: Restart Dev Server
```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 8: Seed Database
Visit: http://localhost:3000/api/seed

You should see: `{"success":true,"message":"Database seeded successfully"}`

---

## 🏠 Alternative: Install MongoDB Locally

If you prefer to run MongoDB on your computer:

### Install via Homebrew
```bash
# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
mongosh --eval "db.version()"
```

### Then restart your app:
```bash
npm run dev
```

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- **Atlas**: Check your connection string has the correct password
- **Local**: Make sure MongoDB service is running: `brew services list`

### "Authentication failed"
- **Atlas**: Verify username/password in Database Access
- **Atlas**: Make sure IP is whitelisted in Network Access

### "Network timeout"
- **Atlas**: Check your internet connection
- **Atlas**: Verify Network Access allows your IP

### Still not working?
1. Check `.env.local` has correct `MONGODB_URI`
2. Restart dev server after changing `.env.local`
3. Check MongoDB Atlas dashboard shows cluster is active (green)

---

## ✅ Success Checklist

Once MongoDB is connected, you should see:
- ✅ Homepage loads without errors
- ✅ CSS styles are working (dark theme)
- ✅ No 500 errors in browser console
- ✅ `/api/seed` returns success message
- ✅ Featured vehicles appear on homepage

---

## 🎯 Next Steps After Setup

1. Visit http://localhost:3000
2. Homepage should show 3 vehicles
3. Login with: `admin@rental.com` / `password123`
4. Test booking flow!

---

**Need help?** Check the browser console (F12) for specific error messages.
