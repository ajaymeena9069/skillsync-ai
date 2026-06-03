// backend/src/models/User.js - Complete User Model
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["jobseeker", "recruiter"],
      default: "jobseeker",
    },
    isDeveloper: {
      type: Boolean,
      default: false,
    },

    // ========== CANDIDATE SPECIFIC FIELDS ==========
    profession: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    currentRole: {
      type: String,
      default: function () {
        return this.role === "recruiter" ? null : "Job Seeker";
      },
    },
    experience: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    parsedResume: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    profileViews: {
      type: Number,
      default: 0,
    },
    profileViewHistory: [
      {
        recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        recruiterName: { type: String },
        viewedAt: { type: Date, default: Date.now },
      }
    ],

    // ✅ ADD THESE FIELDS FOR PROFILE PAGE
    preferredJobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "freelance", "internship"],
      default: "full-time",
    },
    expectedSalary: {
      type: String,
      default: "",
    },
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },

    // ========== COMMON FIELDS ==========
    aiUsage: {
      roadmap: {
        lastGeneratedAt: { type: Date, default: null },
        cachedData: { type: mongoose.Schema.Types.Mixed, default: null },
      },
      skillGap: {
        lastAnalyzedAt: { type: Date, default: null },
        cachedData: { type: mongoose.Schema.Types.Mixed, default: null },
      },
      resumeParse: {
        lastParsedAt: { type: Date, default: null },
      },
    },
    avatar: {
      type: String,
      default: "",
    },
    avatarPublicId: {
      type: String,
      default: "",
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationCodeExpires: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },

    // ========== RECRUITER SPECIFIC FIELDS ==========
    company: {
      name: { type: String, default: "" },
      logo: { type: String, default: "" },
      logoPublicId: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      website: { type: String, default: "" },
      location: { type: String, default: "" },
      founded: { type: String, default: "" },
      size: { type: String, default: "" },
      industry: { type: String, default: "" },
      description: { type: String, default: "" },
      mission: { type: String, default: "" },
      vision: { type: String, default: "" },
      socialLinks: {
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        github: { type: String, default: "" },
      },
      benefits: { type: [String], default: [] },
      culture: { type: String, default: "" },
    },

    // ========== PROFILE COMPLETION FLAGS ==========
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    isCompanyComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Index for better performance (email index is auto-created by unique:true)
userSchema.index({ role: 1 });
userSchema.index({ "skills": 1 });
userSchema.index({ createdAt: -1 });

export default mongoose.model("User", userSchema);
