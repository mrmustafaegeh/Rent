# MyIsland Car Rental — Complete UI/UX Redesign Brief

> **Company**: MyIsland — Premium Car Rental, North Cyprus  
> **Stack**: Next.js 16, TypeScript, Tailwind CSS, Framer Motion  
> **i18n**: English + Arabic (RTL support required)  
> **Routes**: All pages are prefixed with `/[locale]/` (e.g. `/en/cars`)

---

## CURRENT BRAND TOKENS

| Token | Value | Usage |
|---|---|---|
| Navy / Deep Blue | `#0D3B66` | Headings, CTAs, logo, footer |
| Turquoise | `#00B4D8` | Accents, icons, hover states |
| White | `#FFFFFF` | Backgrounds, cards |
| Light Gray | `#F9FAFB` | Alternating section backgrounds |
| Slate | `#1F2937` | Body text |
| Gray 500 | `#6B7280` | Subtext, labels |
| Green | `#25D366` | WhatsApp buttons |
| Red | `#EF4444` | Errors, logout |

**Current font families**: `font-heading` (display/bold), `font-body`, `font-dm-sans`

---

## GLOBAL LAYOUT COMPONENTS

### 1. HEADER (sticky, `z-1000`)

**States:**
- **On hero (not scrolled):** Semi-transparent dark (`bg-black/25 backdrop-blur-sm`), white text
- **Scrolled:** `bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100`, dark text

**Elements:**
| # | Element | Type | Current Style | Notes |
|---|---|---|---|---|
| 1 | Logo icon | `<div>` | Navy square (`#0D3B66`), rounded-xl, turquoise `<Car>` icon inside | Scales on hover |
| 2 | Logo text "My**Island**" | `<span>` | Font-black, "Island" in different color | Adapts color: white on hero, slate-900 on scroll |
| 3 | Navigation links | `<Link>` × 5-6 | 14.5px medium, gray-600 / white, turquoise underline on hover/active | Desktop only, hidden on mobile |
| 4 | Language switcher | `<LanguageSwitcher>` | Inline dropdown | EN / AR |
| 5 | Currency switcher | `<CurrencySwitcher>` | Inline dropdown | EUR / GBP / USD etc. |
| 6 | Login button | `<Button variant="ghost">` | Border, transitions color with scroll state | Links to `/auth/login` |
| 7 | "List Your Car" CTA | `<Button>` | `bg-[#0D3B66]` solid, white text | Links to `/list-your-car` |
| 8 | Mobile hamburger | `<Button variant="ghost" size="icon">` | Shows on `< lg` screens | Toggles mobile menu |
| 9 | Mobile menu | Full-screen overlay | Dark navy background, stacked nav links | Closes on route change |

---

### 2. FOOTER

**Background:** Dark navy `bg-navy`  
**Layout:** `grid-cols-12` on desktop, stacked on mobile

**Columns:**
| Column | Content |
|---|---|
| Brand (4 cols) | Logo, tagline, address, phone, email with icon |
| Company (2 cols) | About, How It Works, Careers, Blog, Contact, Partners |
| Fleet (2 cols) | Links to /cars?category=luxury/suv/economy/sports/electric |
| Support (2 cols) | FAQ, Terms, Privacy, Insurance, Sitemap, Tourist Rules |
| Get App (2 cols) | "Download on App Store" + "Get on Google Play" buttons |

**Bottom bar:** Copyright left, social icons right (Facebook, Instagram, Twitter, LinkedIn)

---

## HOMEPAGE (`/en/`)

The homepage is composed of **11 sequential sections**:

---

### SECTION 1: HERO SECTION

**Component:** `HeroSection.tsx`  
**Layout:** Full viewport height (`100dvh`), centered flex column, photo background

**Background:**
- Image: `/images/kyrenia-hero.png` (Kyrenia harbour, North Cyprus)
- Overlay: `bg-gradient-to-t from-black/70 via-black/20 to-transparent` (scrim at bottom only — photo must stay bright)
- Top accent line: 4px gradient bar `from-[#0D3B66] via-[#00B4D8] to-[#0D3B66]`

**Content (stacked vertically, centered):**

| # | Element | Type | Content |
|---|---|---|---|
| 1 | Eyebrow | `<p>` | "— Premium Car Rental — North Cyprus —" with turquoise dash lines on sides |
| 2 | Main headline | `<h1>` | Large font-black headline (translated), subtitle highlight in turquoise |
| 3 | Subtext | `<p>` | Descriptive tagline (translated), white/75 opacity |
| 4 | Booking widget card | White card | See below |
| 5 | Scroll indicator | `<button>` | "SCROLL" label + animated line, bottom-center |

**Booking Widget Card (white, `max-w-3xl`):**
```
┌─────────────────────────────────────────────────┐
│  [MapPin] PICKUP LOCATION  │ [Cal] PICKUP DATE  │ [Cal] RETURN DATE  │
│  City dropdown             │  datetime-local    │  datetime-local    │
├─────────────────────────────────────────────────┤
│  [Search icon] FIND YOUR CAR   (full-width btn) │
├─────────────────────────────────────────────────┤
│  ✓ Free Cancellation   ✓ 24/7 Support   ✓ Best Price │
└─────────────────────────────────────────────────┘
```

**Booking Widget Inputs:**
| Input | Type | Details |
|---|---|---|
| Location | `<Select>` | Options: Ercan Airport, Nicosia, Kyrenia, Famagusta |
| Pickup Date | `datetime-local` | Min = now, `[color-scheme:light]` |
| Return Date | `datetime-local` | Min = pickup date, disabled until pickup chosen |

**Search Button:**
- Full width, `h-52px (~h-13)`, deep navy `#0D3B66`, white bold text, Search icon left
- Navigates to: `/cars?location={val}&pickup={val}&dropoff={val}`

**Trust strip (below button):**
- `ShieldCheck` + "Free Cancellation"
- `Clock` + "24/7 Support"  
- `Award` + "Best Price Guarantee"

---

### SECTION 2: CATEGORY GRID

**Component:** `CategoryGrid.tsx`  
**Background:** `bg-white`  
**Padding:** `py-20`

**Header:**
- Eyebrow: gray-400, uppercase, small
- H2: dark gray-900, font-black, large
- Subtext: gray-500

**Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, 6 cards

**Each card (`h-300–320px`):**
```
┌─────────────────────────────────────────┐
│                                 [£60/d] │  ← floating white price badge (top-right)
│           [Photo fills card]            │
│                                         │
│  [Category Name]          (big white)   │
│  [20+ vehicles]           (small white) │
│  [Browse cars →]          (turquoise)   │
└─────────────────────────────────────────┘
```

**6 Categories:**
| Slug | Display Name | Starting Price |
|---|---|---|
| `ECONOMY` | Economy | £35/day |
| `LUXURY` | Luxury | £60/day |
| `SUV` | SUV | £55/day |
| `SPORTS` | Sports | £120/day |
| `HATCHBACK` | Hatchback | £30/day |
| `ELECTRIC` | Electric | £45/day |

**Navigation:** Click → `/cars?category=LUXURY` (uppercase, matches Prisma enum)

---

### SECTION 3: LUXURY SHOWCASE

**Component:** `LuxuryShowcase.tsx`  
**Background:** `bg-white` with `opacity-[0.035]` dot-grid pattern  
**Padding:** `py-24`

**Header:**
- Eyebrow: gray-400, small caps
- H2: gray-900, font-bold, 4xl–5xl
- Subtext: gray-500

**Controls row:**
- Previous/Next arrow buttons (turquoise border, dark background on hover)
- "View All Luxury Cars →" link

**Vehicle cards (horizontal scroll, `snap-center`, `w-[340px] md:w-[420px]`):**
```
┌──────────────────────────────┐
│  [Large vehicle photo 3:2]   │
│  [Category badge + WhatsApp] │
├──────────────────────────────┤
│  Vehicle Name + Model        │
│  Year | Transmission | Type  │
│                              │
│  [£60/day] | [£x/month]     │  ← pricing grid (2 cols)
│  [250km/day]  [Petrol]       │
│  [📞 Call]  [💬 WhatsApp]   │
└──────────────────────────────┘
```

**Inputs/Buttons per card:**
| Element | Type | Action |
|---|---|---|
| Call button | `<Button variant="outline">` | Phone icon, turquoise border |
| WhatsApp button | `<Button>` | Green `#25D366` → `/api/whatsapp` |
| Prev/Next arrows | `<button>` | Scroll carousel |
| "View All" | `<Link>` | `/cars?category=LUXURY` |

---

### SECTION 4: HOW IT WORKS

**Component:** `HowItWorks.tsx`  
**Background:** `bg-[#F8FAFC]` (off-white)  
**Padding:** `py-24`

**Header:**
- Eyebrow: turquoise/gold, small caps
- H2: navy, font-bold
- Subtext: gray-500

**3-step card row (connected by dashed line on desktop):**
| Step | Icon | Title | Card content |
|---|---|---|---|
| 01 | `<Search>` | Choose Your Car | Description text |
| 02 | `<CalendarCheck>` | Book & Confirm | Description text |
| 03 | `<Key>` | Pick Up & Drive | Description text |

Each step = circular icon (white, navy icon inside, number badge) + white card below with title + description.

**CTA below steps:**
- Primary: `<Button>` "Find Your Car" → `/cars` (electric/turquoise, rounded-full)
- Secondary: `<Link>` "Learn more about how it works" → `/how-it-works`

---

### SECTION 5: AFFORDABLE CARS

**Component:** `AffordableCars.tsx`  
**Background:** `bg-gray-50`  
**Padding:** `py-24`

**Header:**
- Eyebrow: gray-400 small
- H2: gray-900 font-bold
- Subtext: gray-500
- "View All" button (gray outline) → `/cars?category=ECONOMY`

**4 car cards (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`):**
```
┌──────────────┐
│  [Car photo] │  ← object-cover, rounded top
├──────────────┤
│  Brand Model │  ← gray-900, text-xl bold
│  👥 5  💼 2 ⛽ Petrol │  ← gray-400, small
├──────────────┤
│  Daily Rate:          Weekly:    │
│  [£35/day] navy       [£210]     │
├──────────────┤
│  [📞 Call]  [💬 WhatsApp]        │
└──────────────┘
```

---

### SECTION 6: WHY CHOOSE US

**Component:** `WhyChooseUs.tsx`  
**Background:** `bg-navy` (dark blue)  
**Padding:** `py-32`

**Header (on dark background):**
- Eyebrow: gold/turquoise text, tracking-widest
- H2: white, 7xl font-black
- Subtext: gray-400

**3 feature tiles:**
| # | Icon | Title | Subtitle |
|---|---|---|---|
| 1 | `<Layers>` | EXCLUSIVE | Fleet Excellence |
| 2 | `<Tag>` | TRANSPARENCY | No Hidden Fees |
| 3 | `<ShieldCheck>` | EXPERIENCE | 10 Years Trusted |

Each tile: large icon box (white/5 bg, gold icon), h3 in gold caps, h4 in white, p in gray-400. "Learn More →" appears on hover.

---

### SECTION 7: LOCATION GRID

**Component:** `LocationGrid.tsx`  
**Background:** `bg-white`  
**Padding:** `py-32`

**Header:**
- Eyebrow: gold/turquoise
- H2: navy, 5xl–6xl
- Subtext: gray-500
- "Explore All Locations →" outline button → `/locations`

**Bento grid layout (`grid-cols-1 md:grid-cols-3 lg:grid-cols-4`, `auto-rows-[350px]`):**
| Location | Size | Image |
|---|---|---|
| Kyrenia | 2 cols wide | `/images/kyrenia-new.png` |
| Nicosia | 1 col | `/images/nicosia-new.png` |
| Famagusta | 1 col | `/images/famagusta-new.png` |
| Ercan Airport | 4 cols (full row) | Unsplash airport photo |

Each card: photo bg + dark gradient → location name in white + vehicle count + arrow button. "Popular" badge on Ercan.

**Navigation:** Click → `/cars?location={slug}`

---

### SECTION 8: BRAND GRID

**Component:** `BrandGrid.tsx`  
**Background:** light gray  
**Content:** Logo/brand icons for Bentley, BMW, Lamborghini, Ferrari, Rolls Royce, Mercedes, Audi, Porsche, Toyota, etc.  
Each brand links to: `/cars?brand={name}`

---

### SECTION 9: PARTNER CTA

**Component:** `PartnerCTA.tsx`  
**Background:** `bg-white` (outer section) with inner `bg-navy` rounded card

**Inner dark card contains:**
- Left column: eyebrow (gold), H2 (white, 4xl–6xl), description (gray-400), 2×2 feature grid, CTA button
- Right column: 2×2 stat cards

**Feature tiles (2 cols):**
| Icon | Title | Desc |
|---|---|---|
| `<TrendingUp>` | Earn More Revenue | desc |
| `<ShieldCheck>` | Secure & Insured | desc |

**Stat cards:**
| Card | Value | Label |
|---|---|---|
| Card 1 | 150+ | Active Partners |
| Card 2 (gold bg) | 500+ | Listed Vehicles |
| Card 3 (white bg) | `<Building2>` | Easy Integration |
| Card 4 | `<Users>` (gold) | Global Reach |

**CTA Button:** "Become a Partner →" → `/auth/partner-register`  
Style: gold bg, navy text, h-16, rounded-2xl

---

### SECTION 10: FAQ

**Component:** `FAQ.tsx`  
**Background:** `bg-gray-50` or white  
**Layout:** Accordion-style expandable Q&A items

---

### SECTION 11: FINAL CTA BANNER

**Background:** `bg-navy` with gradient overlay  
**Content:**
- H2: white, large, centered
- Subtext: gray-300
- Two buttons side by side:
  | Button | Style | Route |
  |---|---|---|
  | "Rent a Car" | Gold bg, navy text, rounded-full, h-16 | `/cars` |
  | "Talk to an Expert" | Outline white border, white text, rounded-full | `/contact` |

---

## CARS PAGE (`/en/cars`)

**Layout:** Header → Page Hero → `<main>` (Sidebar + Results) → Footer

**Page hero (40vh):**
- Background image `/images/hero-bg-cyprus.png`
- Navy overlay
- Vertical gradient fade to gray-50 at bottom
- Text: eyebrow in gold + H1 in white + subtext in gray-200

### Sidebar (desktop, `w-80`, sticky)

**Component:** `CarFilters.tsx`

**Filter groups:**
| Filter | Input Type | Notes |
|---|---|---|
| Category | Checkbox group | Economy, Luxury, SUV, Sports, Hatchback, Electric |
| Brand | Checkbox group | BMW, Mercedes, Toyota, etc. |
| Transmission | Checkbox group | Automatic, Manual |
| Fuel Type | Checkbox group | Petrol, Diesel, Electric, Hybrid |
| Price Range | `<Slider>` (range) | £0–£500/day, two-handle slider |
| Seats | Number select | 2, 4, 5, 7, 8+ |

**Buttons in sidebar:**
- "Apply Filters" (primary)
- "Clear All" (ghost)

**Mobile:** Filters hidden, replaced by "Filters" button that opens `<Sheet>` (slide-in panel from left)

### Toolbar row
- Left: "Available Vehicles (X found)" heading
- Right: Sort dropdown (Price: Low→High, High→Low, Newest) + mobile filter toggle

### Vehicle card grid (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3`)

**Component:** `VehicleCard.tsx`  
Each card:
```
┌──────────────────────────┐
│  [Car photo 16:9]        │
│  [Category badge]        │
├──────────────────────────┤
│  Brand + Model (h3)      │
│  Year • Transmission     │
│  👥 Seats  💼 Luggage    │
├──────────────────────────┤
│  £X/day  [Book Now →]   │
└──────────────────────────┘
```

**Empty state:** Center icon + "No Vehicles Found" + "Clear Filters" button

**Load More:** Outline button, centered, below grid

---

## VEHICLE DETAIL PAGE (`/en/cars/[id]`)

**Layout:** Header → Breadcrumb → 2-col grid (2/3 + 1/3) → Reviews → Similar Cars → Footer

### Left column (2/3):
| Section | Component | Content |
|---|---|---|
| Header info | inline | Category badge, star rating, H1 (Brand + Model), Year/Transmission/Fuel |
| Photo gallery | `<ImageGallery>` | Main image + thumbnail strip, expandable |
| Specs grid | `<VehicleSpecs>` | Transmission, Fuel, Seats, Year tiles |
| About | text block | Auto-generated description paragraph |
| Key Features | icon list | Feature chips from DB (Bluetooth, Nav, Parking Sensors, etc.) |
| Rental Conditions | expandable | Insurance, Cancellation, Deposit, Mileage cards |

### Right column (1/3, sticky):
**Rental vehicles show `<BookingWidget>`:**
```
┌──────────────────────────┐
│  Select Dates            │
│  Pickup: [date input]    │
│  Return: [date input]    │
│  Location: [select]      │
├──────────────────────────┤
│  Duration: X days        │
│  Daily rate: £X          │
│  ─────────────────────   │
│  TOTAL: £XX              │
│  [Book Now →]            │
├──────────────────────────┤
│  Free Cancellation note  │
│  Secure Payment note     │
└──────────────────────────┘
```

**For sale vehicles show:**
- Sale price (large)
- WhatsApp inquiry button (green, h-14)
- Call Sales Team button (navy outline, h-14)
- Email Us button (ghost, h-12)

**"Need Help?" card (below widget):**
- Navy background, white text
- "Contact Support" outline button

---

## CONTACT PAGE (`/en/contact`)

**Layout:** Header → Dark hero banner → Two-column contact section → Footer

**Page hero:**
- `bg-navy` background with dot pattern
- Eyebrow in gold + H1 (white) + description

**Two-column card:**
| Left (5/12) – Info panel | Right (7/12) – Form |
|---|---|
| Navy background | White background |
| Phone with icon | First Name + Last Name (grid 2-col) |
| Email with icon | Email + Phone (grid 2-col) |
| Address with icon | Message textarea (`min-h-150px`) |
| Social icons (IG, TW, FB) | "Send Message" button → POST `/api/contact` |

**Form inputs:**
| Field | Type | Validation |
|---|---|---|
| First Name | `text` | required |
| Last Name | `text` | required |
| Email | `email` | required |
| Phone | `tel` | optional |
| Message | `textarea` | required |

**Submit button:** Navy bg, gold icon, "Send Message" / "Sending…" loading state

---

## AUTH PAGES

### Login Page (`/en/auth/login`)

**Layout:** Full screen, dark navy bg, blurred photo background, centered glass card

**Glass card (`max-w-md`):**
| Element | Details |
|---|---|
| H1 | "Welcome Back" |
| Subtext | "Sign in to your account" |
| Error banner | Red/10 bg, red-200 text, conditional |
| Email input | `type="email"`, h-12, dark glass style |
| Password input | `type="password"`, h-12 |
| "Forgot password?" | Top-right link in gold |
| Submit button | Full width, gold gradient, navy text, h-12 |
| Divider | "OR CONTINUE WITH" |
| Social buttons | Google + Facebook + Apple (3-col grid) |
| Register link | "Don't have an account? CREATE ACCOUNT" |

### Register Page (`/en/auth/register`)

Similar layout to login, additional fields:
- Full Name
- Email
- Password
- Confirm Password
- Submit → POST `/api/auth/register`
- Already have account? → `/auth/login`

### Partner Register Page (`/en/auth/partner-register`)

Extended registration with:
- Personal info fields
- Company name
- Company type (individual / company)
- Vehicle count estimate
- Submit → POST `/api/auth/partner-register`

---

## DASHBOARD PAGES (`/en/dashboard/...`)

**Layout:** Sidebar nav + main content area

**Sidebar component (`Sidebar.tsx`):**
- Logo at top
- Nav links:
  | Link | Icon | Route |
  |---|---|---|
  | Overview | `<Home>` | `/dashboard` |
  | My Bookings | `<Calendar>` | `/dashboard/bookings` |
  | My Vehicles | `<Car>` | `/dashboard/vehicles` |
  | Users | `<Users>` | `/dashboard/users` (admin) |
  | All Bookings | `<List>` | `/dashboard/all-bookings` (admin) |
  | Approvals | `<Check>` | `/dashboard/admin/approvals` (admin) |
  | Analytics | `<BarChart>` | `/dashboard/admin/analytics` (admin) |
  | Messages | `<Mail>` | `/dashboard/admin/messages` (admin) |
  | Reviews | `<Star>` | `/dashboard/admin/reviews` (admin) |
  | Schedule | `<CalendarDays>` | `/dashboard/admin/schedule` (admin) |
  | Settings | `<Settings>` | `/dashboard/settings` |

### Dashboard Overview (`/dashboard`)

**Stat cards (top row):**
- Total Bookings
- Revenue (month)
- Active Vehicles
- Pending Approvals

**Charts section (`DashboardCharts.tsx`):**
- Revenue over time (line chart)
- Bookings by category (bar chart)

### Vehicles Page (`/dashboard/vehicles`)

- Table of partner's vehicles
- Columns: Photo, Name, Category, Price, Status, Actions
- "Add New Vehicle" button → `/dashboard/vehicles/new`
- Action buttons: Edit (`/dashboard/vehicles/[id]/edit`), Schedule (`/dashboard/vehicles/[id]/schedule`), Delete

### New Vehicle Form (`/dashboard/vehicles/new`)

**All form fields:**
| Field | Input Type | Options |
|---|---|---|
| Brand | text | — |
| Model | text | — |
| Year | number | — |
| Category | select | Economy, Luxury, SUV, Sports, Hatchback, Electric |
| Type | radio | Rent / Sale |
| Transmission | select | Automatic, Manual |
| Fuel Type | select | Petrol, Diesel, Electric, Hybrid |
| Seats | number | — |
| Luggage | number | — |
| Color | text | — |
| Mileage | number | km |
| Daily Price | number | £ |
| Weekly Price | number | £ |
| Monthly Price | number | £ |
| Sale Price | number | £ (if type=sale) |
| Currency | select | EUR, GBP, USD, TRY |
| Location | select | Kyrenia, Nicosia, Famagusta, Ercan |
| Features | multi-tag | Bluetooth, Navigation, Parking Sensors, etc. |
| Description | textarea | — |
| Images | `<ImageUpload>` | Drag & drop, multi-image, click-to-remove |

**Submit button:** "List Vehicle" → POST `/api/vehicles`

### Bookings Page (`/dashboard/bookings`)

- Table: Car, Pickup Date, Return Date, Location, Total, Status badge, Actions
- Status badges: PENDING (yellow), CONFIRMED (green), IN_PROGRESS (blue), COMPLETED (gray), CANCELLED (red)
- "Manual Booking" button opens `<ManualBookingDialog>`

### Admin Approvals (`/dashboard/admin/approvals`)

- List of vehicles awaiting approval
- Each row: photo, name, category, owner, date submitted
- Action buttons: ✓ Approve (green) | ✗ Reject (red)

### Admin Messages (`/dashboard/admin/messages`)

- Inbox list of contact form submissions
- Columns: Name, Email, Date, Message preview, Status (Read/Unread)
- Click to expand full message

### Settings Page (`/dashboard/settings`)

- Profile section: Name, Email, Phone, Avatar upload (`<AvatarUpload>`)
- Change password: Old password, New password, Confirm
- Notifications toggle section
- Save button per section

---

## CHECKOUT PAGE (`/en/checkout`)

**Flow:** Review → Payment → Confirmation

**Sections:**
| Section | Content |
|---|---|
| Order summary | Vehicle photo, name, dates, location, price breakdown |
| Driver details | Name, Email, Phone, Driving license number, Country |
| Payment | Stripe card element (`stripe.js`) |
| Terms checkbox | "I agree to Terms & Cancellation Policy" |
| CTA | "Confirm & Pay £X" button (primary, full-width, h-14) |

---

## SEO LANDING PAGES

These pages all use the same `SEOPage` component with custom content:

| Route | Target Page |
|---|---|
| `/car-rental-kyrenia` | Kyrenia car rental |
| `/car-rental-nicosia` | Nicosia car rental |
| `/car-rental-famagusta` | Famagusta car rental |
| `/car-rental-north-cyprus` | North Cyprus overview |
| `/ercan-airport-car-rental` | Ercan Airport |
| `/luxury-car-rental-north-cyprus` | Luxury segment |
| `/cheap-car-rental-north-cyprus` | Budget segment |
| `/long-term-car-rental-north-cyprus` | Long-term rentals |
| `/self-drive-car-rental-cyprus` | Self-drive |
| `/suv-rental-north-cyprus` | SUV segment |

**Each page structure:**
- Header + Hero banner
- Location-specific text content
- Featured vehicles (VehicleCard grid)
- Google Maps embed
- FAQ section
- Footer

---

## OTHER PAGES

| Page | Route | Key Elements |
|---|---|---|
| About | `/about` | Company story, team section, stats |
| Locations | `/locations` | Map + all 4 location cards |
| How It Works | `/how-it-works` | Detailed 3-step guide |
| Fleet | `/fleet` | Full car listing with filters |
| Buy Cars | `/buy` | Cars for sale, similar to /cars |
| Blog | `/blog` | Article cards grid |
| Blog Post | `/blog/[slug]` | Full article, author, social share |
| FAQ | `/faq` | Accordion Q&A |
| Brands | `/brands` | Logo grid, links to /cars?brand=X |
| Wishlist | `/wishlist` | Saved vehicles grid |
| Chauffeur | `/chauffeur` | Premium chauffeur service page |
| Services | `/services` | Service offering cards |
| Legal pages | `/legal/terms`, `/legal/privacy`, `/legal/insurance`, `/legal/refunds`, `/legal/tourist-rules` | Text content |
| List Your Car | `/list-your-car` | Partner landing page |
| Sell Your Car | `/list-your-car/sell` | Car-sale-specific partner page |

---

## UI COMPONENT LIBRARY

All in `/src/components/ui/`:

| Component | Description | Key Props |
|---|---|---|
| `Button` | All buttons | `variant`: default/outline/ghost/destructive, `size`: sm/default/lg/icon, `isLoading` |
| `Input` | Text/email/tel/number inputs | `label`, `placeholder`, `required`, standard HTML attrs |
| `Select` | Dropdown | `value`, `onValueChange`, `<SelectItem>` children |
| `Checkbox` | Checkbox input | `checked`, `onCheckedChange` |
| `Slider` | Range slider | `min`, `max`, `step`, `value`, `onValueChange` |
| `Badge` | Status chip | `variant`: default/outline/destructive/success |
| `Dialog` | Modal overlay | `open`, `onOpenChange`, `<DialogContent>` |
| `Sheet` | Slide-in panel | `side`: left/right/top/bottom |
| `Accordion` | Expandable sections | `<AccordionItem>`, `<AccordionTrigger>`, `<AccordionContent>` |
| `Separator` | Horizontal rule | — |
| `ImageUpload` | Drag & drop multi-image | `onChange(files)`, max size, drag state |
| `AvatarUpload` | Profile photo upload | `value`, `onChange` |
| `Pagination` | Page nav | `currentPage`, `totalPages`, `onPageChange` |
| `OptimizedImage` | Next.js `<Image>` wrapper | `src`, `fill`, `quality`, `sizes` |
| `GoogleMapEmbed` | Iframe map | `lat`, `lng`, `zoom` |

---

## REDESIGN PROMPT

Use everything above to generate a redesign. The key goals are:

1. **White & light** — 90% white backgrounds. Use `#0D3B66` (deep blue) ONLY for text, logo, and the one main CTA button. Use `#00B4D8` (turquoise) ONLY for icons, underlines, and hover states.
2. **Crystal clear hero** — the Kyrenia harbour photo must be vivid and sharp, not covered by a heavy blue tint. Minimal black gradient at the bottom only.
3. **Booking widget** — white card, dark labels, visible inputs. Readable on mobile (stack vertically). The search button should be dark navy.
4. **Category cards** — crisp photo cards with a white price badge in the top corner.
5. **Consistent section rhythm** — alternate between `bg-white` and `bg-gray-50` sections. The only dark section is "Why Choose Us" (`bg-navy`).
6. **Modern typography** — large, confident headings in dark slate. Clean body text at 16px base.
7. **Mobile-first** — every section, form, and button must work perfectly at 390px width.
8. **Performance** — images use `quality={90}–{100}`, priority on hero image.
