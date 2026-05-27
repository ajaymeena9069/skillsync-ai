import dotenv from "dotenv";
import mongoose from "mongoose";
import Job from "./src/models/Job.js";

dotenv.config();

const fixJobData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Fix the typo "reac" -> "React"
    const result = await Job.updateMany(
      { requiredSkills: "reac" },
      { $set: { "requiredSkills.$": "React" } }
    );

    console.log(`✅ Fixed ${result.modifiedCount} jobs with "reac" typo`);

    // Update all skills to proper capitalization
    const jobs = await Job.find({});
    
    for (const job of jobs) {
      const fixedSkills = job.requiredSkills.map(skill => {
        const skillMap = {
          'reac': 'React',
          'react': 'React',
          'node': 'Node.js',
          'nodejs': 'Node.js',
          'html': 'HTML',
          'css': 'CSS',
          'js': 'JavaScript',
          'javascript': 'JavaScript',
          'ts': 'TypeScript',
          'typescript': 'TypeScript',
          'tailwind': 'Tailwind CSS',
          'bootstrap': 'Bootstrap',
          'redux': 'Redux',
          'git': 'Git',
          'github': 'GitHub',
          'docker': 'Docker',
          'mongodb': 'MongoDB',
          'express': 'Express.js',
          'expressjs': 'Express.js',
        };
        
        return skillMap[skill.toLowerCase()] || skill;
      });

      // Remove duplicates
      const uniqueSkills = [...new Set(fixedSkills)];

      await Job.findByIdAndUpdate(job._id, {
        requiredSkills: uniqueSkills
      });
    }

    console.log(`✅ Fixed skill capitalization for ${jobs.length} jobs`);

    // Update salary if needed (optional - only if you want to change it)
    // await Job.updateOne(
    //   { _id: "6a0c7bc6e0c892087f9ad656" },
    //   {
    //     salaryMin: 30000,
    //     salaryMax: 60000
    //   }
    // );
    // console.log("✅ Updated salary range");

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixJobData();
