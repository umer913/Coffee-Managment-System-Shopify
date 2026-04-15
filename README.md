# Coffee-Managment-System-Shopify

A Shopify-style Coffee Management System built with a modern split stack:

- **Frontend**: React + Vite admin dashboard
- **Backend**: Node.js + Express REST API

## Features

- Admin authentication (login/logout)
- Dashboard tabs for:
  - Coffee products
  - Orders
  - Customers
  - Inventory
- CRUD operations for all resources
- Clean, responsive admin UI
- Frontend/backend project separation

## Project Structure

- `/frontend` - React admin dashboard
- `/backend` - Node.js API

## Local Setup

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:4000` by default.

Default credentials:

- username: `admin`
- password: `admin123`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and connects to `http://localhost:4000`.

Optionally set `VITE_API_BASE_URL` in the frontend environment.
