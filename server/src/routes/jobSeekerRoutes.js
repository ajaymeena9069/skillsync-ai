// backend/src/routes/jobSeekerRoutes.js
import express from "express";
import {
  getProfile,
  updateProfile,
  uploadResume,
  getResume,
  getMyApplications,
  getApplicationStats,
} from "../controllers/jobSeekerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowJobSeeker } from "../middleware/roleMiddleware.js";
import {
  uploadResume as uploadResumeMiddleware,
  uploadAvatar,
} from "../middleware/uploadMiddleware.js";
import { uploadAvatar as uploadAvatarController } from "../controllers/commonController.js";

const router = express.Router();

router.use(protect, allowJobSeeker);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/avatar", uploadAvatar, uploadAvatarController);
router.post("/resume", uploadResumeMiddleware, uploadResume);
router.get("/resume", getResume);
router.get("/applications", getMyApplications);
router.get("/applications/stats", getApplicationStats);

export default router;
