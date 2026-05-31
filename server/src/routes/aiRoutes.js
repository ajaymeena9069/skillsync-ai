// backend/src/routes/aiRoutes.js
import express from "express";
import {
  getSkillGapAnalysis,
  getSkillGapForJob,
  getLearningRoadmap,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get overall skill gap analysis (compared to all active jobs)
router.get("/skill-gap", authorize("jobseeker"), getSkillGapAnalysis);

// Get skill gap analysis for a specific job
router.post("/skill-gap", authorize("jobseeker"), getSkillGapForJob);

// Generate personalized learning roadmap
router.post("/roadmap", authorize("jobseeker"), getLearningRoadmap);

export default router;
