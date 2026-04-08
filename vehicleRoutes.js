import express from "express";
import { body } from "express-validator";
import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicles,
  getVehicleById,
  addVehicleReview,
} from "../controllers/vehicleController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.post(
  "/:id/reviews",
  protect,
  [
    body("rating")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .trim()
      .isLength({ min: 6, max: 600 })
      .withMessage("Comment must be between 6 and 600 characters"),
  ],
  addVehicleReview
);

router.post(
  "/",
  protect,
  admin,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("brand").notEmpty().withMessage("Brand is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("year").optional().isInt({ min: 2000 }),
    body("seats").optional().isInt({ min: 1 }),
    body("pricePerDay")
      .isNumeric()
      .withMessage("Price per day must be a number"),
  ],
  createVehicle
);

router.put(
  "/:id",
  protect,
  admin,
  [
    body("name").optional().notEmpty(),
    body("brand").optional().notEmpty(),
    body("type").optional().notEmpty(),
    body("year").optional().isInt({ min: 2000 }),
    body("seats").optional().isInt({ min: 1 }),
    body("pricePerDay").optional().isNumeric(),
  ],
  updateVehicle
);

router.delete("/:id", protect, admin, deleteVehicle);

export default router;

