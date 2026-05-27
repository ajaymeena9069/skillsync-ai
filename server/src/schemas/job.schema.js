import { z } from "zod";

// Job Validation Schema - Pure JavaScript (No TypeScript)
export const JobSchema = z
  .object({
    title: z
      .string()
      .min(3, "Job title must be at least 3 characters")
      .max(100, "Job title cannot exceed 100 characters"),

    company: z
      .string()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name cannot exceed 100 characters"),

    location: z.string().min(2, "Location is required"),

    locationType: z.enum(["remote", "onsite", "hybrid"]).default("remote"),

    employmentType: z
      .enum(["full-time", "part-time", "contract", "internship", "freelance"])
      .default("full-time"),

    experienceLevel: z
      .enum(["entry", "junior", "mid", "senior", "lead", "executive"])
      .default("mid"),

    salaryMin: z
      .number()
      .optional()
      .refine((val) => !val || val >= 0, "Salary cannot be negative")
      .refine((val) => !val || val <= 10000000, "Salary exceeds maximum limit"),

    salaryMax: z
      .number()
      .optional()
      .refine((val) => !val || val >= 0, "Salary cannot be negative")
      .refine((val) => !val || val <= 10000000, "Salary exceeds maximum limit"),

    salaryCurrency: z.enum(["INR", "USD", "EUR", "GBP"]).default("INR"),

    description: z
      .string()
      .min(50, "Job description must be at least 50 characters")
      .max(5000, "Job description cannot exceed 5000 characters"),

    requiredSkills: z
      .array(z.string())
      .min(1, "At least one required skill is needed")
      .max(30, "Cannot have more than 30 required skills"),

    preferredSkills: z.array(z.string()).max(30).optional().default([]),

    benefits: z.array(z.string()).max(20).optional().default([]),

    status: z.enum(["active", "draft", "closed"]).default("active"),
  })
  .refine(
    (data) => {
      if (data.salaryMin && data.salaryMax && data.salaryMin > data.salaryMax) {
        return false;
      }
      return true;
    },
    {
      message: "Minimum salary cannot be greater than maximum salary",
      path: ["salaryMin"],
    },
  );
