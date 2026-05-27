// backend/src/controllers/resumeController.js
import User from "../models/User.js";
import Resume from "../models/Resume.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getCloudinaryFolder,
  getResourceType,
} from "../middleware/uploadMiddleware.js";
import {
  extractTextFromPDF,
  extractTextFromDOCX,
  extractSkillsWithAI,
} from "../services/resumeParserService.js";

// Upload and parse resume
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const userId = req.user._id;
    const file = req.file;

    console.log("📄 File received:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    });

    const fileBuffer = file.buffer;

    // Step 1: Extract text from file
    let extractedText = "";
    try {
      if (file.mimetype === "application/pdf") {
        extractedText = await extractTextFromPDF(fileBuffer);
      } else {
        extractedText = await extractTextFromDOCX(fileBuffer);
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("No text could be extracted from the file");
      }

      console.log("📝 Text extracted:", extractedText.length, "chars");
    } catch (extractError) {
      console.error("Text extraction failed:", extractError.message);
      return res.status(422).json({
        success: false,
        message: `Could not extract text: ${extractError.message}`,
      });
    }

    // Step 2: Extract skills using AI
    let parsedData;
    try {
      parsedData = await extractSkillsWithAI(extractedText, req.user.email);
      console.log("🎯 Skills extracted:", parsedData.skills?.length || 0);
    } catch (aiError) {
      console.error("AI extraction failed:", aiError.message);
      parsedData = {
        skills: [],
        experience: "Not specified",
        education: [],
        projects: [],
      };
    }

    // Step 3: Find existing active resume
    const existingResume = await Resume.findOne({
      userId,
      isActive: true,
    });

    // Step 4: Delete old Cloudinary file if exists
    if (existingResume?.cloudinaryId) {
      try {
        await deleteFromCloudinary(existingResume.cloudinaryId, {
          resource_type: "raw",
        });
        console.log(
          "🗑️ Deleted old Cloudinary file:",
          existingResume.cloudinaryId,
        );
      } catch (cloudinaryError) {
        console.warn(
          "⚠️ Failed to delete old Cloudinary file:",
          cloudinaryError.message,
        );
      }
    }

    // Step 5: Upload new file to Cloudinary
    let cloudinaryResult = null;
    try {
      cloudinaryResult = await uploadToCloudinary(fileBuffer, {
        folder: getCloudinaryFolder("resume"),
        resource_type: getResourceType(file.mimetype),
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
      });

      if (cloudinaryResult) {
        console.log("☁️ Uploaded to Cloudinary:", cloudinaryResult.secure_url);
      }
    } catch (cloudinaryError) {
      console.warn("⚠️ Cloudinary upload failed:", cloudinaryError.message);
      // Continue without Cloudinary - we still have the parsed data
    }

    // Step 6: Save/Update resume in database
    let resume;
    if (existingResume) {
      console.log("📝 Updating existing resume for user:", userId);

      existingResume.originalName = file.originalname;
      existingResume.fileUrl = cloudinaryResult?.secure_url || "";
      existingResume.cloudinaryId = cloudinaryResult?.public_id || "";
      existingResume.extractedText = extractedText.substring(0, 5000);
      existingResume.parsedSkills = parsedData.skills || [];
      existingResume.experience = parsedData.experience || "Not specified";
      existingResume.education = parsedData.education || [];
      existingResume.projects = parsedData.projects || [];
      existingResume.isActive = true;

      resume = await existingResume.save();
      console.log("✅ Resume updated with ID:", resume._id);
    } else {
      console.log("📝 Creating new resume for user:", userId);

      resume = await Resume.create({
        userId,
        originalName: file.originalname,
        fileUrl: cloudinaryResult?.secure_url || "",
        cloudinaryId: cloudinaryResult?.public_id || "",
        extractedText: extractedText.substring(0, 5000),
        parsedSkills: parsedData.skills || [],
        experience: parsedData.experience || "Not specified",
        education: parsedData.education || [],
        projects: parsedData.projects || [],
        isActive: true,
      });
      console.log("✅ Resume created with ID:", resume._id);
    }

    // Step 7: Ensure only this resume is active
    await Resume.updateMany(
      {
        userId,
        _id: { $ne: resume._id },
      },
      { isActive: false },
    );

    // Step 8: Update user with new skills and resume info
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { skills: { $each: parsedData.skills || [] } },
        resumeUrl: cloudinaryResult?.secure_url || "",
        parsedResume: {
          experience: parsedData.experience || "Not specified",
          education: parsedData.education || [],
          projects: parsedData.projects || [],
        },
      },
      { new: true },
    ).select("-password");

    // Step 9: Send success response
    res.status(200).json({
      success: true,
      message: existingResume
        ? "Resume updated successfully"
        : "Resume uploaded successfully",
      data: {
        skills: parsedData.skills || [],
        experience: parsedData.experience || "Not specified",
        education: parsedData.education || [],
        projects: parsedData.projects || [],
        resumeUrl: cloudinaryResult?.secure_url || "",
      },
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);

    if (error.name === "ValidationError") {
      return res.status(422).json({
        success: false,
        message: `Validation failed: ${Object.values(error.errors)
          .map((e) => e.message)
          .join(", ")}`,
      });
    }

    res.status(500).json({
      success: false,
      message: `Failed to process resume: ${error.message}`,
    });
  }
};

// Get user's resume data
export const getResumeData = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (!resume) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No resume found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: resume._id,
        skills: resume.parsedSkills || [],
        experience: resume.experience || "Not specified",
        education: resume.education || [],
        projects: resume.projects || [],
        fileUrl: resume.fileUrl,
        originalName: resume.originalName,
        uploadedAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get resume error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete resume
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    // Delete from Cloudinary if exists
    if (resume.cloudinaryId) {
      try {
        await deleteFromCloudinary(resume.cloudinaryId, {
          resource_type: "raw",
        });
        console.log("🗑️ Deleted from Cloudinary:", resume.cloudinaryId);
      } catch (cloudinaryError) {
        console.warn("⚠️ Cloudinary delete failed:", cloudinaryError.message);
      }
    }

    // Soft delete - mark as inactive
    resume.isActive = false;
    await resume.save();

    // Clear user's resume data
    await User.findByIdAndUpdate(req.user._id, {
      $set: {
        skills: [],
        resumeUrl: "",
        parsedResume: null,
      },
    });

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get resume file URL (for downloading)
export const getResumeFile = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (!resume || !resume.fileUrl) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.json({
      success: true,
      data: {
        fileUrl: resume.fileUrl,
        originalName: resume.originalName,
      },
    });
  } catch (error) {
    console.error("Get resume file error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
