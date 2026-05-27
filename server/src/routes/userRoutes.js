// backend/src/routes/userRoutes.js
import express from "express";
import {
  getProfile,
  updateProfile,
  updateSkills,
  uploadAvatar,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadAvatar as uploadAvatarMiddleware } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/skills", updateSkills);
router.post("/avatar", uploadAvatarMiddleware, uploadAvatar);

export default router;
