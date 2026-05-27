// backend/src/routes/companyRoutes.js
import express from "express";
import {
  getCompanyProfile,
  updateCompanyProfile,
  uploadCompanyLogo,
  getCompanyStats,
  getPublicCompanyProfile,
} from "../controllers/companyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { uploadCompanyLogo as uploadCompanyLogoMiddleware } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Public route - accessible by any authenticated user (jobseeker or recruiter)
router.get("/public/:recruiterId", protect, getPublicCompanyProfile);

// All routes below require authentication and recruiter role
router.use(protect, authorize("recruiter"));

// Company profile routes
router.get("/profile", getCompanyProfile);
router.put("/profile", updateCompanyProfile);

// ✅ Logo upload - multer middleware first, then controller
router.post("/logo", uploadCompanyLogoMiddleware, uploadCompanyLogo);

// Dashboard stats
router.get("/stats", getCompanyStats);

export default router;
