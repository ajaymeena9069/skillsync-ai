import Job from "../models/Job.js";
import User from "../models/User.js";
import Resume from "../models/Resume.js";
import { Types } from "mongoose";

export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      recruiterId: req.user._id,
      requiredSkills: req.body.requiredSkills.map((skill) =>
        skill.toLowerCase().trim(),
      ),
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all active jobs (for job seekers)
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      skills,
      location,
      employmentType,
      experienceLevel,
      locationType,
      minSalary,
      sortBy = "newest",
    } = req.query;

    const query = { status: "active" };

    // Search in title, company, description
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by required skills
    if (skills) {
      const skillArray = skills.split(",").map((s) => s.toLowerCase().trim());
      query.requiredSkills = { $in: skillArray };
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Employment type
    if (employmentType) {
      query.employmentType = employmentType;
    }

    // Experience level
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    // Location type
    if (locationType) {
      query.locationType = locationType;
    }

    // Minimum salary
    if (minSalary) {
      query.salaryMin = { $gte: parseInt(minSalary) };
    }

    // Don't show expired jobs
    query.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } },
    ];

    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case "newest":
        sortOptions = { postedAt: -1 };
        break;
      case "oldest":
        sortOptions = { postedAt: 1 };
        break;
      case "salary-high":
        sortOptions = { salaryMax: -1 };
        break;
      case "salary-low":
        sortOptions = { salaryMax: 1 };
        break;
      default:
        sortOptions = { postedAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("recruiterId", "name email company"),
      Job.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiterId",
      "name email company avatar",
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Increment view count
    await job.updateOne({ $inc: { viewsCount: 1 } });

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter)
export const getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ recruiterId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Get my jobs error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter who owns the job)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        requiredSkills: req.body.requiredSkills?.map((s) =>
          s.toLowerCase().trim(),
        ),
      },
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      data: updatedJob,
    });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter who owns the job)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
