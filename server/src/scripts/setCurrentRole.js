// backend/src/scripts/setCurrentRole.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Get the directory path correctly for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from the server root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// ✅ Also try to load from current directory
dotenv.config();

console.log("Checking environment variables...");
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log(
  "MONGODB_URI value:",
  process.env.MONGODB_URI?.substring(0, 50) + "...",
);

const setCurrentRole = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Update recruiters without currentRole
    const recruiterResult = await User.updateMany(
      {
        role: "recruiter",
        $or: [{ currentRole: { $exists: false } }, { currentRole: "" }],
      },
      { $set: { currentRole: "Recruiter" } },
    );
    console.log(`✅ Updated ${recruiterResult.modifiedCount} recruiters`);

    // Update users (job seekers) without currentRole
    const userResult = await User.updateMany(
      {
        role: "jobseeker",
        $or: [{ currentRole: { $exists: false } }, { currentRole: "" }],
      },
      { $set: { currentRole: "Job Seeker" } },
    );
    console.log(`✅ Updated ${userResult.modifiedCount} job seekers`);

    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

// Import User model after connection
import User from "../models/User.js";

setCurrentRole();
