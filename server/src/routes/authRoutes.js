// server/src/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  googleAuth,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "../schemas/auth.schema.js";

const router = express.Router();

// Public routes with validation
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google", googleAuth); // Google OAuth has its own validation
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  resendVerificationCode,
);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

// Protected routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;
