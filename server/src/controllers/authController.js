// server/src/controllers/authController.js
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

// ✅ Helper function to clean company data (remove nesting)
const cleanCompanyData = (companyData) => {
  if (!companyData) return null;

  // If companyData is not an object, return default
  if (typeof companyData !== "object") return null;

  // Handle nested company object (company.company)
  let cleaned = companyData;
  while (cleaned.company && typeof cleaned.company === "object") {
    cleaned = cleaned.company;
  }

  // Remove user wrapper if present
  if (cleaned.user && typeof cleaned.user === "object") {
    const { user, ...rest } = cleaned;
    cleaned = rest;
  }

  // Return cleaned company object
  return {
    name: cleaned.name || "",
    logo: cleaned.logo || "",
    logoPublicId: cleaned.logoPublicId || "",
    email: cleaned.email || "",
    phone: cleaned.phone || "",
    website: cleaned.website || "",
    location: cleaned.location || "",
    founded: cleaned.founded || "",
    size: cleaned.size || "",
    industry: cleaned.industry || "",
    description: cleaned.description || "",
    mission: cleaned.mission || "",
    vision: cleaned.vision || "",
    socialLinks: {
      linkedin: cleaned.socialLinks?.linkedin || "",
      twitter: cleaned.socialLinks?.twitter || "",
      github: cleaned.socialLinks?.github || "",
    },
    benefits: cleaned.benefits || [],
    culture: cleaned.culture || "",
  };
};

// ==================== REGISTER ====================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const hashedPassword = await argon2.hash(password);
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    const userRole = role || "jobseeker";
    const currentRole = userRole === "recruiter" ? null : "Job Seeker";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      currentRole: currentRole,
      isEmailVerified: false,
      verificationCode,
      verificationCodeExpires,
      isProfileComplete: false,
      isCompanyComplete: false,
      isGoogleUser: false,
      googleId: null,
    });

    const emailResult = await sendVerificationEmail(
      email,
      name,
      verificationCode,
    );

    if (!emailResult.success) {
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
          currentRole: user.currentRole,
          requiresVerification: true,
        },
      });
    }

    res.status(201).json({
      message: "Registration successful! Please verify your email.",
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currentRole: user.currentRole,
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

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    if (user.isGoogleUser && !user.password) {
      return res.status(400).json({
        message: "This account uses Google login. Please sign in with Google.",
        success: false,
        provider: "google",
      });
    }

    if (!user.isEmailVerified && user.password) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        success: false,
        requiresVerification: true,
        email: user.email,
      });
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = generateToken(user._id, user.role);

    // ✅ Clean company data before sending
    const cleanedCompany = cleanCompanyData(user.company);

    const userData = {
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
      company: cleanedCompany || {
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

    let redirectUrl = "/app/dashboard";
    if (user.role === "recruiter" && !user.isCompanyComplete) {
      redirectUrl = "/app/company";
    } else if (user.role === "jobseeker" && !user.isProfileComplete) {
      redirectUrl = "/app/profile";
    }

    res.status(200).json({
      message: "Login successful",
      success: true,
      data: userData,
      token,
      redirectUrl,
    });
  } catch (error) {
    res.status(500).json({
      message: `Server error: ${error.message}`,
      success: false,
    });
  }
};

// ==================== GOOGLE AUTH ====================
export const googleAuth = async (req, res) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not provided by Google",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.password && !user.isGoogleUser) {
        return res.status(409).json({
          success: false,
          message:
            "This email is registered with email/password. Please login with email and password instead.",
          provider: "email",
        });
      }

      if (!user.googleId) {
        user.googleId = googleId;
        user.isGoogleUser = true;
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
      }

      const token = generateToken(user._id, user.role);

      // ✅ Clean company data before sending
      const cleanedCompany = cleanCompanyData(user.company);

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currentRole:
          user.currentRole ||
          (user.role === "recruiter" ? "Recruiter" : "Job Seeker"),
        avatar: user.avatar || picture,
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
        company: cleanedCompany || {
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

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: userData,
        token,
      });
    }

    if (!role) {
      return res.status(200).json({
        success: true,
        requiresRole: true,
        tempData: { email, name, googleId, avatar: picture, idToken },
        message: "Please select your role to continue",
      });
    }

    if (!["jobseeker", "recruiter"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    const currentRole = role === "recruiter" ? "Recruiter" : "Job Seeker";

    user = await User.create({
      name,
      email,
      googleId,
      role,
      currentRole: currentRole,
      isGoogleUser: true,
      isEmailVerified: true,
      avatar: picture || "",
      isProfileComplete: false,
      isCompanyComplete: false,
      password: null,
      company: {
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
    });

    const token = generateToken(user._id, user.role);

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      currentRole: user.currentRole,
      avatar: user.avatar,
      phone: user.phone || "",
      location: user.location || "",
      experience: user.experience || "",
      bio: user.bio || "",
      skills: user.skills || [],
      resumeUrl: user.resumeUrl || "",
      parsedResume: user.parsedResume || null,
      isEmailVerified: user.isEmailVerified,
      isProfileComplete: user.isProfileComplete,
      isCompanyComplete: user.isCompanyComplete,
      company: user.company,
    };

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: userData,
      token,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({
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
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
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

    await sendWelcomeEmail(user.email, user.name);

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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified. You can login.",
      });
    }

    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

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

// ==================== FORGOT PASSWORD ====================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with that email, you will receive a password reset link.",
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
        message: "Invalid or expired reset token. Please request a new one.",
      });
    }

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

    // ✅ Clean company data before sending
    const cleanedCompany = cleanCompanyData(user.company);

    const userData = {
      ...user.toObject(),
      company: cleanedCompany || user.company,
    };

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== LOGOUT ====================
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
