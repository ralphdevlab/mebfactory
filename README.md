# MebFactory — Fashion E-Commerce Platform

> 🚧 **Active Build** — This project is currently in development using an agile methodology, updated iteratively based on client feedback.

## Live Site
🔗 [mebfactory.vercel.app](https://mebfactory.vercel.app)

## Build Status
| Sprint | Status | Focus |
|--------|--------|-------|
| Sprint 1 | ✅ Complete | Frontend scaffold, homepage, shop, cart, Vercel deploy |
| Sprint 2 | ✅ Complete | Backend API, PostgreSQL, JWT auth, persistent cart & wishlist |
| Sprint 3 | ✅ Complete | Stripe payments, emails, search, admin panel, empty states |
| Sprint 4 | 🔄 In Progress | Bershka-inspired layout, image uploads, seasonal themes |

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router v7
- Stripe.js

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL (Railway)
- JWT Authentication
- Stripe API
- Resend (transactional email)

### Infrastructure
- Frontend: Vercel (auto-deploy on push)
- Backend: Railway (auto-deploy on push)
- Database: PostgreSQL on Railway
- Media: Cloudinary

## Features
- 🛍️ Full product catalog with category filtering and search
- 🛒 Persistent cart and wishlist (guest + authenticated)
- 🔐 JWT authentication — register, login, account management
- 💳 Stripe checkout with webhook order confirmation
- 📦 Order history in user account
- 🎨 Admin panel — manage products, orders, customers, seasonal themes
- 🖼️ Cloudinary image upload via admin panel
- 📱 Mobile responsive with drawer navigation
- 🎃 Seasonal theme system — switch site palette for events
- ⚡ Auto-deploy CI/CD — push to GitHub triggers Vercel + Railway redeploy

## Project Structure

mebfactory/
├── src/ # React frontend
│ ├── components/ # Reusable UI components
│ ├── pages/ # Route-level pages
│ ├── context/ # Cart, Auth, Wishlist state
│ └── lib/ # API client, auth helpers
├── backend/ # Express API
│ ├── src/
│ │ ├── routes/ # API route handlers
│ │ ├── middleware/ # JWT auth middleware
│ │ └── lib/ # Prisma client, email, Cloudinary
│ └── prisma/ # Database schema
└── public/ # Static assets


## Local Development

### Prerequisites
- Node.js v22+
- PostgreSQL database

### Frontend
```bash
npm install
npm run dev
# Runs at http://localhost:5173
```

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
# Runs at http://localhost:4000
```

### Environment Variables

**Frontend `.env`:**

VITE_API_URL=http://localhost:4000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_ADMIN_EMAIL=your@email.com


**Backend `.env`:**

DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
PORT=4000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ADMIN_EMAIL=your@email.com


## Agile Process
This project is built iteratively using agile methodology:
- Each sprint delivers a fully working, deployed increment
- Features are prioritized based on direct client feedback
- Every push auto-deploys to production — no manual steps
- Build log available at [mebfactory.vercel.app/changelog](https://mebfactory.vercel.app/changelog)

## Deployment
Push to `main` branch triggers automatic deployment:
- **Vercel** rebuilds and deploys the frontend
- **Railway** rebuilds and deploys the backend

No manual steps required after initial setup.

---

Built by [Ralph Alexandre](https://github.com/ralphdevlab)
