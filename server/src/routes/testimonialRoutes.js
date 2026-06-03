import express from "express";
import {
  submitTestimonial,
  getPublicTestimonials,
  getAllPublicTestimonials,
} from "../controllers/testimonialController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/public", getPublicTestimonials);
router.get("/public/all", getAllPublicTestimonials);
router.post("/", protect, submitTestimonial);

export default router;
