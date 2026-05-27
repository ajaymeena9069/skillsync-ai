import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import {
  getAIMatchAnalysis,
  calculateMatchScore,
} from "../services/jobMatchingService.js";

export const getCandidateMatchAnalysis = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId)
      .populate("userId", "name email skills")
      .populate(
        "jobId",
        "title requiredSkills preferredSkills experienceLevel description",
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Get candidate's resume data
    const resume = await Resume.findOne({
      userId: application.userId._id,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Candidate resume not found",
      });
    }

    // Prepare user resume data for AI
    const userResume = {
      parsedSkills: resume.parsedSkills || application.userId.skills || [],
      experience: resume.experience || "Not specified",
      education: resume.education || [],
      projects: resume.projects || [],
    };

    const job = application.jobId;

    // Get AI-powered analysis
    const analysis = await getAIMatchAnalysis(userResume, job);

    res.json({
      success: true,
      data: {
        ...analysis,
        candidate: {
          id: application.userId._id,
          name: application.userId.name,
          email: application.userId.email,
          skills: userResume.parsedSkills,
        },
        job: {
          id: job._id,
          title: job.title,
          requiredSkills: job.requiredSkills,
        },
      },
    });
  } catch (error) {
    console.error("Match analysis error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get match score for all candidates of a job (For Recruiters)
export const getJobCandidatesWithMatches = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Get all applications for this job
    const applications = await Application.find({ jobId })
      .populate("userId", "name email skills")
      .sort({ matchScore: -1, createdAt: -1 });

    if (!applications.length) {
      return res.json({
        success: true,
        data: [],
        message: "No applications found for this job",
      });
    }

    // Get job details
    const job = await Job.findById(jobId);

    // Calculate/update match scores for each application (if not already present)
    const candidatesWithMatches = await Promise.all(
      applications.map(async (app) => {
        let matchScore = app.matchScore;
        let analysis = null;

        // If match score is 0 or not calculated, calculate it
        if (matchScore === 0) {
          const userSkills = app.userId.skills || [];
          matchScore = calculateMatchScore(
            userSkills,
            job.requiredSkills,
            job.preferredSkills,
          );

          // Update application with match score
          app.matchScore = matchScore;
          await app.save();
        }

        // Get AI analysis for top candidates (optional, can be fetched on demand)
        if (matchScore >= 70) {
          // You can optionally fetch AI analysis here
          // But better to fetch on demand to save API calls
        }

        return {
          id: app._id,
          candidate: {
            id: app.userId._id,
            name: app.userId.name,
            email: app.userId.email,
            skills: app.userId.skills || [],
          },
          matchScore,
          status: app.status,
          appliedAt: app.createdAt,
          resumeUrl: app.resumeUrl,
          coverLetter: app.coverLetter,
        };
      }),
    );

    // Sort by match score
    candidatesWithMatches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      data: candidatesWithMatches,
      job: {
        id: job._id,
        title: job.title,
        requiredSkills: job.requiredSkills,
      },
    });
  } catch (error) {
    console.error("Get job candidates error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get detailed AI match for a specific candidate and job (For Recruiters - on-demand)
export const getDetailedMatch = async (req, res) => {
  try {
    const { candidateId, jobId } = req.params;

    // Get candidate's resume
    const resume = await Resume.findOne({
      userId: candidateId,
      isActive: true,
    });
    const user = await User.findById(candidateId).select("name email skills");

    if (!resume && !user?.skills?.length) {
      return res.status(404).json({
        success: false,
        message: "Candidate skills not found",
      });
    }

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Prepare resume data
    const userResume = {
      parsedSkills: resume?.parsedSkills || user?.skills || [],
      experience: resume?.experience || "Not specified",
      education: resume?.education || [],
      projects: resume?.projects || [],
    };

    // Get AI analysis
    const analysis = await getAIMatchAnalysis(userResume, job);

    res.json({
      success: true,
      data: {
        ...analysis,
        candidate: {
          id: candidateId,
          name: user?.name,
          email: user?.email,
          skills: userResume.parsedSkills,
        },
        job: {
          id: job._id,
          title: job.title,
          requiredSkills: job.requiredSkills,
          preferredSkills: job.preferredSkills,
        },
      },
    });
  } catch (error) {
    console.error("Detailed match error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
