import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import Vehicle from "./models/Vehicle.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));

// MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/vehicle_rental";

const seedVehiclesIfEmpty = async () => {
  const count = await Vehicle.estimatedDocumentCount();
  if (count > 0) {
    return;
  }

  const sampleVehicles = [
    {
      name: "Tesla Model 3 Performance",
      brand: "Tesla",
      type: "Car",
      fuelType: "Electric",
      mileageKmPerLitre: 0,
      pricePerDay: 6500,
      availability: true,
      image:
        "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=1200",
      ownerName: "City EV Rentals",
      location: "Downtown Hub",
    },
    {
      name: "Hyundai Creta SX",
      brand: "Hyundai",
      type: "Car",
      fuelType: "Diesel",
      mileageKmPerLitre: 18,
      pricePerDay: 3200,
      availability: true,
      image:
        "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200",
      ownerName: "Smart Rentals Fleet",
      location: "Airport Desk",
    },
    {
      name: "Royal Enfield Classic 350",
      brand: "Royal Enfield",
      type: "Bike",
      fuelType: "Petrol",
      mileageKmPerLitre: 32,
      pricePerDay: 1200,
      availability: true,
      image:
        "https://images.pexels.com/photos/1464144/pexels-photo-1464144.jpeg?auto=compress&cs=tinysrgb&w=1200",
      ownerName: "City Riders",
      location: "Old Town Stand",
    },
    {
      name: "Honda Activa 6G",
      brand: "Honda",
      type: "Scooter",
      fuelType: "Petrol",
      mileageKmPerLitre: 45,
      pricePerDay: 800,
      availability: true,
      image:
        "https://images.pexels.com/photos/980000/pexels-photo-980000.jpeg?auto=compress&cs=tinysrgb&w=1200",
      ownerName: "City Riders",
      location: "Metro Station",
    },
  ];

  await Vehicle.insertMany(sampleVehicles);
  console.log("Seeded sample vehicles");
};

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await seedVehiclesIfEmpty();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Smart Vehicle Rental API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

