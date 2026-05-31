// server/src/controllers/commonController.js - IMPROVED VERSION
import User from "../models/User.js";
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const { uploadToCloudinary, deleteFromCloudinary } =
      await import("../middleware/uploadMiddleware.js");

    // Get current user to delete old avatar
    const currentUser = await User.findById(req.user._id);
    const oldAvatarPublicId = currentUser.avatarPublicId;

    // Delete old avatar if exists
    if (oldAvatarPublicId) {
      try {
        await deleteFromCloudinary(oldAvatarPublicId);
        console.log("Old avatar deleted:", oldAvatarPublicId);
      } catch (err) {
        console.warn("Failed to delete old avatar:", err.message);
      }
    }

    // Upload new avatar
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "skillsync/avatars",
    });

    // Update user with new avatar
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          avatar: result.secure_url,
          avatarPublicId: result.public_id,
        },
      },
      { new: true },
    ).select("-password");

    res.json({
      success: true,
      data: {
        avatar: user.avatar,
        avatarPublicId: user.avatarPublicId,
      },
      message: oldAvatarPublicId
        ? "Avatar updated successfully"
        : "Avatar uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Avatar only
export const deleteAvatar = async (req, res) => {
  try {
    const { deleteFromCloudinary } =
      await import("../middleware/uploadMiddleware.js");

    const user = await User.findById(req.user._id);

    if (!user.avatarPublicId) {
      return res
        .status(400)
        .json({ success: false, message: "No avatar to delete" });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(user.avatarPublicId);

    // Remove from database
    user.avatar = "";
    user.avatarPublicId = "";
    await user.save();

    res.json({
      success: true,
      message: "Avatar deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Public Stats for Landing Page
export const getPublicStats = async (req, res) => {
  try {
    const { default: Job } = await import("../models/Job.js");
    const { default: Application } = await import("../models/Application.js");

    const totalJobs = await Job.countDocuments();
    const totalCandidates = await User.countDocuments({ role: "jobseeker" });
    const totalCompanies = await User.countDocuments({ role: "recruiter" });
    const totalApplications = await Application.countDocuments();

    res.json({
      success: true,
      data: {
        jobs: totalJobs,
        candidates: totalCandidates,
        companies: totalCompanies,
        applications: totalApplications,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
