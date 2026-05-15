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
      // Not required for Google users
    },
    googleId: {
      type: String,
      sparse: true, // Allows multiple users without googleId
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "recruiter"], // Keep your existing roles
      default: "user",
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
    avatar: {
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
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
