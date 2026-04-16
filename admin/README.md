# Admin Dashboard

This is the internal admin SPA for catalog and order operations.

## Implemented Features

- Product listing with search/category filters
- Add product form
- Edit existing product
- Delete product (blocked if order history exists)
- Order listing and detail view
- Order status and payment status updates
- Basic dashboard stats (products, orders, low stock, active orders)

## How It Is Implemented

Core implementation is in admin/src/App.tsx.

- A single-page tabbed dashboard drives products, add/edit form, and orders.
- API integration is done through a typed request helper using VITE_API_URL.
- Product specifications are entered as multiline key:value text and parsed into an object payload.
- Product image URLs are managed as an ordered array and sent as imageKeys.

## Backend Endpoints Used

- GET /api/admin/products
- POST /api/admin/products
- PUT /api/admin/products/:id
- DELETE /api/admin/products/:id
- GET /api/admin/orders
- GET /api/admin/orders/:id
- PATCH /api/admin/orders/:id/status

## Environment Variables

Create admin/.env with:

```env
VITE_API_URL=http://localhost:4000/api
```

## Run Locally

```bash
cd admin
npm install
npm run dev
```

Default URL: http://localhost:5174 (or next free Vite port).

## Build

```bash
npm run build
npm run preview
```

Build uses TypeScript project references:

- tsc -b
- vite build

## Current Security Note

Admin backend endpoints are currently not protected by separate admin authentication middleware.
