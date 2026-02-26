import express from "express";
import { body } from "express-validator";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  markBookingPaid,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  [
    body("vehicleId").notEmpty().withMessage("Vehicle is required"),
    body("startDate").notEmpty().withMessage("Start date is required"),
    body("endDate").notEmpty().withMessage("End date is required"),
  ],
  createBooking
);

router.get("/me", protect, getMyBookings);
router.put("/:id/cancel", protect, cancelBooking);
router.put("/:id/paid", protect, markBookingPaid);

export default router;

