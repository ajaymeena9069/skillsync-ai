// backend/src/controllers/recruiterController.js
import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const getDashboardStats = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const jobs = await Job.find({ recruiterId });
    const jobIds = jobs.map(job => job._id);
    
    if (jobIds.length === 0) {
      return res.json({
        success: true,
        data: {
          stats: { activeJobs: 0, totalApplicants: 0, shortlisted: 0, hired: 0, pending: 0 },
          topCandidates: [],
          chartData: [],
          recentActivity: [],
        }
      });
    }
    
    // Parallel queries for better performance
    const [applications, activeJobsCount] = await Promise.all([
      Application.find({ jobId: { $in: jobIds } })
        .populate("userId", "name email skills avatar")
        .sort({ createdAt: -1 }),
      Job.countDocuments({ recruiterId, status: "active" })
    ]);
    
    // Calculate stats
    const totalApplicants = applications.length;
    const shortlisted = applications.filter(a => a.status === "shortlisted").length;
    const hired = applications.filter(a => a.status === "hired").length;
    const pending = applications.filter(a => a.status === "pending").length;
    
    // Top candidates (top 5 by match score)
    const topCandidates = [...applications]
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)
      .map((app, index) => ({
        id: app._id,
        name: app.userId?.name || "Unknown",
        email: app.userId?.email,
        avatar: app.userId?.avatar,
        role: app.userId?.parsedResume?.experience || "Candidate",
        location: app.userId?.location || "Not specified",
        matchScore: app.matchScore,
        skills: app.userId?.skills || [],
        status: app.status,
        rank: index + 1,
        applicationId: app._id,
      }));
    
    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyApplications = applications.filter(a => a.createdAt >= sixMonthsAgo);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = monthNames[date.getMonth()];
      const count = monthlyApplications.filter(a => 
        a.createdAt.getMonth() === date.getMonth() && 
        a.createdAt.getFullYear() === date.getFullYear()
      ).length;
      monthlyData.push({ month: monthName, applications: count });
    }
    
    // Recent activity (last 5)
    const recentActivity = applications.slice(0, 5).map(app => ({
      action: app.status === "pending" ? "New application received" :
              app.status === "shortlisted" ? "Candidate shortlisted" :
              app.status === "hired" ? "Candidate hired" :
              `${app.status} application`,
      candidate: app.userId?.name,
      jobTitle: jobs.find(j => j._id.toString() === app.jobId.toString())?.title,
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
          pending 
        },
        topCandidates,
        chartData: monthlyData,
        recentActivity,
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};