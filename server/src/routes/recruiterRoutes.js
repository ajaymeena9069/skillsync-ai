// backend/src/routes/recruiterRoutes.js
import express from "express";
import { getDashboardStats } from "../controllers/recruiterController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Dashboard stats route
router.get(
  "/dashboard-stats",
  protect,
  authorize("recruiter"),
  getDashboardStats,
);

// Other routes...
export default router;
