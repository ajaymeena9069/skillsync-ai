// server/src/routes/jobRoutes.js
import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js"; // 👈 Import role middleware
import { validate } from "../middleware/validate.middleware.js";
import { JobSchema } from "../schemas/job.schema.js";
import { getMyJobs } from "../controllers/recruiterController.js";

const router = express.Router();

// ========== PUBLIC ROUTES (No authentication needed) ==========
router.get("/", getJobs);
router.get("/:id", optionalAuth, getJobById);

// ========== PROTECTED ROUTES (Authentication required) ==========

// Recruiter only routes
router.post(
  "/",
  protect,
  authorize("recruiter"),
  validate(JobSchema),
  createJob,
);
router.get("/recruiter/my-jobs", protect, authorize("recruiter"), getMyJobs);
router.put(
  "/:id",
  protect,
  authorize("recruiter"),
  validate(JobSchema),
  updateJob,
);
router.delete("/:id", protect, authorize("recruiter"), deleteJob);

// Job seeker only routes
// router.post("/:id/apply", protect, authorize("jobseeker"), applyForJob);
// router.get("/my-applications", protect, authorize("jobseeker"), getMyApplications);

// Both recruiter and job seeker can access (if needed)
// router.get('/stats', protect, authorize('user', 'recruiter'), getJobStats);

export default router;
