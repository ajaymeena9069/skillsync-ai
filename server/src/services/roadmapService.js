// backend/src/services/roadmapService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI availability tracking
let aiAvailable = true;
let lastQuotaErrorTime = 0;
const QUOTA_COOLDOWN_MS = 60 * 1000;

/**
 * Generate a personalized learning roadmap based on skill gaps
 * Uses Gemini AI with intelligent fallback
 */
export const generateRoadmap = async (userSkills, missingSkills, options = {}) => {
  const { weeks = 4, hoursPerWeek = 10 } = options;

  // Check cooldown
  if (!aiAvailable && Date.now() - lastQuotaErrorTime < QUOTA_COOLDOWN_MS) {
    console.log("AI temporarily unavailable, using fallback for roadmap");
    return getFallbackRoadmap(userSkills, missingSkills, { weeks, hoursPerWeek });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an AI career coach. Generate a personalized learning roadmap for a developer.

      CURRENT SKILLS: ${userSkills.join(", ")}
      SKILLS TO LEARN: ${missingSkills.map(s => typeof s === "string" ? s : s.name).join(", ")}
      DURATION: ${weeks} weeks
      HOURS PER WEEK: ${hoursPerWeek}

      Create a structured weekly learning plan. Return ONLY valid JSON:
      {
        "title": "Personalized Learning Roadmap",
        "totalWeeks": ${weeks},
        "hoursPerWeek": ${hoursPerWeek},
        "weeks": [
          {
            "week": 1,
            "title": "Short descriptive title for this week's focus",
            "description": "Brief description of what the learner will accomplish",
            "tasks": [
              {
                "title": "Specific actionable task",
                "duration": "Xh",
                "type": "Course|Project|Practice|Reading",
                "resource": "Resource name or platform"
              }
            ],
            "skills": ["Skill1", "Skill2"],
            "milestone": "What you'll be able to do after this week"
          }
        ],
        "summary": "Brief motivational summary of the roadmap",
        "expectedOutcome": "What the learner will achieve after completing the full roadmap"
      }

      Rules:
      - Each week should focus on 1-2 related skills maximum
      - Tasks should be specific, actionable, and progressively build on each other
      - Include a mix of task types: courses, hands-on projects, practice exercises, reading
      - Total task durations per week should add up to approximately ${hoursPerWeek} hours
      - Skills that build on the user's existing knowledge should come first
      - Each week should have 3-5 tasks
      - Milestones should be concrete and measurable
      - Resource suggestions should be real platforms (Udemy, Coursera, YouTube, freeCodeCamp, MDN, etc.)

      Return ONLY valid JSON, no markdown.
    `;

    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI request timed out")), 20000),
      ),
    ]);

    const response = result.response.text();
    const cleanJson = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const roadmap = JSON.parse(cleanJson);

    aiAvailable = true;
    return roadmap;
  } catch (error) {
    console.error("AI roadmap generation error:", error.message);

    if (
      error.status === 429 ||
      error.message?.includes("quota") ||
      error.message?.includes("429")
    ) {
      aiAvailable = false;
      lastQuotaErrorTime = Date.now();
    }

    return getFallbackRoadmap(userSkills, missingSkills, { weeks, hoursPerWeek });
  }
};

/**
 * Fallback roadmap generation when AI is unavailable
 */
const getFallbackRoadmap = (userSkills, missingSkills, { weeks, hoursPerWeek }) => {
  const normalizedUser = userSkills.map((s) => s.toLowerCase().trim());

  // Normalize missing skills
  const skillsToLearn = missingSkills.map((s) => (typeof s === "string" ? s : s.name));

  // Group skills by relatedness for weekly focus
  const categoryMap = {
    Frontend: ["react", "vue", "angular", "html", "css", "tailwind", "next.js", "svelte", "sass"],
    Backend: ["node", "express", "django", "flask", "spring", "graphql", "rest", "fastapi", "nest"],
    Languages: ["javascript", "typescript", "python", "java", "c++", "go", "rust", "kotlin", "swift"],
    DevOps: ["docker", "kubernetes", "ci/cd", "jenkins", "github actions", "terraform", "ansible"],
    Cloud: ["aws", "azure", "gcp", "cloud", "serverless", "lambda"],
    Database: ["mongodb", "postgresql", "mysql", "redis", "elasticsearch", "firebase"],
    Mobile: ["react native", "flutter", "swift", "kotlin", "ios", "android"],
    "AI/ML": ["tensorflow", "pytorch", "machine learning", "deep learning", "nlp", "data science"],
    Tools: ["git", "webpack", "vite", "testing", "jest", "cypress"],
    Design: ["figma", "ui/ux", "design systems", "accessibility"],
  };

  const getCategory = (skill) => {
    const lower = skill.toLowerCase();
    for (const [cat, keywords] of Object.entries(categoryMap)) {
      if (keywords.some((k) => lower.includes(k) || k.includes(lower))) return cat;
    }
    return "Tools";
  };

  // Distribute skills across weeks
  const skillsPerWeek = Math.max(1, Math.ceil(skillsToLearn.length / weeks));
  const weeklyPlan = [];

  for (let w = 0; w < weeks; w++) {
    const weekSkills = skillsToLearn.slice(w * skillsPerWeek, (w + 1) * skillsPerWeek);
    if (weekSkills.length === 0) {
      // Fill remaining weeks with practice/review
      weekSkills.push(...skillsToLearn.slice(0, 2));
    }

    const tasksPerSkill = Math.max(1, Math.floor(4 / weekSkills.length));
    const hoursPerTask = Math.round(hoursPerWeek / (weekSkills.length * tasksPerSkill));

    const tasks = [];
    const taskTypes = ["Course", "Practice", "Project", "Reading"];

    weekSkills.forEach((skill, si) => {
      for (let t = 0; t < tasksPerSkill; t++) {
        const type = taskTypes[(si * tasksPerSkill + t) % taskTypes.length];
        const platforms = {
          Course: ["Udemy", "Coursera", "freeCodeCamp"],
          Practice: ["LeetCode", "HackerRank", "Exercism"],
          Project: ["GitHub", "Personal Project", "Portfolio"],
          Reading: ["MDN Docs", "Official Docs", "Dev.to"],
        };
        const platform = platforms[type][Math.floor(Math.random() * platforms[type].length)];

        let title;
        switch (type) {
          case "Course":
            title = `Complete ${skill} fundamentals course`;
            break;
          case "Practice":
            title = `Practice ${skill} with coding exercises`;
            break;
          case "Project":
            title = `Build a mini-project using ${skill}`;
            break;
          case "Reading":
            title = `Read ${skill} documentation and best practices`;
            break;
          default:
            title = `Study ${skill}`;
        }

        tasks.push({
          title,
          duration: `${hoursPerTask}h`,
          type,
          resource: platform,
        });
      }
    });

    const weekTitle =
      weekSkills.length === 1
        ? `${weekSkills[0]} Deep Dive`
        : `${weekSkills[0]} & ${weekSkills[1] || "Practice"}`;

    weeklyPlan.push({
      week: w + 1,
      title: weekTitle,
      description: `Focus on mastering ${weekSkills.join(" and ")} through structured learning and hands-on practice.`,
      tasks,
      skills: weekSkills,
      milestone: `Be able to use ${weekSkills[0]} in a real project${weekSkills[1] ? ` and understand ${weekSkills[1]} basics` : ""}`,
    });
  }

  return {
    title: "Personalized Learning Roadmap",
    totalWeeks: weeks,
    hoursPerWeek,
    weeks: weeklyPlan,
    summary: `This ${weeks}-week roadmap will help you learn ${skillsToLearn.slice(0, 3).join(", ")}${skillsToLearn.length > 3 ? " and more" : ""}. Dedicate ${hoursPerWeek} hours per week for best results.`,
    expectedOutcome: `After completing this roadmap, you'll have practical knowledge of ${skillsToLearn.length} new skills, making you significantly more competitive in the job market.`,
  };
};

export default { generateRoadmap };
