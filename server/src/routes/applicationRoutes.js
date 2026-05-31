import express from "express";
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationById,
  checkApplicationStatus,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  applyJobSchema,
  updateStatusSchema,
} from "../schemas/application.schema.js";

const router = express.Router();

// Check application status for a job (must be BEFORE /:applicationId to avoid conflict)
router.get("/check/:jobId", protect, checkApplicationStatus);

// Job seeker routes
router.post("/apply", protect, authorize("jobseeker"), validate(applyJobSchema), applyForJob);
router.get("/my-applications", protect, authorize("jobseeker"), getMyApplications);
router.get("/:applicationId", protect, getApplicationById);
router.delete("/:applicationId", protect, authorize("jobseeker"), withdrawApplication);

// Recruiter routes
router.get("/job/:jobId", protect, authorize("recruiter"), getJobApplications);
router.put(
  "/:applicationId/status",
  protect,
  authorize("recruiter"),
  validate(updateStatusSchema),
  updateApplicationStatus,
);
// Add this line (make sure it's BEFORE the /job/:jobId route to avoid conflicts)

export default router;
