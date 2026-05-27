import { z } from "zod";

// Job application validation
export const applyJobSchema = z.object({
  jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid job ID format"),
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(2000, "Cover letter cannot exceed 2000 characters")
    .optional()
    .default(""),
});

// Status update validation (for recruiter)
export const updateStatusSchema = z.object({
  status: z.enum(["pending", "reviewed", "shortlisted", "rejected", "hired"]),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

// Query validation
export const applicationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).default("10"),
  status: z
    .enum(["pending", "reviewed", "shortlisted", "rejected", "hired"])
    .optional(),
});
