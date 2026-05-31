// backend/src/controllers/authController.js
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

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const formatUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    currentRole:
      user.currentRole ||
      (user.role === "recruiter" ? "Recruiter" : "Job Seeker"),
    avatar: user.avatar || "",
    phone: user.phone || "",
    location: user.location || "",
    experience: user.experience || "",
    bio: user.bio || "",
    skills: user.skills || [],
    resumeUrl: user.resumeUrl || "",
    parsedResume: user.parsedResume || null,
    isEmailVerified: user.isEmailVerified,
    isProfileComplete: user.isProfileComplete || false,
    isCompanyComplete: user.isCompanyComplete || false,
    profileViews: user.profileViews || 0,
    company: user.company || {
      name: "",
      logo: "",
      logoPublicId: "",
      email: "",
      phone: "",
      website: "",
      location: "",
      founded: "",
      size: "",
      industry: "",
      description: "",
      mission: "",
      vision: "",
      socialLinks: { linkedin: "", twitter: "", github: "" },
      benefits: [],
      culture: "",
    },
  };
};

const getRedirectUrl = (user) => {
  if (user.role === "recruiter" && !user.isCompanyComplete) {
    return "/app/company";
  }
  if (user.role === "jobseeker" && !user.isProfileComplete) {
    return "/app/profile";
  }
  return "/app/dashboard";
};

// ==================== REGISTER ====================
export const register = async (req, res) => {
  try {
    const { name, email, password, role = "jobseeker" } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await argon2.hash(password);
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      currentRole: role === "recruiter" ? "Recruiter" : "Job Seeker",
      isEmailVerified: false,
      verificationCode,
      verificationCodeExpires,
      isProfileComplete: false,
      isCompanyComplete: false,
      isGoogleUser: false,
    });

    await sendVerificationEmail(email, name, verificationCode).catch((err) =>
      console.error("Email send failed:", err),
    );

    res.status(201).json({
      success: true,
      message: "Registration successful! Please verify your email.",
      user: formatUserResponse(user),
      requiresVerification: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: `Registration failed: ${error.message}`,
      });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (user.isGoogleUser && !user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google login. Please sign in with Google.",
        provider: "google",
      });
    }

    if (!user.isEmailVerified && user.password) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
        requiresVerification: true,
        email: user.email,
      });
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: formatUserResponse(user),
      token,
      redirectUrl: getRedirectUrl(user),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Login failed: ${error.message}` });
  }
};

// ==================== GOOGLE AUTH ====================
export const googleAuth = async (req, res) => {
  try {
    const { credential, role } = req.body;

    console.log("Google auth request received:", {
      hasCredential: !!credential,
      role,
    });

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify the credential
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
      console.log("✅ Google credential verified for:", payload.email);
    } catch (verifyError) {
      console.error("❌ Credential verification failed:", verifyError.message);
      return res.status(400).json({
        success: false,
        message: "Invalid Google credential",
      });
    }

    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Existing user with email/password
      if (user.password && !user.isGoogleUser) {
        return res.status(409).json({
          success: false,
          message:
            "This email is registered with password. Please login with email instead.",
          provider: "email",
        });
      }

      // Update existing Google user
      if (!user.googleId) {
        user.googleId = googleId;
        user.isGoogleUser = true;
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
        console.log("✅ Existing user updated with Google ID");
      }

      const token = generateToken(user._id, user.role);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: formatUserResponse(user),
        token,
        redirectUrl: getRedirectUrl(user),
      });
    }

    // New user - check if role is provided
    if (!role) {
      console.log("⚠️ New user, role selection required");
      return res.status(200).json({
        success: true,
        requiresRole: true,
        tempData: { email, name, googleId, avatar: picture || "" },
        message: "Please select your role to continue",
      });
    }

    // Create new Google user
    console.log("✅ Creating new Google user with role:", role);
    user = await User.create({
      name: name || email.split("@")[0],
      email,
      googleId,
      role,
      currentRole: role === "recruiter" ? "Recruiter" : "Job Seeker",
      isGoogleUser: true,
      isEmailVerified: true,
      avatar: picture || "",
      isProfileComplete: false,
      isCompanyComplete: false,
      password: null,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: formatUserResponse(user),
      token,
      redirectUrl: getRedirectUrl(user),
    });
  } catch (error) {
    console.error("❌ Google Auth Error:", error);
    res.status(500).json({
      success: false,
      message: `Google authentication failed: ${error.message}`,
    });
  }
};

// ==================== VERIFY EMAIL ====================
export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isEmailVerified) {
      const token = generateToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        message: "Email already verified",
        user: formatUserResponse(user),
        token,
        redirectUrl: getRedirectUrl(user),
      });
    }

    if (user.verificationCode !== verificationCode) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    user.isEmailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    await sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error("Welcome email failed:", err),
    );

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      user: formatUserResponse(user),
      token,
      redirectUrl: getRedirectUrl(user),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: `Verification failed: ${error.message}`,
      });
  }
};

// ==================== RESEND VERIFICATION CODE ====================
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email already verified" });
    }

    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user.email, user.name, verificationCode);

    res.status(200).json({
      success: true,
      message: "New verification code sent! Valid for 10 minutes.",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: `Failed to resend code: ${error.message}`,
      });
  }
};

// ==================== FORGOT PASSWORD ====================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists, you will receive a password reset link.",
      });
    }

    if (user.isGoogleUser && !user.password) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google Sign-In. Please use 'Continue with Google'.",
      });
    }

    const crypto = await import("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(user.email, user.name, resetToken).catch(
      (err) => console.error("Reset email failed:", err),
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent! Valid for 1 hour.",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: `Failed to send reset email: ${error.message}`,
      });
  }
};

// ==================== RESET PASSWORD ====================
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now login.",
    });
  } catch (error) {
    res
      .status(500)
      .json({
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
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== LOGOUT ====================
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
