# Wishlist Feature - Quick Reference

## 🎯 Overview
The wishlist feature allows authenticated users to save their favorite vehicles for later viewing.

## 📁 Files Structure

```
src/
├── models/
│   └── Wishlist.ts                    # Mongoose model
├── app/
│   ├── api/
│   │   └── wishlist/
│   │       └── route.ts               # API endpoints
│   └── wishlist/
│       └── page.tsx                   # Wishlist page
└── components/
    ├── VehicleCard.tsx                # Card with wishlist button
    └── Header.tsx                     # Navigation with wishlist link
```

## 🔌 API Endpoints

### GET `/api/wishlist`
Fetch user's wishlist with populated vehicle data.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "user": "userId",
    "vehicles": [
      { ...vehicleData },
      { ...vehicleData }
    ]
  }
}
```

### POST `/api/wishlist`
Add a vehicle to wishlist.

**Request Body:**
```json
{
  "vehicleId": "vehicleId"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ...wishlistData }
}
```

### DELETE `/api/wishlist?vehicleId=xxx`
Remove a vehicle from wishlist.

**Response:**
```json
{
  "success": true,
  "data": { ...wishlistData }
}
```

## 🎨 UI Components

### VehicleCard - Heart Button
```tsx
// Located in top-right corner of vehicle card
<button onClick={toggleWishlist}>
  <Heart className={isFavorite ? 'fill-red-500' : 'text-white'} />
</button>
```

**States:**
- Empty heart (not in wishlist)
- Filled red heart (in wishlist)
- Disabled during API call

### Header - Wishlist Link
```tsx
// Only visible when user is authenticated
{isAuthenticated && (
  <Link href="/wishlist">
    <Heart /> Wishlist
  </Link>
)}
```

### Wishlist Page
- Grid of saved vehicles
- Empty state with CTA
- Loading skeleton
- Responsive layout

## 🔐 Authentication

The wishlist API supports dual authentication:

1. **Custom JWT** (from cookies)
2. **NextAuth Session** (fallback)

```typescript
// Priority order:
1. Check for JWT token in cookies
2. If no JWT, check NextAuth session
3. If neither, return 401 Unauthorized
```

## 💡 Usage Examples

### Add to Wishlist
```typescript
const response = await fetch('/api/wishlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ vehicleId: 'xxx' }),
});
```

### Remove from Wishlist
```typescript
const response = await fetch(`/api/wishlist?vehicleId=xxx`, {
  method: 'DELETE',
});
```

### Fetch Wishlist
```typescript
const response = await fetch('/api/wishlist');
const data = await response.json();
const vehicles = data.data.vehicles;
```

## 🎯 User Flow

1. **User browses fleet**
2. **Clicks heart icon** on vehicle card
3. **If not logged in**: Shows alert to login
4. **If logged in**: 
   - Adds to wishlist
   - Heart fills with red
   - Success feedback
5. **User can view all saved vehicles** at `/wishlist`
6. **Click heart again** to remove from wishlist

## 🚨 Error Handling

### Not Authenticated
```javascript
{
  "success": false,
  "message": "Unauthorized"
}
// Status: 401
```

### Already in Wishlist
```javascript
{
  "success": false,
  "message": "Already in wishlist"
}
// Status: 400
```

### Server Error
```javascript
{
  "success": false,
  "message": "Error message"
}
// Status: 500
```

## 🎨 Styling

### Colors
- **Heart Empty**: `text-white`
- **Heart Filled**: `fill-red-500 text-red-500`
- **Button Background**: `bg-black/50 backdrop-blur-sm`
- **Hover**: `hover:bg-black/70`

### Animations
- Smooth color transitions
- Scale effect on hover
- Loading state with opacity

## 📱 Responsive Design

### Mobile (< 768px)
- 1 column grid
- Full-width cards
- Touch-friendly buttons

### Tablet (768px - 1024px)
- 2 column grid
- Medium cards

### Desktop (> 1024px)
- 3-4 column grid
- Compact cards

## 🔄 State Management

```typescript
const [isFavorite, setIsFavorite] = useState(false);
const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

// Prevents double-clicks
if (isTogglingFavorite) return;
```

## 🎯 Future Enhancements

- [ ] Wishlist count badge in header
- [ ] Email notifications for price drops
- [ ] Share wishlist with friends
- [ ] Wishlist categories/folders
- [ ] Compare wishlisted vehicles
- [ ] Export wishlist as PDF
- [ ] Wishlist expiry/cleanup

## 📊 Database Schema

```typescript
{
  user: ObjectId (ref: 'User', unique: true),
  vehicles: [ObjectId] (ref: 'Vehicle'),
  createdAt: Date,
  updatedAt: Date
}
```

## ⚡ Performance Tips

1. **Populate only needed fields**:
```typescript
.populate('vehicles', 'brand model pricing images')
```

2. **Add indexes**:
```typescript
wishlistSchema.index({ user: 1 });
```

3. **Cache wishlist data**:
```typescript
// Use Redis for frequently accessed wishlists
```

4. **Lazy load images**:
```typescript
<Image loading="lazy" ... />
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Add vehicle to wishlist (logged in)
- [ ] Add vehicle to wishlist (logged out)
- [ ] Remove vehicle from wishlist
- [ ] Try to add same vehicle twice
- [ ] View wishlist page
- [ ] Empty wishlist state
- [ ] Mobile responsiveness
- [ ] Tablet responsiveness
- [ ] Desktop responsiveness

### API Testing
```bash
# Get wishlist
curl -X GET http://localhost:3000/api/wishlist \
  -H "Cookie: token=YOUR_JWT_TOKEN"

# Add to wishlist
curl -X POST http://localhost:3000/api/wishlist \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -d '{"vehicleId":"VEHICLE_ID"}'

# Remove from wishlist
curl -X DELETE "http://localhost:3000/api/wishlist?vehicleId=VEHICLE_ID" \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

---

**Last Updated**: February 8, 2026
**Feature Status**: ✅ Fully Functional
