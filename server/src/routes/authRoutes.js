import express from "express";
import {
  register,
  login,
  getMe,
  googleAuth,
  logout,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendVerificationCode);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

// TEST ROUTE - Remove after testing
router.post("/test-email", async (req, res) => {
  const { sendVerificationEmail } = await import("../services/emailService.js");
  const result = await sendVerificationEmail("amm62408@gmail.com", "Test User", "123456");
  res.json({ success: result.success, message: result.success ? "✅ Email sent! Check your Gmail inbox" : `❌ Failed: ${result.error}` });
});

export default router;
