import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";

// Simple match calculation
const calculateMatchScore = (userSkills, jobSkills) => {
  if (!userSkills?.length || !jobSkills?.length) return 0;

  const normalizedUser = userSkills.map((s) => s.toLowerCase().trim());
  const normalizedJob = jobSkills.map((s) => s.toLowerCase().trim());

  const matched = normalizedJob.filter((skill) =>
    normalizedUser.some(
      (userSkill) =>
        userSkill === skill ||
        userSkill.includes(skill) ||
        skill.includes(userSkill),
    ),
  );

  return Math.round((matched.length / normalizedJob.length) * 100);
};

// Get single application by ID
export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate("userId", "name email skills avatar")
      .populate(
        "jobId",
        "title company location employmentType requiredSkills salaryMin salaryMax salaryCurrency",
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check authorization: either the applicant or the recruiter who owns the job
    const isApplicant =
      application.userId._id.toString() === req.user._id.toString();
    const isRecruiter = req.user.role === "recruiter";

    // If recruiter, check if they own the job
    let isJobOwner = false;
    if (isRecruiter && application.jobId) {
      const job = await Job.findOne({
        _id: application.jobId._id,
        recruiterId: req.user._id,
      });
      isJobOwner = !!job;
    }

    if (!isApplicant && !isJobOwner) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view this application",
      });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Get application by ID error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const userId = req.user._id;

    // Check if job exists
    const job = await Job.findOne({ _id: jobId, status: "active" });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check already applied
    const existing = await Application.findOne({ jobId, userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already applied for this job",
      });
    }

    // Get user's resume
    const resume = await Resume.findOne({ userId, isActive: true });
    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume first",
      });
    }

    // Calculate match score
    const matchScore = calculateMatchScore(
      resume.parsedSkills || [],
      job.requiredSkills || [],
    );

    // Create application
    const application = await Application.create({
      jobId,
      userId,
      resumeUrl: resume.fileUrl,
      coverLetter: coverLetter || "",
      matchScore,
      status: "pending",
    });

    // Update job application count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get my applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate(
        "jobId",
        "title company location employmentType salaryMin salaryMax",
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get job applications (recruiter)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOne({ _id: jobId, recruiterId: req.user._id });
    if (!job) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const applications = await Application.find({ jobId })
      .populate("userId", "name email skills avatar")
      .sort({ matchScore: -1, createdAt: -1 });

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Get job applications error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const job = await Job.findOne({
      _id: application.jobId,
      recruiterId: req.user._id,
    });

    if (!job) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    application.status = status;
    if (notes) application.notes = notes;
    if (status !== "pending") {
      application.reviewedAt = new Date();
      application.reviewedBy = req.user._id;
    }

    await application.save();

    res.json({
      success: true,
      message: "Status updated",
      data: application,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Withdraw application
export const withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findOne({
      _id: applicationId,
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot withdraw reviewed application",
      });
    }

    await application.deleteOne();

    await Job.findByIdAndUpdate(application.jobId, {
      $inc: { applicationsCount: -1 },
    });

    res.json({
      success: true,
      message: "Application withdrawn",
    });
  } catch (error) {
    console.error("Withdraw error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check if current user has applied to a specific job
export const checkApplicationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const application = await Application.findOne({ jobId, userId })
      .select("_id status matchScore createdAt")
      .lean();

    res.json({
      success: true,
      data: {
        hasApplied: !!application,
        application: application || null,
      },
    });
  } catch (error) {
    console.error("Check application status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
