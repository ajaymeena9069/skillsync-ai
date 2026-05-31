// backend/src/routes/recruiterRoutes.js
import express from "express";
import { getDashboardStats, recordProfileView, getAnalytics } from "../controllers/recruiterController.js";
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

// Record profile view route
router.post(
  "/candidate/:candidateId/view",
  protect,
  authorize("recruiter"),
  recordProfileView,
);

// Analytics route
router.get(
  "/analytics",
  protect,
  authorize("recruiter"),
  getAnalytics,
);

// Other routes...
export default router;
