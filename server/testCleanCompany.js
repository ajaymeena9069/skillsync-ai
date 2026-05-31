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
    body: { name: "Test Clean" }
  };
  
  const res = {
    json: (data) => console.log("RES.JSON:", JSON.stringify(data)),
    status: (code) => ({
      json: (data) => console.log("RES.STATUS", code, JSON.stringify(data))
    })
  };
  
  await updateCompanyProfile(req, res);
  process.exit(0);
}
test();
