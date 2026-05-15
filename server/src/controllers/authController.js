import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  generateVerificationCode,
} from "../services/emailService.js";

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token for authenticated users
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ==================== USER REGISTRATION ====================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    // FIX 1: Hash password FIRST before using it
    const hashedPassword = await argon2.hash(password);

    // Generate 6-digit verification code (expires in 10 minutes)
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    // FIX 2: Create user ONLY ONCE with all required fields
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      isEmailVerified: false,
      verificationCode,
      verificationCodeExpires,
    });

    // Send verification email (using Brevo API - works on Render)
    const emailResult = await sendVerificationEmail(
      email,
      name,
      verificationCode,
    );

    // Check if email was sent successfully
    if (!emailResult.success) {
      // Email failed - user created but can't verify
      console.error("Verification email failed:", emailResult.error);
      return res.status(201).json({
        message:
          "Account created but verification email failed. Please use 'Resend Code' option.",
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          requiresVerification: true,
        },
      });
    }

    // Success - don't send token yet, user must verify email first
    res.status(201).json({
      message:
        "Registration successful! Please verify your email with the code sent to your inbox.",
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        requiresVerification: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: `Server error: ${error.message}`,
      success: false,
    });
  }
};

// ==================== EMAIL VERIFICATION ====================
export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Already verified?
    if (user.isEmailVerified) {
      const token = generateToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        message: "Email already verified. Welcome back!",
        token,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // Check verification code
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    // Check if code expired
    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    // Mark email as verified and clear verification data
    user.isEmailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    // Generate token for auto-login
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You are now logged in.",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Verification failed: ${error.message}`,
    });
  }
};

// ==================== RESEND VERIFICATION CODE ====================
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Already verified?
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified. You can login.",
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send new verification email
    const emailResult = await sendVerificationEmail(
      user.email,
      user.name,
      verificationCode,
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "New verification code sent to your email. Valid for 10 minutes.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to resend code: ${error.message}`,
    });
  }
};

// ==================== USER LOGIN ====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Check if email is verified (for email/password users)
    if (!user.isEmailVerified && user.password) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        success: false,
        requiresVerification: true,
        email: user.email,
      });
    }

    // Check if this is a Google-only user
    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google login. Please sign in with Google.",
        success: false,
      });
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Generate token and send response
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "Login successful",
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        skills: user.skills,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: `Server error: ${error.message}`,
      success: false,
    });
  }
};

// ==================== FORGOT PASSWORD ====================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    // Don't reveal if email exists (security)
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with that email, you will receive a password reset link.",
      });
    }

    // Check if Google user
    if (user.isGoogleUser && !user.password) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google Sign-In. Please use 'Continue with Google'.",
      });
    }

    // Generate reset token (crypto for security)
    const crypto = await import("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email
    const emailResult = await sendPasswordResetEmail(
      user.email,
      user.name,
      resetToken,
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email. Valid for 1 hour.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to send reset email: ${error.message}`,
    });
  }
};

// ==================== RESET PASSWORD ====================
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Find user by reset token (not expired)
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token. Please request a new one.",
      });
    }

    // Hash new password
    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successful! You can now login with your new password.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Password reset failed: ${error.message}`,
    });
  }
};

// ==================== GET CURRENT USER ====================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GOOGLE AUTHENTICATION ====================
export const googleAuth = async (req, res) => {
  try {
    // Log what we received for debugging
    console.log("Google Auth Request Body:", Object.keys(req.body));

    const { idToken, role } = req.body;

    if (!idToken) {
      console.error("No idToken received. Body:", req.body);
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    console.log("Verifying Google token...");

    // Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    console.log("Google user verified:", { email, name });

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not provided by Google",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      // Existing user - link Google account if not already
      if (!user.googleId) {
        user.googleId = googleId;
        user.isGoogleUser = true;
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
      }

      const token = generateToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || picture,
        },
        token,
      });
    }

    // New user - need role selection first
    if (!role) {
      return res.status(200).json({
        success: true,
        requiresRole: true,
        tempData: { email, name, googleId, avatar: picture },
        message: "Please select your role to continue",
      });
    }

    // Validate role
    if (!["user", "recruiter"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    // Create new Google user
    user = await User.create({
      name,
      email,
      googleId,
      role,
      isGoogleUser: true,
      isEmailVerified: true,
      avatar: picture || "",
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("Google Auth Error:", error.message);
    console.error("Full error:", error);

    if (
      error.message?.includes("Invalid token") ||
      error.message?.includes("Wrong number of segments")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token. Please try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: `Google authentication failed: ${error.message}`,
    });
  }
};

// ==================== LOGOUT ====================
export const logout = async (req, res) => {
  // For stateless JWT, logout is handled on frontend by removing token
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
