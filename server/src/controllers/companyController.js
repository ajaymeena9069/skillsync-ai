// backend/src/controllers/companyController.js
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getCloudinaryFolder,
} from "../middleware/uploadMiddleware.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// ✅ Helper function to clean company data (remove nesting)
const cleanCompanyData = (companyData) => {
  if (!companyData) return null;

  if (typeof companyData !== "object") return null;

  // Handle nested company object (company.company)
  let cleaned = companyData;
  while (cleaned.company && typeof cleaned.company === "object") {
    cleaned = cleaned.company;
  }

  // Remove user wrapper if present
  if (cleaned.user && typeof cleaned.user === "object") {
    const { user, ...rest } = cleaned;
    cleaned = rest;
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

// Helper function - Check if company profile is complete
const checkCompanyCompleteness = (company) => {
  if (!company) return false;

  const requiredFields = ["name", "email", "phone", "location", "industry"];
  const hasRequired = requiredFields.every(
    (field) => company[field] && company[field].toString().trim() !== "",
  );
  const hasDescription =
    company.description && company.description.length >= 50;

  // ✅ Return boolean, not string
  return hasRequired && hasDescription;
};

// Get public company profile (accessible by any authenticated user)
export const getPublicCompanyProfile = async (req, res) => {
  try {
    const { recruiterId } = req.params;

    const recruiter = await User.findById(recruiterId).select(
      "name company isCompanyComplete",
    );

    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const cleanedCompany = cleanCompanyData(recruiter.company);

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

// Get company profile
export const getCompanyProfile = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can access company profile",
      });
    }

    const user = await User.findById(req.user._id).select(
      "name email phone avatar company isCompanyComplete",
    );

    // ✅ Clean company data before sending
    const cleanedCompany = cleanCompanyData(user.company);

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          avatar: user.avatar || "",
        },
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
        isComplete: user.isCompanyComplete || false,
      },
    });
  } catch (error) {
    console.error("Get company profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update company profile
export const updateCompanyProfile = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can update company profile",
      });
    }

    let companyData = req.body;

    // ✅ Clean incoming company data
    companyData = cleanCompanyData(companyData) || companyData;

    // Get current user to preserve existing fields
    const currentUser = await User.findById(req.user._id);
    const currentCompany = cleanCompanyData(currentUser.company) || {};

    // Merge new data with existing data
    const mergedCompany = {
      name: companyData.name || currentCompany.name || "",
      logo: companyData.logo || currentCompany.logo || "",
      logoPublicId:
        companyData.logoPublicId || currentCompany.logoPublicId || "",
      email: companyData.email || currentCompany.email || "",
      phone: companyData.phone || currentCompany.phone || "",
      website: companyData.website || currentCompany.website || "",
      location: companyData.location || currentCompany.location || "",
      founded: companyData.founded || currentCompany.founded || "",
      size: companyData.size || currentCompany.size || "",
      industry: companyData.industry || currentCompany.industry || "",
      description: companyData.description || currentCompany.description || "",
      mission: companyData.mission || currentCompany.mission || "",
      vision: companyData.vision || currentCompany.vision || "",
      socialLinks: {
        linkedin:
          companyData.socialLinks?.linkedin ||
          currentCompany.socialLinks?.linkedin ||
          "",
        twitter:
          companyData.socialLinks?.twitter ||
          currentCompany.socialLinks?.twitter ||
          "",
        github:
          companyData.socialLinks?.github ||
          currentCompany.socialLinks?.github ||
          "",
      },
      benefits: companyData.benefits || currentCompany.benefits || [],
      culture: companyData.culture || currentCompany.culture || "",
    };

    // ✅ Check if company profile is complete - returns boolean, not string
    const isComplete = checkCompanyCompleteness(mergedCompany);

    // ✅ Update - isCompanyComplete should be boolean, not string
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          company: mergedCompany,
          isCompanyComplete: isComplete, // ✅ boolean value
        },
      },
      { new: true, runValidators: false },
    ).select("company isCompanyComplete name email phone avatar");

    // ✅ Clean response data
    const cleanedResponseCompany = cleanCompanyData(user.company);

    res.json({
      success: true,
      data: {
        company: cleanedResponseCompany,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
        },
      },
      isComplete: user.isCompanyComplete,
      message: isComplete
        ? "Company profile completed successfully! 🎉"
        : "Company profile updated successfully",
    });
  } catch (error) {
    console.error("Update company profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload company logo
export const uploadCompanyLogo = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can upload company logo",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Get current user to delete old logo if exists
    const currentUser = await User.findById(req.user._id);
    const oldLogoPublicId = currentUser.company?.logoPublicId;

    // Delete old logo from Cloudinary if exists
    if (oldLogoPublicId) {
      try {
        await deleteFromCloudinary(oldLogoPublicId);
        console.log("Old logo deleted:", oldLogoPublicId);
      } catch (err) {
        console.warn("Failed to delete old logo:", err.message);
      }
    }

    // Upload to Cloudinary
    let result = null;
    try {
      result = await uploadToCloudinary(req.file.buffer, {
        folder: getCloudinaryFolder("logo"),
        resource_type: "image",
        public_id: `logo-${Date.now()}`,
      });
    } catch (cloudError) {
      console.error("Cloudinary upload failed:", cloudError);
      return res.status(500).json({
        success: false,
        message: "Failed to upload logo to cloud storage",
      });
    }

    // Update ONLY logo fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          "company.logo": result.secure_url,
          "company.logoPublicId": result.public_id,
        },
      },
      { new: true },
    );

    // ✅ Clean company data for response
    const cleanedCompany = cleanCompanyData(updatedUser.company);

    res.json({
      success: true,
      data: {
        logoUrl: cleanedCompany?.logo || "",
        logoPublicId: cleanedCompany?.logoPublicId || "",
      },
      message: "Logo uploaded successfully",
    });
  } catch (error) {
    console.error("Upload logo error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get company stats
export const getCompanyStats = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can access company stats",
      });
    }

    const jobs = await Job.find({ recruiterId: req.user._id });
    const jobIds = jobs.map((job) => job._id);
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

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = monthNames[5 - i];
      const count = applications.filter(
        (a) =>
          a.createdAt &&
          a.createdAt.getMonth() === date.getMonth() &&
          a.createdAt.getFullYear() === date.getFullYear(),
      ).length;
      monthlyData.push({ month: monthName, applications: count });
    }

    res.json({
      success: true,
      data: {
        stats,
        chartData: monthlyData,
      },
    });
  } catch (error) {
    console.error("Get company stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
