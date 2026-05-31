// backend/src/services/aiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI availability tracking
let aiAvailable = true;
let lastQuotaErrorTime = 0;
const QUOTA_COOLDOWN_MS = 60 * 1000;

/**
 * Analyze skill gaps between user's skills and target job requirements
 * Uses Gemini AI with intelligent fallback
 */
export const analyzeSkillGap = async (userSkills, targetJobs) => {
  // Check cooldown
  if (!aiAvailable && Date.now() - lastQuotaErrorTime < QUOTA_COOLDOWN_MS) {
    console.log("AI temporarily unavailable, using fallback for skill gap");
    return getFallbackSkillGap(userSkills, targetJobs);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const jobSkillsSet = new Set();
    const jobPreferredSet = new Set();
    targetJobs.forEach((job) => {
      (job.requiredSkills || []).forEach((s) => jobSkillsSet.add(s));
      (job.preferredSkills || []).forEach((s) => jobPreferredSet.add(s));
    });

    const prompt = `
      You are an AI career advisor. Analyze the skill gap between a candidate's current skills and job market demands.

      CANDIDATE SKILLS: ${userSkills.join(", ")}

      TARGET JOB REQUIRED SKILLS: ${[...jobSkillsSet].join(", ")}
      TARGET JOB PREFERRED SKILLS: ${[...jobPreferredSet].join(", ")}

      Provide a JSON response with:
      {
        "currentSkills": [
          { "name": "SkillName", "level": 0-100, "category": "Frontend|Backend|DevOps|Database|Languages|Tools|Cloud|Mobile|AI/ML|Design" }
        ],
        "missingSkills": [
          { "name": "SkillName", "importance": "High|Medium|Low", "demand": 0-100, "category": "..." }
        ],
        "recommendations": [
          {
            "skill": "SkillName",
            "resources": [
              { "type": "Course|Video|Article|Practice", "title": "Resource title", "platform": "Platform name", "duration": "Xh", "url": "" }
            ]
          }
        ],
        "marketReadiness": 0-100,
        "summary": "Brief 2-sentence summary of the analysis"
      }

      Rules:
      - Rate current skills based on how relevant they are to the target jobs (not absolute proficiency)
      - Missing skills should be ones the candidate doesn't have but jobs require
      - Importance: High = required by most jobs, Medium = required by some, Low = nice-to-have
      - Demand = percentage of target jobs that need this skill
      - Include 3-5 top recommendations with 2-3 resources each
      - Market readiness = overall fit percentage considering all factors

      Return ONLY valid JSON, no markdown.
    `;

    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI request timed out")), 15000),
      ),
    ]);

    const response = result.response.text();
    const cleanJson = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const analysis = JSON.parse(cleanJson);

    aiAvailable = true;
    return analysis;
  } catch (error) {
    console.error("AI skill gap analysis error:", error.message);

    if (
      error.status === 429 ||
      error.message?.includes("quota") ||
      error.message?.includes("429")
    ) {
      aiAvailable = false;
      lastQuotaErrorTime = Date.now();
    }

    return getFallbackSkillGap(userSkills, targetJobs);
  }
};

/**
 * Fallback skill gap analysis when AI is unavailable
 */
const getFallbackSkillGap = (userSkills, targetJobs) => {
  const normalizedUser = userSkills.map((s) => s.toLowerCase().trim());

  // Collect all required and preferred skills from jobs
  const requiredSkillsCount = {};
  const preferredSkillsCount = {};
  const totalJobs = targetJobs.length || 1;

  targetJobs.forEach((job) => {
    (job.requiredSkills || []).forEach((s) => {
      const key = s.toLowerCase().trim();
      requiredSkillsCount[key] = (requiredSkillsCount[key] || 0) + 1;
    });
    (job.preferredSkills || []).forEach((s) => {
      const key = s.toLowerCase().trim();
      preferredSkillsCount[key] = (preferredSkillsCount[key] || 0) + 1;
    });
  });

  // Categorize skills
  const categoryMap = {
    react: "Frontend",
    vue: "Frontend",
    angular: "Frontend",
    html: "Frontend",
    css: "Frontend",
    tailwind: "Frontend",
    "next.js": "Frontend",
    nextjs: "Frontend",
    node: "Backend",
    "node.js": "Backend",
    express: "Backend",
    django: "Backend",
    flask: "Backend",
    "spring boot": "Backend",
    graphql: "Backend",
    rest: "Backend",
    javascript: "Languages",
    typescript: "Languages",
    python: "Languages",
    java: "Languages",
    "c++": "Languages",
    go: "Languages",
    rust: "Languages",
    docker: "DevOps",
    kubernetes: "DevOps",
    aws: "Cloud",
    azure: "Cloud",
    gcp: "Cloud",
    mongodb: "Database",
    postgresql: "Database",
    mysql: "Database",
    redis: "Database",
    git: "Tools",
    figma: "Design",
    "react native": "Mobile",
    flutter: "Mobile",
    tensorflow: "AI/ML",
    pytorch: "AI/ML",
  };

  const getCategory = (skill) => {
    const lower = skill.toLowerCase();
    for (const [key, cat] of Object.entries(categoryMap)) {
      if (lower.includes(key)) return cat;
    }
    return "Tools";
  };

  // Current skills with levels based on job relevance
  const currentSkills = userSkills.map((skill) => {
    const lower = skill.toLowerCase().trim();
    const inRequired = requiredSkillsCount[lower] || 0;
    const inPreferred = preferredSkillsCount[lower] || 0;
    const relevance = Math.min(
      100,
      Math.round(((inRequired * 2 + inPreferred) / totalJobs) * 50 + 50),
    );
    return {
      name: skill,
      level: relevance,
      category: getCategory(skill),
    };
  });

  // Missing skills
  const missingSkills = [];
  const allRequired = Object.entries(requiredSkillsCount);
  allRequired.sort((a, b) => b[1] - a[1]);

  for (const [skill, count] of allRequired) {
    const isOwned = normalizedUser.some(
      (us) => us.includes(skill) || skill.includes(us),
    );
    if (!isOwned) {
      const demand = Math.round((count / totalJobs) * 100);
      let importance = "Low";
      if (demand >= 60) importance = "High";
      else if (demand >= 30) importance = "Medium";
      missingSkills.push({
        name: skill.charAt(0).toUpperCase() + skill.slice(1),
        importance,
        demand,
        category: getCategory(skill),
      });
    }
  }

  // Also check preferred skills
  for (const [skill, count] of Object.entries(preferredSkillsCount)) {
    const isOwned = normalizedUser.some(
      (us) => us.includes(skill) || skill.includes(us),
    );
    const alreadyMissing = missingSkills.some(
      (ms) => ms.name.toLowerCase() === skill,
    );
    if (!isOwned && !alreadyMissing) {
      missingSkills.push({
        name: skill.charAt(0).toUpperCase() + skill.slice(1),
        importance: "Low",
        demand: Math.round((count / totalJobs) * 50),
        category: getCategory(skill),
      });
    }
  }

  // Sort by demand
  missingSkills.sort((a, b) => b.demand - a.demand);

  // Calculate market readiness
  const totalRequired = Object.keys(requiredSkillsCount).length || 1;
  const matchedRequired = Object.keys(requiredSkillsCount).filter((skill) =>
    normalizedUser.some((us) => us.includes(skill) || skill.includes(us)),
  ).length;
  const marketReadiness = Math.round((matchedRequired / totalRequired) * 100);

  // Generate recommendations for top missing skills
  const recommendations = missingSkills.slice(0, 5).map((skill) => ({
    skill: skill.name,
    resources: [
      {
        type: "Course",
        title: `Complete ${skill.name} Bootcamp`,
        platform: "Udemy",
        duration: "12h",
        url: "",
      },
      {
        type: "Video",
        title: `${skill.name} Crash Course`,
        platform: "YouTube",
        duration: "4h",
        url: "",
      },
      {
        type: "Article",
        title: `${skill.name} Official Documentation`,
        platform: "Official Docs",
        duration: "2h",
        url: "",
      },
    ],
  }));

  return {
    currentSkills: currentSkills.slice(0, 10),
    missingSkills: missingSkills.slice(0, 8),
    recommendations,
    marketReadiness,
    summary: `You match ${marketReadiness}% of the required skills for your target jobs. Focus on ${missingSkills[0]?.name || "new skills"} and ${missingSkills[1]?.name || "practice"} to improve your marketability.`,
  };
};

export default { analyzeSkillGap };
