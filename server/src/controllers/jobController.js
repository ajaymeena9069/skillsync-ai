// backend/src/controllers/jobController.js
import Job from "../models/Job.js";

// Get all jobs (with recruiterId populated)
export const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      experienceLevel,
      employmentType,
      locationType,
      minSalary,
      page = 1,
      limit = 10,
      sortBy = "newest",
    } = req.query;

    const query = { status: "active" };

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { requiredSkills: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Location filter
    if (location && location !== "All Locations") {
      query.location = { $regex: location, $options: "i" };
    }

    // Experience level filter
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    // Employment type filter
    if (employmentType) {
      const types = Array.isArray(employmentType)
        ? employmentType
        : [employmentType];
      query.employmentType = { $in: types };
    }

    // Location type filter
    if (locationType) {
      query.locationType = locationType;
    }

    // Minimum salary filter
    if (minSalary) {
      query.salaryMin = { $gte: parseInt(minSalary) };
    }

    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "salary-high":
        sortOptions = { salaryMax: -1 };
        break;
      case "salary-low":
        sortOptions = { salaryMin: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // ✅ IMPORTANT: Populate recruiterId to get company details
    const jobs = await Job.find(query)
      .populate("recruiterId", "name email company avatar") // ✅ This populates recruiter data
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get job by ID (with recruiterId populated)
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiterId",
      "name email company avatar",
    ); // ✅ Populate recruiter

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Increment view count if the user is not the recruiter who posted the job
    const isOwner = req.user && req.user._id.toString() === job.recruiterId._id.toString();
    if (!isOwner) {
      let shouldSave = false;

      if (req.user) {
        // Enforce unique views per candidate
        const hasViewed = job.viewedBy && job.viewedBy.some(id => id.toString() === req.user._id.toString());
        if (!hasViewed) {
          if (!job.viewedBy) job.viewedBy = [];
          job.viewedBy.push(req.user._id);
          job.viewsCount = (job.viewsCount || 0) + 1;
          shouldSave = true;
        }
      } else {
        // Allow anonymous views to increment normally (or could restrict by IP if needed)
        job.viewsCount = (job.viewsCount || 0) + 1;
        shouldSave = true;
      }

      if (shouldSave) {
        await job.save();
      }
    }

    res.json({ success: true, data: job });
  } catch (error) {
    console.error("Get job by ID error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get jobs by recruiter
export const getJobsByRecruiter = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id })
      .populate("recruiterId", "name email company")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error("Get jobs by recruiter error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create job
export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      recruiterId: req.user._id,
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      data: job,
      message: "Job posted successfully",
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user._id },
      req.body,
      { new: true, runValidators: true },
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({
      success: true,
      data: job,
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      recruiterId: req.user._id,
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update job status
export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user._id },
      { status },
      { new: true },
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({
      success: true,
      data: job,
      message: `Job ${status} successfully`,
    });
  } catch (error) {
    console.error("Update job status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
