import express from "express";
import { body } from "express-validator";
import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicles,
  getVehicleById,
} from "../controllers/vehicleController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getVehicles);
router.get("/:id", getVehicleById);

router.post(
  "/",
  protect,
  admin,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("brand").notEmpty().withMessage("Brand is required"),
    body("type").notEmpty().withMessage("Type is required"),
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
    body("pricePerDay").optional().isNumeric(),
  ],
  updateVehicle
);

router.delete("/:id", protect, admin, deleteVehicle);

export default router;

