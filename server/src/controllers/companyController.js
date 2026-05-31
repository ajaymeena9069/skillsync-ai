// backend/src/controllers/companyController.js
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import fs from "fs";

// ✅ Helper - Clean company data
const cleanCompany = (company) => {
  if (!company || typeof company !== "object") return null;

  let cleaned = company;
  while (cleaned.company && typeof cleaned.company === "object") {
    cleaned = cleaned.company;
  }

  return {
    name: cleaned.name || "",
    logo: cleaned.logo || "",
    logoPublicId: cleaned.logoPublicId || "",
    email: cleaned.email || "",
    phone: cleaned.phone || "",
    website: cleaned.website || "",
    location: cleaned.location || "",
    founded: cleaned.founded || "",
    size: cleaned.size || "",
    industry: cleaned.industry || "",
    description: cleaned.description || "",
    mission: cleaned.mission || "",
    vision: cleaned.vision || "",
    socialLinks: {
      linkedin: cleaned.socialLinks?.linkedin || "",
      twitter: cleaned.socialLinks?.twitter || "",
      github: cleaned.socialLinks?.github || "",
    },
    benefits: cleaned.benefits || [],
    culture: cleaned.culture || "",
  };
};

// ✅ Helper - Check if company profile is complete
const isCompanyComplete = (company) => {
  if (!company) return false;

  const required = ["name", "email", "phone", "location", "industry"];
  const hasRequired = required.every(
    (field) => company[field] && company[field].trim(),
  );
  const hasDescription =
    company.description && company.description.length >= 50;

  return hasRequired && hasDescription;
};

// ==================== PUBLIC COMPANY PROFILE (For Job Seekers) ====================

export const getPublicCompanyProfile = async (req, res) => {
  try {
    const { recruiterId } = req.params;

    console.log(
      "Fetching public company profile for recruiterId:",
      recruiterId,
    );

    const recruiter = await User.findById(recruiterId).select(
      "name company isCompanyComplete",
    );

    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const cleanedCompany = cleanCompany(recruiter.company);

    res.json({
      success: true,
      data: {
        recruiterName: recruiter.name,
        company: cleanedCompany || {
          name: "",
          logo: "",
          logoPublicId: "",
          email: "",
          phone: "",
          website: "",
          location: "",
          founded: "",
          size: "",
          industry: "",
          description: "",
          mission: "",
          vision: "",
          socialLinks: { linkedin: "", twitter: "", github: "" },
          benefits: [],
          culture: "",
        },
        isComplete: recruiter.isCompanyComplete || false,
      },
    });
  } catch (error) {
    console.error("Get public company profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== COMPANY PROFILE (For Recruiters) ====================

export const getCompanyProfile = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const user = await User.findById(req.user._id).select(
      "name email phone avatar company isCompanyComplete",
    );

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          avatar: user.avatar || "",
        },
        company: cleanCompany(user.company) || {},
        isComplete: user.isCompanyComplete || false,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCompanyProfile = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const currentUser = await User.findById(req.user._id);
    const currentCompany = cleanCompany(currentUser.company) || {};
    const newData = req.body;

    const mergedCompany = {
      name: newData.name || currentCompany.name,
      logo: newData.logo || currentCompany.logo,
      logoPublicId: newData.logoPublicId || currentCompany.logoPublicId,
      email: newData.email || currentCompany.email,
      phone: newData.phone || currentCompany.phone,
      website: newData.website || currentCompany.website,
      location: newData.location || currentCompany.location,
      founded: newData.founded || currentCompany.founded,
      size: newData.size || currentCompany.size,
      industry: newData.industry || currentCompany.industry,
      description: newData.description || currentCompany.description,
      mission: newData.mission || currentCompany.mission,
      vision: newData.vision || currentCompany.vision,
      socialLinks: {
        linkedin:
          newData.socialLinks?.linkedin || currentCompany.socialLinks?.linkedin,
        twitter:
          newData.socialLinks?.twitter || currentCompany.socialLinks?.twitter,
        github:
          newData.socialLinks?.github || currentCompany.socialLinks?.github,
      },
      benefits: newData.benefits || currentCompany.benefits,
      culture: newData.culture || currentCompany.culture,
    };

    const complete = isCompanyComplete(mergedCompany);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          company: mergedCompany,
          isCompanyComplete: complete,
        },
      },
      { new: true },
    );

    res.json({
      success: true,
      data: {
        company: cleanCompany(user.company),
        isComplete: user.isCompanyComplete,
      },
      message: complete
        ? "Company profile completed! 🎉"
        : "Company profile updated",
    });
  } catch (error) {
    console.error("updateCompanyProfile ERROR:", error);
    fs.writeFileSync("update_error.log", error.stack || error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadCompanyLogo = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const currentUser = await User.findById(req.user._id);
    const oldLogoId = currentUser.company?.logoPublicId;

    if (oldLogoId) {
      const { deleteFromCloudinary } =
        await import("../middleware/uploadMiddleware.js");
      await deleteFromCloudinary(oldLogoId).catch((err) =>
        console.warn("Delete failed:", err),
      );
    }

    const { uploadToCloudinary } =
      await import("../middleware/uploadMiddleware.js");
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "skillsync/company-logos",
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          "company.logo": result.secure_url,
          "company.logoPublicId": result.public_id,
        },
      },
      { new: true },
    );

    res.json({
      success: true,
      data: { logo: user.company.logo },
      message: "Logo uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanyStats = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const jobs = await Job.find({ recruiterId: req.user._id });
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ jobId: { $in: jobIds } });

    const stats = {
      activeJobs: jobs.filter((j) => j.status === "active").length,
      totalJobs: jobs.length,
      totalApplicants: applications.length,
      shortlisted: applications.filter((a) => a.status === "shortlisted")
        .length,
      hired: applications.filter((a) => a.status === "hired").length,
      pending: applications.filter((a) => a.status === "pending").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
      totalViews: jobs.reduce((sum, job) => sum + (job.viewsCount || 0), 0),
    };

    const monthlyData = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const count = applications.filter(
        (a) =>
          a.createdAt &&
          a.createdAt.getMonth() === date.getMonth() &&
          a.createdAt.getFullYear() === date.getFullYear(),
      ).length;
      monthlyData.push({ month: monthNames[5 - i], applications: count });
    }

    res.json({
      success: true,
      data: { stats, chartData: monthlyData },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
