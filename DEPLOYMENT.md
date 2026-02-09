# 🚀 PRODUCTION DEPLOYMENT GUIDE (Next.js Edition)

## Complete Car Rental Marketplace - Vercel Ready

This guide provides instructions to deploy your full-stack Next.js car rental marketplace to Vercel (recommended) or any other Next.js compatible hosting.

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. Infrastructure Requirements
- [ ] Vercel Account (Free or Pro)
- [ ] Domain name purchased
- [ ] MongoDB Atlas account (Database)
- [ ] Email service (SendGrid/Resend)
- [ ] Cloudinary account (Image storage)

### 2. Environment Variables
Ensure you have the following variables ready for the Vercel dashboard:

```bash
# Core
NODE_ENV=production

# Database
MONGODB_URI

# Authentication
JWT_SECRET=your_long_secure_secret
JWT_EXPIRE=30d

# External Services (Optional for now)
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
# STRIPE_SECRET_KEY=...
```

---

## 🏗️ DEPLOYMENT STEPS

### Option 1: Vercel (Recommended)

1. **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.
2. **Login to Vercel**: Go to [vercel.com](https://vercel.com) and sign in.
3. **Import Project**: Click "Add New..." -> "Project" and select your repository.
4. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `next build` (default)
   - **Install Command**: `npm install` (default)
5. **Add Environment Variables**:
   - Copy/Paste the variables from your local `.env` (excluding standard ones Vercel provides).
6. **Deploy**: Click "Deploy". Vercel will build your app and split your API routes into serverless functions automatically.

### Option 2: Docker / Self-Hosted

If you prefer to host on Railway, Render, or a VPS with Docker:

1. **Dockerfile**: Use the standard Next.js Dockerfile.
2. **Build**: `docker build -t car-rental .`
3. **Run**: `docker run -p 3000:3000 -e MONGODB_URI=... car-rental`

---

## 🔐 SECURITY NOTES

- **Authentication**: Usage of `httpOnly` cookies ensures XSS protection.
- **API Routes**: All `/api/` routes are serverless functions, scaling automatically with traffic.
- **Database**: Use connection pooling or `serverless` mode in MongoDB Atlas to prevent connection limits.

## 🧪 VERIFICATION

After deployment:
1. Visit `https://your-project.vercel.app/api/vehicles` to check the API.
2. Try logging in via the frontend (once UI is connected).
