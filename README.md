# ⚡ ElectroMob — Next-Gen Smartphone Store

A full-featured, modern e-commerce web application for smartphones and mobile devices built with **React 19**, **Vite**, **React Router DOM v7**, and **Axios**.

Deployment Link : https://mobilestore-nine.vercel.app/

---

## 🌟 Key Features

- **📱 Smart Phone Catalog (`/mobiles`)**:
  - Live search across device names, processors, and descriptions.
  - Multi-criteria filtering by Brand (Apple, Samsung, Google, OnePlus, Xiaomi, Nothing, etc.), Price Range slider, RAM capacity, 5G status, and Stock availability.
  - Multiple sorting modes: Featured, Price (Low to High / High to Low), Top Rating, and Name (A-Z).
- **🔍 Rich Product Details (`/mobiles/:id`)**:
  - High-res product photography and dynamic color variant selector.
  - Comprehensive technical specifications table (Display, Processor, Cameras, Battery & Charging, OS, 5G).
  - Verified customer reviews list with an interactive "Write a Review" form.
  - Related & recommended devices carousel.
- **➕ Create & Update Mobiles (`/add-mobile`, `/edit-mobile/:id`)**:
  - Complete form with live preview card before publishing.
  - Full CRUD operations against mock REST backend or local cache.
- **🛒 Shopping Cart & Interactive Checkout (`/cart`)**:
  - Quantity controls, color selection, item removal, and subtotal breakdown.
  - Coupon discount system (`SAVE10` for 10% off, `ELECTRO5000` for ₹5,000 off).
  - 18% GST calculation and Free Shipping for orders > ₹10,000.
  - Simulated checkout with delivery address and instant order confirmation ID.
- **⇄ Side-by-Side Mobile Comparison (`/compare`)**:
  - Compare up to 4 smartphones across all hardware specs, prices, and ratings in a clean tabular view.
- **🔔 Toast Notification System**:
  - Floating alerts for cart actions, wishlist/compare toggles, product additions, edits, and deletions.
- **🛡️ Resilient Dual-Mode API**:
  - Connects to `json-server` (`http://localhost:3000`) if running.
  - Seamlessly falls back to an offline-first `localStorage` cache pre-seeded with `db.json` when `json-server` is not running.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Frontend Development Server
```bash
npm run dev
```
Open your browser at [http://localhost:5173](http://localhost:5173).

### 3. (Optional) Run Mock REST API Server
```bash
npm run server
```
Runs `json-server` on [http://localhost:3000](http://localhost:3000) watching `db.json`.

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
Mobile_Store/
├── db.json                      # Seeded smartphone mock database
├── index.html                   # HTML template with Google Fonts (Outfit & Plus Jakarta Sans)
├── package.json                 # Scripts and dependencies
├── src/
│   ├── App.jsx                  # Main application frame (Navbar + Routes + Footer + Toast)
│   ├── main.jsx                 # Context Providers & BrowserRouter setup
│   ├── index.css                # Global modern styling & animations
│   ├── components/
│   │   ├── Navbar.jsx           # Sticky glassmorphism header with search & badges
│   │   ├── Footer.jsx           # Perks, brand links, newsletter & policies
│   │   ├── MobileCard.jsx       # Reusable smartphone product card
│   │   └── Toast.jsx            # Floating notification alerts
│   ├── context/
│   │   ├── CartContext.jsx      # Global cart state, coupons & pricing math
│   │   ├── CompareContext.jsx   # Side-by-side comparison state
│   │   └── ToastContext.jsx     # Global toast notification trigger
│   ├── pages/
│   │   ├── Home.jsx             # Hero banner, brands grid, featured flagships & deals
│   │   ├── Mobiles.jsx          # Filterable catalog with search & delete confirmation
│   │   ├── MobileDetails.jsx    # Full specs sheet, color picker, reviews & related devices
│   │   ├── AddMobile.jsx        # Device addition form with live preview
│   │   ├── EditMobile.jsx       # Device spec editor
│   │   ├── Cart.jsx             # Shopping cart, coupon discounts & checkout modal
│   │   └── Compare.jsx          # Side-by-side phone comparison table
│   ├── routes/
│   │   └── AppRoutes.jsx        # Route definitions
│   └── services/
│       └── api.js               # Axios client with fallback cache
└── vite.config.js               # Vite configuration
```
