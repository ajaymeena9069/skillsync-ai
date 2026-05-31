import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "server/.env" });

import User from "./src/models/User.js";

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ role: "recruiter" });
  if (!user) {
    console.log("No recruiter found");
    return;
  }
  
  const currentCompany = user.company || {};
  const newData = {};
  
  const mergedCompany = {
      name: newData.name || currentCompany.name,
      logo: newData.logo || currentCompany.logo,
      logoPublicId: newData.logoPublicId || currentCompany.logoPublicId,
      email: newData.email || currentCompany.email,
      phone: newData.phone || currentCompany.phone,
      website: newData.website || currentCompany.website,
      location: newData.location || currentCompany.location,
      founded: newData.founded || currentCompany.founded,
      size: newData.size || currentCompany.size,
      industry: newData.industry || currentCompany.industry,
      description: newData.description || currentCompany.description,
      mission: newData.mission || currentCompany.mission,
      vision: newData.vision || currentCompany.vision,
      socialLinks: {
        linkedin:
          newData.socialLinks?.linkedin || currentCompany.socialLinks?.linkedin,
        twitter:
          newData.socialLinks?.twitter || currentCompany.socialLinks?.twitter,
        github:
          newData.socialLinks?.github || currentCompany.socialLinks?.github,
      },
      benefits: newData.benefits || currentCompany.benefits,
      culture: newData.culture || currentCompany.culture,
    };
    
    try {
      const result = await User.findByIdAndUpdate(
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
    } catch (e) {
      console.log("Error:", e.message);
    }
  process.exit(0);
}

test();
