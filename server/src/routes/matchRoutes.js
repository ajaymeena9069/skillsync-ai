import express from "express";
import {
  getCandidateMatchAnalysis,
  getJobCandidatesWithMatches,
  getDetailedMatch,
} from "../controllers/matchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected (recruiter only)
router.use(protect);

// Get all candidates with match scores for a job
router.get("/job/:jobId/candidates", getJobCandidatesWithMatches);

// Get AI analysis for a specific application (candidate applied to a job)
router.get("/application/:applicationId/analysis", getCandidateMatchAnalysis);

// Get detailed AI match for a candidate and job (on-demand)
router.get("/candidate/:candidateId/job/:jobId", getDetailedMatch);

export default router;
