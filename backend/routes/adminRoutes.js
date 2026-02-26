import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getAllBookings,
  getRevenueStats,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, admin);

router.get("/users", getAllUsers);
router.get("/bookings", getAllBookings);
router.get("/revenue", getRevenueStats);

export default router;

