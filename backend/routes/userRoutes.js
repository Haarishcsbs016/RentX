import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put(
  "/profile",
  protect,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  updateProfile
);

export default router;

