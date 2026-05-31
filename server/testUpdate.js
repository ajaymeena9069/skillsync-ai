import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "./src/models/User.js";

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");
  const user = await User.findOne({ role: "recruiter" });
  if (!user) {
    console.log("No recruiter found");
    process.exit(0);
  }
  
  const mergedCompany = {
    name: "Test",
    logo: "",
    logoPublicId: "",
    email: "test@test.com",
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
    culture: ""
  };
  
  try {
    const updated = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          company: mergedCompany,
          isCompanyComplete: false,
        },
      },
      { new: true }
    );
    console.log("Success");
  } catch(e) {
    console.log("Error:", e);
  }
  process.exit(0);
}
test();
