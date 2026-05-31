import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "./src/models/User.js";
import { updateCompanyProfile } from "./src/controllers/companyController.js";

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");
  const user = await User.findOne({ role: "recruiter" });
  if (!user) {
    console.log("No recruiter found");
    process.exit(0);
  }
  
  const req = {
    user: { _id: user._id, role: "recruiter" },
    body: {
      name: "Test Update",
      logo: "",
      email: "test@test.com",
      phone: "",
      website: "",
      location: "",
      founded: "",
      size: "",
      industry: "Tech",
      description: "Test description that is quite long so it passes the completion check maybe? Let's see if this reaches 50 characters, surely it does by now.",
      mission: "",
      vision: "",
      culture: "",
      benefits: [],
      socialLinks: {
        linkedin: "",
        twitter: "",
        github: "",
      },
    }
  };
  
  const res = {
    json: (data) => console.log("RES.JSON:", JSON.stringify(data)),
    status: (code) => {
      console.log("RES.STATUS", code);
      return {
        json: (data) => console.log("RES.STATUS.JSON", code, JSON.stringify(data))
      }
    }
  };
  
  await updateCompanyProfile(req, res);
  process.exit(0);
}
test();
