# Flipkart Clone - Fullstack Commerce Application

This repository contains a multi-app Flipkart-style commerce system with:

- customer storefront (frontend)
- admin dashboard (admin)
- REST API with PostgreSQL (backend)

## Tech Stack

- Frontend: React 19 + Vite + React Router
- Admin: React 19 + TypeScript + Vite
- Backend: Node.js + Express + pg + JWT
- Database: PostgreSQL
- External catalog source: DummyJSON products API

## What Is Implemented

### Customer App

- Product browsing, search, and category filtering
- Product details with image gallery, pricing, stock, and specs
- Register/login/logout with JWT-backed session
- Auth-protected cart and order history pages
- Cart add/update/remove with live summary totals
- Checkout summary, payment simulation, order creation, and order confirmation

How it is implemented:

- App-wide auth/cart UI state is centralized via React Context in frontend/src/context/AppContext.jsx.
- Frontend product listing and detail data are fetched from DummyJSON through frontend/src/lib/apiClient.js.
- Cart, checkout, and orders are persisted through backend APIs.

### Backend API

- Auth routes: register, login, logout (JWT + password hashing)
- Cart routes: add/update/remove/list cart items with stock checks
- Checkout and order routes: summary, place order, list/fetch orders
- Admin routes for products and orders (CRUD + status updates)

How it is implemented:

- Passwords are hashed with Node crypto scrypt.
- Auth uses Bearer JWT tokens with issuer/audience checks.
- On cart/checkout access, backend can sync product records from EXTERNAL_PRODUCTS_API into local Postgres tables to keep cart/order data consistent.
- Database bootstrap runs during backend startup before app.listen, so required schema is created on first run.

### Admin App

- Product management (list, create, update, delete)
- Order management (list, details, update order/payment statuses)
- Dashboard counters for total products/orders and low stock

How it is implemented:

- Admin UI calls dedicated backend admin endpoints from admin/src/App.tsx.
- Product form supports image URL list and key:value specification parsing.

## Repository Structure

- frontend: customer SPA
- admin: internal admin SPA
- backend: API server, DB schema, and migration/setup scripts

## Environment Variables

Backend environment file: backend/.env

- PORT
- FRONTEND_ORIGIN
- ALLOWED_ORIGINS
- DATABASE_URL (optional, takes precedence over PG\* vars)
- PGHOST
- PGPORT
- PGUSER
- PGPASSWORD
- PGDATABASE
- JWT_SECRET
- JWT_EXPIRES_IN
- PAYMENT_CURRENCY
- EXTERNAL_PRODUCTS_API

Frontend environment file: frontend/.env

- VITE_API_URL (example: http://localhost:4000/api)
- VITE_PRODUCTS_API_URL (optional, defaults to https://dummyjson.com)

Admin environment file: admin/.env

- VITE_API_URL (example: http://localhost:4000/api)

## Local Development

1. Start PostgreSQL and create database flipkart_clone.
2. Configure backend/.env.
3. Install and start backend.

```bash
cd backend
npm install
npm run dev
```

4. Install and start frontend.

```bash
cd frontend
npm install
npm run dev
```

5. Install and start admin.

```bash
cd admin
npm install
npm run dev
```

Default local ports:

- backend: 4000
- frontend: 5173
- admin: 5174 (or next available Vite port)

## Build Commands

- frontend: npm run build
- admin: npm run build
- backend: npm start

## Deployment Notes

- Frontend/Admin can be deployed to Vercel as static Vite apps.
- Backend can be deployed to Render as a Node web service.
- On Render, set DATABASE_URL to your Postgres instance and verify startup logs show database bootstrap completed.

## Key API Groups

Public:

- GET /api/health

Auth:

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

Storefront:

- GET /api/categories
- GET /api/products
- GET /api/products/:id

Authenticated cart/checkout/order:

- GET /api/cart
- POST /api/cart/items
- PATCH /api/cart/items/:itemId
- DELETE /api/cart/items/:itemId
- GET /api/checkout/summary
- POST /api/orders
- POST /api/payments
- GET /api/orders
- GET /api/orders/:id

Admin:

- GET /api/admin/products
- POST /api/admin/products
- PUT /api/admin/products/:id
- DELETE /api/admin/products/:id
- GET /api/admin/orders
- GET /api/admin/orders/:id
- PATCH /api/admin/orders/:id/status

## Current Notes

- Admin endpoints are currently open (no separate admin auth middleware yet).
- Payment providers are simulated through backend service logic, not external gateways.
