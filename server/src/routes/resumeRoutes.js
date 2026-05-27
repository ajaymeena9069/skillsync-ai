// backend/src/routes/resumeRoutes.js
import express from "express";
import {
  uploadResume,
  getResumeData,
  deleteResume,
  getResumeFile,
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadResume as uploadResumeMiddleware } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post("/upload", uploadResumeMiddleware, uploadResume);
router.get("/my-resume", getResumeData);
router.get("/file", getResumeFile);
router.delete("/delete", deleteResume);

export default router;
