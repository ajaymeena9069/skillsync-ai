// backend/src/controllers/jobSeekerController.js
import User from "../models/User.js";
import Application from "../models/Application.js";

// ==================== PROFILE MANAGEMENT ====================

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        currentRole: user.currentRole || "",
        experience: user.experience || "",
        skills: user.skills || [],
        resumeUrl: user.resumeUrl || "",
        parsedResume: user.parsedResume || null,
        preferredJobType: user.preferredJobType || "full-time",
        expectedSalary: user.expectedSalary || "",
        socialLinks: user.socialLinks || {
          linkedin: "",
          github: "",
          portfolio: "",
        },
        isProfileComplete: user.isProfileComplete || false,
        profileViews: user.profileViews || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "location",
      "bio",
      "currentRole",
      "experience",
      "skills",
      "preferredJobType",
      "expectedSalary",
      "socialLinks",
    ];

    const updateData = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    // Check profile completeness - return BOOLEAN, not string
    const currentUser = await User.findById(req.user._id);
    const updatedData = { ...currentUser.toObject(), ...updateData };

    const isComplete = !!(
      updatedData.name &&
      updatedData.name.trim() !== "" &&
      updatedData.phone &&
      updatedData.phone.trim() !== "" &&
      updatedData.location &&
      updatedData.location.trim() !== "" &&
      updatedData.currentRole &&
      updatedData.currentRole.trim() !== "" &&
      updatedData.experience &&
      updatedData.experience !== "" &&
      updatedData.experience !== "0 years" &&
      updatedData.skills &&
      Array.isArray(updatedData.skills) &&
      updatedData.skills.length >= 3
    );

    // ✅ Set as BOOLEAN, not string
    updateData.isProfileComplete = isComplete;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: false },
    ).select("-password");

    // Return consistent response structure
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        currentRole: user.currentRole || "",
        experience: user.experience || "",
        skills: user.skills || [],
        resumeUrl: user.resumeUrl || "",
        parsedResume: user.parsedResume || null,
        preferredJobType: user.preferredJobType || "full-time",
        expectedSalary: user.expectedSalary || "",
        socialLinks: user.socialLinks || {
          linkedin: "",
          github: "",
          portfolio: "",
        },
        isProfileComplete: user.isProfileComplete || false,
        profileViews: user.profileViews || 0,
      },
      message: isComplete
        ? "Profile completed! 🎉"
        : "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== RESUME MANAGEMENT ====================

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const { uploadToCloudinary } =
      await import("../middleware/uploadMiddleware.js");
    const { parseResumeWithAI } =
      await import("../services/resumeParserService.js");

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "skillsync/resumes",
      resource_type: "auto",
    });

    const parsedData = await parseResumeWithAI(req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          resumeUrl: result.secure_url,
          resumePublicId: result.public_id,
          parsedResume: parsedData,
          skills: parsedData.skills || [],
        },
      },
      { new: true },
    ).select("-password");

    res.json({
      success: true,
      data: {
        resumeUrl: user.resumeUrl,
        parsedResume: user.parsedResume,
        skills: user.skills,
      },
      message: "Resume uploaded and parsed successfully",
    });
  } catch (error) {
    console.error("Upload resume error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "resumeUrl parsedResume",
    );
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== JOB APPLICATIONS ====================

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate("jobId", "title company location salary type")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplicationStats = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id });

    const stats = {
      total: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      reviewed: applications.filter((a) => a.status === "reviewed").length,
      shortlisted: applications.filter((a) => a.status === "shortlisted")
        .length,
      rejected: applications.filter((a) => a.status === "rejected").length,
      hired: applications.filter((a) => a.status === "hired").length,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
