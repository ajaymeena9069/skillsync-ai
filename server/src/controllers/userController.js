// backend/src/controllers/userController.js
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Common fields for both roles
    let profileData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || "",
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
      isProfileComplete: user.isProfileComplete || false,
    };

    // ✅ Role-specific data - DON'T mix them!
    if (user.role === "jobseeker") {
      // Job Seeker - NO company field
      profileData = {
        ...profileData,
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
        // ❌ NO company field for job seekers
      };
    } else if (user.role === "recruiter") {
      // Recruiter - NO candidate fields
      profileData = {
        ...profileData,
        company: user.company || {},
        isCompanyComplete: user.isCompanyComplete || false,
        // ❌ NO skills, currentRole, experience, etc. for recruiters
      };
    }

    res.json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };

    // Allowed fields for update
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

    // Filter only allowed fields
    Object.keys(updateData).forEach((key) => {
      if (!allowedFields.includes(key)) delete updateData[key];
    });

    // Check if profile is complete
    const currentUser = await User.findById(userId);
    const updatedUserData = { ...currentUser.toObject(), ...updateData };
    const isComplete = checkProfileCompleteness(updatedUserData);
    updateData.isProfileComplete = isComplete;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");

    res.json({
      success: true,
      data: user,
      message:
        isComplete && !currentUser.isProfileComplete
          ? "Profile completed successfully! 🎉"
          : "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to check profile completeness
const checkProfileCompleteness = (userData) => {
  const requiredFields = [
    "name",
    "phone",
    "location",
    "currentRole",
    "experience",
  ];

  const hasRequired = requiredFields.every(
    (field) => userData[field] && userData[field].toString().trim() !== "",
  );

  const hasSkills = userData.skills && userData.skills.length >= 3;

  return hasRequired && hasSkills;
};

// Update skills only
export const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { skills } },
      { new: true },
    ).select("-password");

    res.json({
      success: true,
      data: user.skills,
      message: "Skills updated successfully",
    });
  } catch (error) {
    console.error("Update skills error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Get current user to check for old avatar
    const currentUser = await User.findById(req.user._id).select(
      "avatar avatarPublicId",
    );

    // Delete old avatar from Cloudinary if it exists
    if (currentUser?.avatarPublicId) {
      try {
        const { deleteFromCloudinary } = await import(
          "../middleware/uploadMiddleware.js"
        );
        await deleteFromCloudinary(currentUser.avatarPublicId, {
          resource_type: "image",
        });
      } catch (deleteError) {
        console.warn("Failed to delete old avatar from Cloudinary:", deleteError.message);
      }
    }

    // Upload new avatar to Cloudinary
    const { uploadToCloudinary } = await import(
      "../middleware/uploadMiddleware.js"
    );
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "skillsync/avatars",
      resource_type: "image",
    });

    if (!result) {
      return res.status(500).json({
        success: false,
        message:
          "Cloudinary upload failed — check your Cloudinary configuration",
      });
    }

    const avatarUrl = result.secure_url;
    const avatarPublicId = result.public_id;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          avatar: avatarUrl,
          avatarPublicId: avatarPublicId,
        },
      },
      { new: true },
    ).select("-password");

    res.json({
      success: true,
      data: { avatar: user.avatar },
      message: "Avatar uploaded successfully",
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
