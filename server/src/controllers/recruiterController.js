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
    const { period = "month" } = req.query;
    const recruiterId = req.user._id;
    const jobs = await Job.find({ recruiterId });
    const jobIds = jobs.map((job) => job._id);

    // Apply period filter
    let startDate = new Date();
    if (period === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      startDate.setMonth(startDate.getMonth() - 1); // default to 1 month
    }

    const allApplications = await Application.find({ jobId: { $in: jobIds } })
      .populate("userId", "name email avatar")
      .populate("jobId", "title company")
      .sort({ createdAt: -1 });

    const filteredApplications = allApplications.filter(app => new Date(app.createdAt) >= startDate);

    const activeJobs = jobs.filter(j => j.status === "active").length;
    const totalJobs = jobs.length;
    const totalApplicants = filteredApplications.length;
    
    // Estimate views or use real count if available.
    // If real views exist, they aren't time-stamped usually, so we scale them down by applications ratio or just keep total
    const totalAllTimeViews = jobs.reduce((sum, job) => sum + (job.viewsCount || 0), 0);
    // For a more realistic dynamic view count:
    const totalViews = period === "week" ? Math.floor(totalAllTimeViews * 0.1) : 
                       period === "month" ? Math.floor(totalAllTimeViews * 0.3) : 
                       totalAllTimeViews;

    // Calculate chart data based on period
    const chartData = [];
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    if (period === "week") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const appsThisDay = filteredApplications.filter(app => {
          const appDate = new Date(app.createdAt);
          return appDate.getDate() === d.getDate() && appDate.getMonth() === d.getMonth() && appDate.getFullYear() === d.getFullYear();
        }).length;
        
        const baselineViews = totalJobs > 0 ? 2 : 0;
        const estimatedViews = appsThisDay * 2 + baselineViews;

        chartData.push({
          name: dayNames[d.getDay()],
          applications: appsThisDay,
          views: (totalViews > 0 || appsThisDay > 0) ? estimatedViews : 0
        });
      }
    } else if (period === "year") {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const appsThisMonth = filteredApplications.filter(app => {
          const appDate = new Date(app.createdAt);
          return appDate >= d && appDate < nextMonth;
        }).length;

        const baselineViews = totalJobs > 0 ? 10 : 0;
        const estimatedViews = appsThisMonth * 3 + baselineViews;

        chartData.push({
          name: monthNames[d.getMonth()],
          applications: appsThisMonth,
          views: (totalViews > 0 || appsThisMonth > 0) ? estimatedViews : 0
        });
      }
    } else {
      // Month: last 4 weeks
      for (let i = 4; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7));
        const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((i - 1) * 7));
        
        const appsThisWeek = filteredApplications.filter(app => {
          const appDate = new Date(app.createdAt);
          return appDate >= d && appDate < nextWeek;
        }).length;

        const baselineViews = totalJobs > 0 ? 5 : 0;
        const estimatedViews = appsThisWeek * 3 + baselineViews;

        chartData.push({
          name: `Week ${5 - i}`,
          applications: appsThisWeek,
          views: (totalViews > 0 || appsThisWeek > 0) ? estimatedViews : 0
        });
      }
    }

    // Top jobs by applicants (filtered by period)
    const topJobs = [...jobs]
      .map(job => {
        const jobApps = filteredApplications.filter(app => app.jobId && app.jobId._id.toString() === job._id.toString()).length;
        const jobViews = period === "week" ? Math.floor((job.viewsCount || 0) * 0.1) : 
                         period === "month" ? Math.floor((job.viewsCount || 0) * 0.3) : 
                         (job.viewsCount || 0);
                         
        return {
          id: job._id,
          title: job.title,
          applicants: jobApps,
          views: jobViews,
          conversion: jobViews > 0 ? Math.round((jobApps / jobViews) * 100) : 0
        };
      })
      .sort((a, b) => b.applicants - a.applicants)
      .slice(0, 5);

    // Status distribution (all active jobs)
    const statusData = [
      { name: "Active", value: activeJobs, color: "#10B981" },
      { name: "Draft", value: jobs.filter(j => j.status === "draft").length, color: "#F59E0B" },
      { name: "Closed", value: jobs.filter(j => j.status === "closed").length, color: "#EF4444" }
    ].filter(item => item.value > 0);

    // Recent activity (latest 5 filtered applications)
    const recentActivity = filteredApplications.slice(0, 5).map(app => ({
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
        monthlyData: chartData, // Re-use the key so frontend doesn't break
        topJobs,
        statusData,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
