// server/src/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Log what we're trying to configure (without exposing secrets)
console.log("🔧 Configuring Cloudinary with:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "MISSING",
  api_key: process.env.CLOUDINARY_API_KEY ? "✅ Present" : "❌ MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ Present" : "❌ MISSING",
});

// Check if credentials exist
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("❌ Cloudinary credentials missing from .env file!");
  console.error(
    "Please add: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
  );
} else {
  // Configure Cloudinary with individual keys
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Always use HTTPS
  });

  console.log("✅ Cloudinary configured successfully");
}

export default cloudinary;
