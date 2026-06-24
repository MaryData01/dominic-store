# Dominic Store

Dominic Store is a premium dark-themed gaming peripherals e-commerce platform built for gamers, setup enthusiasts, and streamers.

## Project Structure

This is a full-stack monorepo:
- `client/` - React 18 frontend built with Vite, Tailwind CSS v3, and Framer Motion.
- `server/` - Node.js backend built with Express 5, MongoDB, and integrated with Paystack and Cloudinary.

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas (or local MongoDB)
- Cloudinary Account (for image uploads)
- Paystack Account (for payments)
- OpenAI API Key (or compatible, for the AI Assistant)

## Environment Setup

1. Copy the `.env.example` file in the root to `.env` and fill in the values.
2. Copy the `.env.example` file in the `server/` directory to `.env` and fill in the values.

## Installation & Running Locally

### Backend (Server)

```bash
cd server
npm install
npm run dev
```

### Frontend (Client)

```bash
cd client
npm install
npm run dev
```

### Seeding the Database

To insert sample products and create the default admin account:
```bash
cd server
npm run seed
```

## Admin Access
Default admin credentials after seeding:
- Email: `admin@dominicstore.com`
- Password: `Admin1234!`

## Deployment Notes
- **Server:** Can be deployed to Render, Railway, or Heroku. Make sure to set all environment variables.
- **Client:** Can be deployed to Vercel or Netlify. Set `VITE_API_BASE_URL` to your production server URL.
- **Database:** MongoDB Atlas is recommended.
