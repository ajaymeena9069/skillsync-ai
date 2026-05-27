import express from "express";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.get("/cloudinary-status", (req, res) => {
  res.json({
    success: true,
    configured: !!process.env.CLOUDINARY_CLOUD_NAME,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "not set",
  });
});

router.post("/cloudinary-test", async (req, res) => {
  try {
    // Create a simple text file as buffer
    const testBuffer = Buffer.from(
      `Cloudinary test at ${new Date().toISOString()}`,
    );

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "skillsync/test",
          resource_type: "raw",
          public_id: `test-${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(testBuffer);
    });

    res.json({
      success: true,
      message: "Cloudinary upload successful!",
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary test error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
