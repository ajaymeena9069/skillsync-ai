import { z } from "zod";

// Basic email validation
const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(5, "Email is too short")
  .max(100, "Email is too long")
  .transform((val) => val.toLowerCase().trim());

// Basic password validation (only length)
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password is too long");

// Name validation
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name is too long")
  .transform((val) => val.trim());

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(["jobseeker", "recruiter"]).optional().default("jobseeker"),
  adminKey: z.string().optional(),
});

// Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset Password Schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: passwordSchema,
});

// Email Verification Schema
export const verifyEmailSchema = z.object({
  email: emailSchema,
  verificationCode: z.string().length(6, "Verification code must be 6 digits"),
});

// Resend Verification Schema
export const resendVerificationSchema = z.object({
  email: emailSchema,
});
