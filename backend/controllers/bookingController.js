import { validationResult } from "express-validator";
import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";

const calculateTotalPrice = (startDate, endDate, pricePerDay) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays =
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / oneDay
    ) + 1;
  return diffDays * pricePerDay;
};

export const createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { vehicleId, startDate, endDate } = req.body;

  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Basic availability check (no overlapping confirmed bookings)
    const overlapping = await Booking.findOne({
      vehicle: vehicleId,
      status: "confirmed",
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    if (overlapping) {
      return res
        .status(400)
        .json({ message: "Vehicle not available for selected dates" });
    }

    const totalPrice = calculateTotalPrice(
      startDate,
      endDate,
      vehicle.pricePerDay
    );

    const booking = await Booking.create({
      user: req.user._id,
      vehicle: vehicleId,
      startDate,
      endDate,
      totalPrice,
      paymentStatus: "pending",
    });

    // Here you would integrate Razorpay/Stripe and return payment info

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("vehicle")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markBookingPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "paid";
    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

