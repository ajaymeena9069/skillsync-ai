// backend/src/controllers/aiController.js
import User from "../models/User.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import { analyzeSkillGap } from "../services/aiService.js";
import { generateRoadmap } from "../services/roadmapService.js";

/**
 * GET /api/ai/skill-gap
 * Analyze skill gaps between user's resume skills and target job requirements.
 * On-demand: triggered by button click, not auto-fetched.
 */
export const getSkillGapAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's resume and skills
    const [resume, user] = await Promise.all([
      Resume.findOne({ userId, isActive: true }),
      User.findById(userId).select("skills"),
    ]);

    const userSkills = resume?.parsedSkills?.length
      ? resume.parsedSkills
      : user?.skills || [];

    if (!userSkills.length) {
      return res.status(400).json({
        success: false,
        message:
          "No skills found. Please upload your resume first to get skill gap analysis.",
      });
    }

    // Get recent active jobs to compare against (limit to 50 for performance)
    const targetJobs = await Job.find({ status: "active" })
      .select("title requiredSkills preferredSkills")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    if (!targetJobs.length) {
      return res.status(400).json({
        success: false,
        message: "No active jobs found to compare against.",
      });
    }

    // Run AI analysis (Gemini with fallback)
    const analysis = await analyzeSkillGap(userSkills, targetJobs);

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Skill gap analysis error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze skill gaps",
    });
  }
};

/**
 * POST /api/ai/skill-gap
 * Analyze skill gaps for a specific job (compare user skills vs one job)
 * Body: { jobId: string }
 */
export const getSkillGapForJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    // Get user's resume and skills
    const [resume, user, job] = await Promise.all([
      Resume.findOne({ userId, isActive: true }),
      User.findById(userId).select("skills"),
      Job.findById(jobId)
        .select("title requiredSkills preferredSkills")
        .lean(),
    ]);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const userSkills = resume?.parsedSkills?.length
      ? resume.parsedSkills
      : user?.skills || [];

    if (!userSkills.length) {
      return res.status(400).json({
        success: false,
        message: "No skills found. Please upload your resume first.",
      });
    }

    // Run AI analysis against single job
    const analysis = await analyzeSkillGap(userSkills, [job]);

    res.json({
      success: true,
      data: analysis,
      job: {
        id: job._id,
        title: job.title,
      },
    });
  } catch (error) {
    console.error("Skill gap for job error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze skill gaps for job",
    });
  }
};

/**
 * POST /api/ai/roadmap
 * Generate a personalized learning roadmap based on user's skill gaps.
 * Body (optional): { weeks: number, hoursPerWeek: number, missingSkills: string[] }
 */
export const getLearningRoadmap = async (req, res) => {
  try {
    const userId = req.user._id;
    const { weeks = 4, hoursPerWeek = 10, missingSkills: providedMissingSkills } = req.body || {};

    // Get user's resume and skills
    const [resume, user] = await Promise.all([
      Resume.findOne({ userId, isActive: true }),
      User.findById(userId).select("skills"),
    ]);

    const userSkills = resume?.parsedSkills?.length
      ? resume.parsedSkills
      : user?.skills || [];

    if (!userSkills.length) {
      return res.status(400).json({
        success: false,
        message:
          "No skills found. Please upload your resume first to generate a learning roadmap.",
      });
    }

    let missingSkills = providedMissingSkills;

    // If no missing skills provided, auto-detect from active jobs
    if (!missingSkills || !missingSkills.length) {
      const targetJobs = await Job.find({ status: "active" })
        .select("requiredSkills preferredSkills")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      if (!targetJobs.length) {
        return res.status(400).json({
          success: false,
          message: "No active jobs found to determine skills to learn.",
        });
      }

      // Determine missing skills by comparing user skills to job requirements
      const normalizedUser = userSkills.map((s) => s.toLowerCase().trim());
      const requiredSkillsCount = {};

      targetJobs.forEach((job) => {
        (job.requiredSkills || []).forEach((s) => {
          const key = s.toLowerCase().trim();
          requiredSkillsCount[key] = (requiredSkillsCount[key] || 0) + 1;
        });
        (job.preferredSkills || []).forEach((s) => {
          const key = s.toLowerCase().trim();
          requiredSkillsCount[key] = (requiredSkillsCount[key] || 0) + 0.5;
        });
      });

      // Find skills user doesn't have, sorted by demand
      missingSkills = Object.entries(requiredSkillsCount)
        .filter(([skill]) => !normalizedUser.some((us) => us.includes(skill) || skill.includes(us)))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([skill]) => skill.charAt(0).toUpperCase() + skill.slice(1));
    }

    if (!missingSkills.length) {
      return res.json({
        success: true,
        data: {
          title: "You're All Caught Up!",
          totalWeeks: 0,
          hoursPerWeek: 0,
          weeks: [],
          summary: "Your skills already match the current job market demands. Keep practicing and stay updated!",
          expectedOutcome: "Continue building projects to maintain and deepen your expertise.",
        },
      });
    }

    // Generate roadmap
    const roadmap = await generateRoadmap(userSkills, missingSkills, { weeks, hoursPerWeek });

    res.json({
      success: true,
      data: roadmap,
      meta: {
        userSkillsCount: userSkills.length,
        missingSkillsCount: missingSkills.length,
        missingSkills,
      },
    });
  } catch (error) {
    console.error("Roadmap generation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate learning roadmap",
    });
  }
};
