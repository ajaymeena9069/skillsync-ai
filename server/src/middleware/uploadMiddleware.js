// backend/src/middleware/uploadMiddleware.js - Make sure these exports exist
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    resume: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    image: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  };

  let isAllowed = false;

  if (file.fieldname === "resume") {
    isAllowed = allowedTypes.resume.includes(file.mimetype);
  } else if (file.fieldname === "avatar" || file.fieldname === "logo") {
    isAllowed = allowedTypes.image.includes(file.mimetype);
  } else {
    isAllowed = allowedTypes.image.includes(file.mimetype);
  }

  if (isAllowed) {
    cb(null, true);
  } else {
    const errorMessage =
      file.fieldname === "resume"
        ? "Only PDF and DOC files are allowed for resume"
        : "Only JPEG, PNG, GIF, and WEBP images are allowed";
    cb(new Error(errorMessage), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});

export const uploadResume = upload.single("resume");
export const uploadAvatar = upload.single("avatar");
export const uploadCompanyLogo = upload.single("logo");

// Cloudinary helper functions
export const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.warn("⚠️ Cloudinary not configured");
      return resolve(null);
    }

    const { folder = "skillsync", resource_type = "auto", public_id } = options;

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type, public_id },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId, options = {}) => {
  try {
    if (!publicId) return null;
    const { resource_type = "image" } = options;
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    return null;
  }
};

export const getCloudinaryFolder = (purpose) => {
  const folders = {
    resume: "skillsync/resumes",
    avatar: "skillsync/avatars",
    logo: "skillsync/logos",
    default: "skillsync/uploads",
  };
  return folders[purpose] || folders.default;
};

export const getResourceType = (mimetype) => {
  if (mimetype.includes("pdf")) return "raw";
  if (mimetype.includes("word")) return "raw";
  if (mimetype.includes("image")) return "image";
  return "auto";
};
