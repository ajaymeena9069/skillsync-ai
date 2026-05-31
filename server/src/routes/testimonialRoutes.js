import express from "express";
import {
  submitTestimonial,
  getPublicTestimonials,
} from "../controllers/testimonialController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/public", getPublicTestimonials);
router.post("/", protect, submitTestimonial);

export default router;
