## Smart Vehicle Rental System (MERN)

This is a **Smart Vehicle Rental System** built with the MERN stack. It allows users to browse vehicles, make bookings, and manage rentals, while admins can manage vehicles, users, and view analytics.

### Features
- **Authentication**: JWT-based login/register with role-based access (`user`, `admin`)
- **Vehicle Management**: CRUD operations for vehicles (admin)
- **Booking System**: Date-based bookings, total price calculation, basic availability checks
- **Payment-ready**: Clean API hooks and frontend flow to plug in Razorpay/Stripe
- **Admin Dashboard**: Manage users, vehicles, and bookings

### Tech Stack
- **Frontend**: React (Vite), Context API, Axios, Tailwind-ready styling
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcrypt
- **Database**: MongoDB (MongoDB Atlas recommended)

### Folder Structure
- `backend/` – Express API, models, controllers, routes, middleware
- `frontend/` – React app with pages, components, and contexts

### Getting Started

1. **Backend**
   - Go to `backend/`
   - Create a `.env` file based on `.env.example`
   - Install dependencies:
     - `npm install`
   - Run:
     - `npm run dev`

2. **Frontend**
   - Go to `frontend/`
   - Install dependencies:
     - `npm install`
   - Run:
     - `npm run dev`

Configure the backend URL inside the frontend `.env` or Axios instance (e.g. `VITE_API_BASE_URL`).

