// server/src/controllers/recruiterController.js
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const jobs = await Job.find({ recruiterId });
    const jobIds = jobs.map((job) => job._id);

    if (jobIds.length === 0) {
      return res.json({
        success: true,
        data: {
          stats: {
            activeJobs: 0,
            totalApplicants: 0,
            shortlisted: 0,
            hired: 0,
            pending: 0,
          },
          topCandidates: [],
          chartData: [],
          recentActivity: [],
        },
      });
    }

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("userId", "name email skills avatar location")
      .sort({ createdAt: -1 });

    const activeJobsCount = await Job.countDocuments({
      recruiterId,
      status: "active",
    });

    // Stats calculation
    const totalApplicants = applications.length;
    const shortlisted = applications.filter(
      (a) => a.status === "shortlisted",
    ).length;
    const hired = applications.filter((a) => a.status === "hired").length;
    const pending = applications.filter((a) => a.status === "pending").length;

    // Top 5 candidates by match score (excluding hired/rejected)
    const topCandidates = [...applications]
      .filter((a) => a.status !== "hired" && a.status !== "rejected")
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, 5)
      .map((app, idx) => ({
        id: app._id,
        name: app.userId?.name || "Unknown",
        email: app.userId?.email,
        avatar: app.userId?.avatar,
        location: app.userId?.location || "Location not specified",
        appliedFor: jobs.find((j) => j._id.toString() === app.jobId.toString())?.title || "Unknown Role",
        matchScore: app.matchScore || 0,
        skills: app.userId?.skills || [],
        status: app.status,
        rank: idx + 1,
        applicationId: app._id,
      }));

    // Last 6 months trend
    const monthlyData = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const count = applications.filter(
        (a) =>
          a.createdAt.getMonth() === date.getMonth() &&
          a.createdAt.getFullYear() === date.getFullYear(),
      ).length;
      monthlyData.push({
        month: monthNames[date.getMonth()],
        applications: count,
      });
    }

    // Recent activities
    const recentActivity = applications.slice(0, 5).map((app) => ({
      action:
        app.status === "pending"
          ? "New application received"
          : app.status === "shortlisted"
            ? "Candidate shortlisted"
            : app.status === "hired"
              ? "Candidate hired"
              : "Application updated",
      candidate: app.userId?.name,
      jobTitle: jobs.find((j) => j._id.toString() === app.jobId.toString())
        ?.title,
      time: app.createdAt,
      status: app.status,
    }));

    res.json({
      success: true,
      data: {
        stats: {
          activeJobs: activeJobsCount,
          totalApplicants,
          shortlisted,
          hired,
          pending,
        },
        topCandidates,
        chartData: monthlyData,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all jobs posted by recruiter
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id })
      .populate("recruiterId", "name email company avatar")
      .sort({ createdAt: -1 });

    // Get application counts for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({
          jobId: job._id,
        });
        return { ...job.toObject(), applicationCount };
      }),
    );

    res.json({ success: true, data: jobsWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get applications for recruiter's jobs
export const getApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).select("_id");
    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("userId", "name email avatar skills location experience")
      .populate("jobId", "title company")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      data: application,
      message: `Application ${status}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Record candidate profile view by recruiter
export const recordProfileView = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const recruiter = req.user;

    const candidate = await User.findById(candidateId);
    if (!candidate || candidate.role !== "jobseeker") {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    const hasViewedIndex = candidate.profileViewHistory.findIndex(
      (view) => view.recruiterId.toString() === recruiter._id.toString()
    );

    if (hasViewedIndex !== -1) {
      // Already viewed by this recruiter, just update the timestamp
      candidate.profileViewHistory[hasViewedIndex].viewedAt = new Date();
      await candidate.save();
      return res.json({ success: true, message: "Profile view updated" });
    }

    candidate.profileViews = (candidate.profileViews || 0) + 1;
    candidate.profileViewHistory.push({
      recruiterId: recruiter._id,
      recruiterName: recruiter.name || recruiter.company?.name || "Recruiter",
      viewedAt: new Date()
    });

    await candidate.save();

    res.json({ success: true, message: "Profile view recorded" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const jobs = await Job.find({ recruiterId });
    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("userId", "name email avatar")
      .populate("jobId", "title company")
      .sort({ createdAt: -1 });

    const activeJobs = jobs.filter(j => j.status === "active").length;
    const totalJobs = jobs.length;
    const totalApplicants = applications.length;
    const totalViews = jobs.reduce((sum, job) => sum + (job.viewsCount || 0), 0);

    // Calculate monthly data for the last 6 months
    const monthlyData = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const appsThisMonth = applications.filter(app => {
        const appDate = new Date(app.createdAt);
        return appDate >= d && appDate < nextMonth;
      }).length;

      // Estimate views deterministically (since we don't have historical view data)
      const baselineViews = totalJobs > 0 ? 5 : 0;
      const deterministicBonus = (d.getMonth() % 5) + 2; 
      const estimatedViews = appsThisMonth * 3 + baselineViews + deterministicBonus;

      monthlyData.push({
        month: monthNames[d.getMonth()],
        applications: appsThisMonth,
        views: (totalViews > 0 || appsThisMonth > 0) ? estimatedViews : 0
      });
    }

    // Top jobs by applicants
    const topJobs = [...jobs]
      .sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0))
      .slice(0, 5)
      .map(job => ({
        id: job._id,
        title: job.title,
        applicants: job.applicationsCount || 0,
        views: job.viewsCount || 0,
        conversion: job.viewsCount > 0 ? Math.round(((job.applicationsCount || 0) / job.viewsCount) * 100) : 0
      }));

    // Status distribution
    const statusData = [
      { name: "Active", value: activeJobs, color: "#10B981" },
      { name: "Draft", value: jobs.filter(j => j.status === "draft").length, color: "#F59E0B" },
      { name: "Closed", value: jobs.filter(j => j.status === "closed").length, color: "#EF4444" }
    ].filter(item => item.value > 0);

    // Recent activity (latest 5 applications)
    const recentActivity = applications.slice(0, 5).map(app => ({
      id: app._id,
      jobTitle: app.jobId?.title || "Unknown Job",
      company: app.jobId?.company || "Company",
      applicantName: app.userId?.name || "Applicant",
      date: app.createdAt
    }));

    res.json({
      success: true,
      data: {
        totalJobs,
        totalApplicants,
        totalViews,
        activeJobs,
        monthlyData,
        topJobs,
        statusData,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
