# Frontend (Customer App)

This is the customer-facing Flipkart-style SPA built with React + Vite.

## Implemented Features

- Home, search, and product-detail browsing flow
- Auth flows (register/login/logout)
- Auth-protected cart and orders pages
- Cart quantity updates, remove item, and totals summary
- Checkout flow with payment selection and order confirmation

## How It Is Implemented

### Routing

Defined in frontend/src/routes/AppRoutes.jsx:

- /
- /search
- /products/:id
- /cart (protected)
- /orders (protected)
- /place-order
- /payment
- /order-confirmation/:orderId

### Global App State

Implemented with React Context in frontend/src/context/AppContext.jsx:

- authUser and isAuthenticated
- cartCount snapshot + subscriptions
- login, register, logout actions

### Data Sources

Implemented in frontend/src/lib/apiClient.js:

- Product catalog: DummyJSON
  - /products
  - /products/search
  - /products/category/:slug
  - /products/:id
- User/cart/order: backend API
  - /auth/\*
  - /cart/\*
  - /checkout/summary
  - /orders and /payments

The client maps DummyJSON payloads into UI-friendly product objects (price normalization, badge derivation, image list normalization, and spec mapping).

## Environment Variables

Create frontend/.env with:

```env
VITE_API_URL=http://localhost:4000/api
VITE_PRODUCTS_API_URL=https://dummyjson.com
```

VITE_PRODUCTS_API_URL is optional and defaults to DummyJSON.

## Run Locally

```bash
cd frontend
npm install
npm run dev
```

Default URL: http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Deployment

- Deploy as a Vite static app (for example on Vercel).
- Set VITE_API_URL to your deployed backend API base URL, including /api.
