// backend/src/services/jobMatchingService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import Resume from "../models/Resume.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Make sure this is exported
export const calculateMatchScore = (
  userSkills,
  jobRequiredSkills,
  jobPreferredSkills = [],
) => {
  if (!userSkills?.length || !jobRequiredSkills?.length) {
    return 0;
  }

  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());
  const normalizedRequired = jobRequiredSkills.map((s) =>
    s.toLowerCase().trim(),
  );
  const normalizedPreferred = jobPreferredSkills.map((s) =>
    s.toLowerCase().trim(),
  );

  // Required skills: 70% weight
  const requiredMatches = normalizedRequired.filter((skill) =>
    normalizedUserSkills.some(
      (userSkill) => userSkill.includes(skill) || skill.includes(userSkill),
    ),
  );
  const requiredScore =
    (requiredMatches.length / normalizedRequired.length) * 70;

  // Preferred skills: 30% weight
  let preferredScore = 0;
  if (normalizedPreferred.length > 0) {
    const preferredMatches = normalizedPreferred.filter((skill) =>
      normalizedUserSkills.some(
        (userSkill) => userSkill.includes(skill) || skill.includes(userSkill),
      ),
    );
    preferredScore =
      (preferredMatches.length / normalizedPreferred.length) * 30;
  }

  return Math.min(100, Math.round(requiredScore + preferredScore));
};

// AI availability flags
let aiAvailable = true;
let lastQuotaErrorTime = 0;
const QUOTA_COOLDOWN_MS = 60 * 1000; // 1 minute cooldown

export const getAIMatchAnalysis = async (userResume, job, retries = 2) => {
  // Check if we're in cooldown period after quota error
  if (!aiAvailable && Date.now() - lastQuotaErrorTime < QUOTA_COOLDOWN_MS) {
    console.log("AI temporarily unavailable, using fallback calculation");
    return getFallbackAnalysis(userResume, job);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an AI career matching expert. Analyze this candidate and job posting.

      CANDIDATE DATA:
      Skills: ${userResume.parsedSkills?.join(", ") || "Not specified"}
      Experience: ${userResume.experience || "Not specified"}
      Education: ${JSON.stringify(userResume.education || [])}
      Projects: ${JSON.stringify(userResume.projects || [])}

      JOB POSTING:
      Title: ${job.title}
      Required Skills: ${job.requiredSkills?.join(", ")}
      Preferred Skills: ${job.preferredSkills?.join(", ") || "None"}
      Experience Level: ${job.experienceLevel}
      Description: ${job.description?.substring(0, 500) || ""}

      Provide a JSON response with:
      1. matchScore (0-100)
      2. strengthMatches (array of 3-5 skills where candidate excels)
      3. gapSkills (array of missing required skills)
      4. recommendations (2-3 actionable suggestions to improve match)
      5. fitAnalysis (1-2 sentence summary)

      Return ONLY valid JSON.
    `;

    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("AI request timed out after 45s")),
          45000,
        ),
      ),
    ]);

    const response = result.response.text();
    const cleanJson = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "");
    const analysis = JSON.parse(cleanJson);

    // Reset AI availability flag on success
    aiAvailable = true;
    return analysis;
  } catch (error) {
    console.error("AI match analysis error:", error.message);

    // If it's a 503 or 500 error, retry up to `retries` times
    if (retries > 0 && (error.message?.includes("503") || error.message?.includes("500") || error.message?.includes("timed out"))) {
      console.log(`Retrying AI analysis... (${retries} retries left)`);
      // Wait for 2 seconds before retrying to let traffic settle
      await new Promise(resolve => setTimeout(resolve, 2000));
      return getAIMatchAnalysis(userResume, job, retries - 1);
    }

    // Check if it's a quota error (429)
    if (
      error.status === 429 ||
      error.message?.includes("quota") ||
      error.message?.includes("429")
    ) {
      aiAvailable = false;
      lastQuotaErrorTime = Date.now();
      console.log("AI quota exceeded, switching to fallback mode");
    }

    return getFallbackAnalysis(userResume, job);
  }
};

// Fallback analysis when AI is unavailable
const getFallbackAnalysis = (userResume, job) => {
  const basicScore = calculateMatchScore(
    userResume.parsedSkills,
    job.requiredSkills,
    job.preferredSkills,
  );

  const matchedSkills =
    userResume.parsedSkills?.filter((skill) =>
      job.requiredSkills?.some((req) =>
        req.toLowerCase().includes(skill.toLowerCase()),
      ),
    ) || [];

  const missingSkills =
    job.requiredSkills?.filter(
      (req) =>
        !userResume.parsedSkills?.some((skill) =>
          skill.toLowerCase().includes(req.toLowerCase()),
        ),
    ) || [];

  let fitAnalysis = "";
  let recommendations = [];

  if (basicScore >= 80) {
    fitAnalysis = `Strong match! Candidate's skills align well with ${job.title} requirements.`;
    recommendations = [
      "Schedule a technical interview this week",
      "Prepare questions about their key strengths",
      "Consider for immediate hiring process",
    ];
  } else if (basicScore >= 60) {
    fitAnalysis = `Good potential match. Candidate has foundational skills for ${job.title}.`;
    recommendations = [
      "Schedule an initial screening call",
      "Discuss willingness to learn missing skills",
      "Assess practical experience during interview",
    ];
  } else if (basicScore >= 40) {
    fitAnalysis = `Moderate fit. Candidate has some relevant skills but gaps exist.`;
    recommendations = [
      "Consider for junior or training positions",
      "Assess learning ability during interview",
      "Review portfolio for practical skills",
    ];
  } else {
    fitAnalysis = `Low match. Candidate may not be suitable for this role.`;
    recommendations = [
      "Keep profile for future opportunities",
      "Consider for different positions",
      "Suggest skill development programs",
    ];
  }

  return {
    matchScore: basicScore,
    strengthMatches: matchedSkills.slice(0, 5),
    gapSkills: missingSkills.slice(0, 5),
    recommendations,
    fitAnalysis,
  };
};

// Get matched jobs for a user
export const getMatchedJobs = async (userId, jobs, limit = 10) => {
  const resume = await Resume.findOne({ userId, isActive: true });

  if (!resume || !resume.parsedSkills?.length) {
    return jobs.map((job) => ({
      job,
      matchScore: 0,
      matchingSkills: [],
      missingSkills: job.requiredSkills || [],
    }));
  }

  const matchedJobs = [];

  for (const job of jobs) {
    const matchScore = calculateMatchScore(
      resume.parsedSkills,
      job.requiredSkills,
      job.preferredSkills,
    );

    const matchingSkills = job.requiredSkills.filter((req) =>
      resume.parsedSkills.some((skill) =>
        skill.toLowerCase().includes(req.toLowerCase()),
      ),
    );

    const missingSkills = job.requiredSkills.filter(
      (req) =>
        !resume.parsedSkills.some((skill) =>
          skill.toLowerCase().includes(req.toLowerCase()),
        ),
    );

    matchedJobs.push({
      job,
      matchScore,
      matchingSkills,
      missingSkills,
    });
  }

  // Sort by match score descending
  return matchedJobs
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};
