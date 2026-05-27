// server/src/services/resumeParserService.js
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ========== TEXT EXTRACTION FUNCTIONS ==========

export const extractTextFromPDF = async (buffer) => {
  try {
    console.log("📄 Parsing PDF, buffer size:", buffer.length);
    const data = await pdfParse(buffer);
    console.log("✅ PDF parsed, text length:", data.text.length);
    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error.message);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

export const extractTextFromDOCX = async (buffer) => {
  try {
    console.log("📄 Parsing DOCX, buffer size:", buffer.length);
    const result = await mammoth.extractRawText({ buffer });
    console.log("✅ DOCX parsed, text length:", result.value.length);
    return result.value;
  } catch (error) {
    console.error("DOCX parsing error:", error.message);
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
};

// ========== AI SKILL EXTRACTION (With Fallbacks) ==========

export const extractSkillsWithAI = async (text, userEmail) => {
  console.log("🤖 Starting skill extraction...");

  try {
    const result = await extractWithGemini(text);
    console.log("✅ Gemini extraction successful");

    let parsedResult;
    if (typeof result === "string") {
      let cleanJson = result
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedResult = JSON.parse(cleanJson);
    } else {
      parsedResult = result;
    }

    const skills = [
      ...(parsedResult.technicalSkills || []),
    ];

    console.log(`🎯 Skills extracted: ${skills.length}`);
    console.log(
      `📊 Experience: ${parsedResult.totalExperience || "Not specified"}`,
    );
    console.log(`🎓 Education: ${parsedResult.education?.length || 0}`);
    console.log(`💼 Projects: ${parsedResult.projects?.length || 0}`);

    // Log score details
    if (parsedResult.resumeScore) {
      console.log(`📈 AI Score: ${parsedResult.resumeScore.overall}/100`);
      console.log(
        `💪 Strengths: ${parsedResult.resumeScore.strengths?.join(", ")}`,
      );
      console.log(
        `📝 Improvements: ${parsedResult.resumeScore.improvements?.join(", ")}`,
      );
    }

    // Ensure all education entries have a type field
    const allEducation = (parsedResult.education || []).map((edu) => {
      if (!edu.type) {
        const degree = (edu.degree || "").toLowerCase();
        const schoolKeywords = [
          "high school", "secondary", "matriculation", "matric",
          "10th", "12th", "hsc", "intermediate", "+2", "ssc", "cbse",
          "senior secondary", "higher secondary",
        ];
        const isSchool = schoolKeywords.some((kw) => degree.includes(kw));
        return { ...edu, type: isSchool ? "school" : "degree" };
      }
      return edu;
    });

    return {
      skills: skills,
      experience: parsedResult.totalExperience || "Not specified",
      education: allEducation,
      projects: parsedResult.projects || [],
      score: parsedResult.resumeScore?.overall || 0,
      scoreBreakdown: parsedResult.resumeScore?.breakdown || {},
      strengths: parsedResult.resumeScore?.strengths || [],
      improvements: parsedResult.resumeScore?.improvements || [],
      fresherNote: parsedResult.resumeScore?.fresherNote || "",
    };
  } catch (geminiError) {
    console.warn("⚠️ Gemini failed:", geminiError.message);
    console.log("🔄 Falling back to keyword extraction");
    const fallbackData = extractWithKeywords(text);
    return {
      ...fallbackData,
      score: 70, // Default fallback score
      scoreBreakdown: {},
      strengths: ["Resume uploaded successfully"],
      improvements: ["AI scoring unavailable, using basic extraction"],
    };
  }
};

// OPTIMIZED GEMINI PROMPT - Works for ALL resume formats
// server/src/services/resumeParserService.js

export async function extractWithGemini(text) {
  const modelNames = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
  ];
  let lastError = null;

  for (const modelName of modelNames) {
    try {
      console.log(`🔄 Trying model: ${modelName}`);
      const geminiModel = genAI.getGenerativeModel({ model: modelName });

      const prompt = `You are an expert resume reviewer and career coach. Analyze this resume thoroughly.

RESUME TEXT:
${text.substring(0, 8000)}

CRITICAL RULES — Follow these exactly:

=== TECHNICAL SKILLS ONLY ===
Extract ONLY technical/hard skills from the resume. This means:
- Programming languages (JavaScript, Python, Java, C++, etc.)
- Frameworks & libraries (React, Node.js, Django, Express, etc.)
- Databases (MongoDB, MySQL, PostgreSQL, etc.)
- Cloud platforms & DevOps (AWS, Docker, Kubernetes, etc.)
- Tools & software (Git, VS Code, Postman, Figma, etc.)
- Data analysis, machine learning tools

DO NOT include soft skills like: communication, leadership, teamwork, problem-solving, time management, self-motivation, critical thinking, adaptability, creativity, work ethic, attention to detail, conflict resolution, decision making, interpersonal skills, organization, presentation skills, negotiation, mentoring, emotional intelligence, multitasking, security awareness, impact analysis, efficiency, scalability, optimization, or any other non-technical skill.

If the resume doesn't mention enough real technical skills, return an empty or small array rather than making up skills.

=== EXPERIENCE DETECTION ===
"totalExperience" must be:
- "Fresher" — if the candidate is currently studying, recently graduated, or has only internships/projects (NO full-time professional employment)
- "X years" — ONLY if there is clear evidence of full-time professional work experience
- Internships of less than 6 months do NOT count as professional experience — the candidate is still a fresher

=== EDUCATION — INCLUDE ALL BUT LABEL ===
Extract ALL education mentioned in the resume, including school-level. Add a "type" field to each entry:
- "degree" — for college/university: B.Tech, B.E., B.Sc, B.Com, BBA, BA, M.Tech, M.E., M.Sc, M.Com, MBA, MA, PhD, Diploma
- "school" — for school-level: 10th, 12th, Matriculation, Higher Secondary, HSC, Intermediate, +2, Senior Secondary, High School

If the candidate is currently pursuing a degree (e.g., "2024-2027" or "expected 2026"), include it with the expected graduation year.

=== PROJECTS ===
Extract real projects mentioned in the resume with their descriptions. Focus on technical projects that demonstrate skills.

Return ONLY valid JSON with this EXACT structure (no markdown, no extra text):

{
  "technicalSkills": ["skill1", "skill2"],
  "totalExperience": "Fresher",
  "education": [
    {"type": "degree", "degree": "BBA", "institution": "University Name", "year": "2026"},
    {"type": "school", "degree": "12th / Higher Secondary", "institution": "School Name", "year": "2023"}
  ],
  "projects": [{"name": "Project Name", "description": "Brief description"}],
  "resumeScore": {
    "overall": 85,
    "breakdown": {
      "skills": 90,
      "experience": 70,
      "education": 85,
      "projects": 80
    },
    "strengths": ["Strength 1", "Strength 2"],
    "improvements": ["Improvement 1", "Improvement 2"],
    "fresherNote": "If fresher, add encouraging note about potential"
  }
}

SCORING GUIDELINES:

1. TECHNICAL SKILLS SCORE (0-100):
   - Count ONLY technical skills (not soft skills)
   - 90-100: 8+ genuine technical skills, modern stack
   - 70-89: 5-7 technical skills, good coverage
   - 50-69: 3-4 technical skills, basic coverage
   - 0-49: 0-2 technical skills, needs improvement

2. EXPERIENCE SCORE (0-100):
   - For experienced professionals: Based on years, growth, impact (70-95)
   - For freshers with good projects/internships: 60-75
   - For freshers with limited projects: 50-65
   - Never give freshers below 50 — they have potential!

3. EDUCATION SCORE (0-100):
   - 85-100: Relevant degree from good institution
   - 70-84: Relevant degree
   - 50-69: Somewhat relevant or still pursuing
   - Only score college/university education, NOT school

4. PROJECTS SCORE (0-100):
   - 85-100: Complex, real-world, deployed projects
   - 70-84: Good projects with clear technical descriptions
   - 50-69: Basic or academic projects
   - Add 5-10 points for live deployments, GitHub links

5. OVERALL SCORE:
   - Skills: 35% | Projects: 25% | Education: 20% | Experience: 20%
   - Freshers get minimum 60 overall (encourage, don't discourage)

6. STRENGTHS & IMPROVEMENTS (2-3 each):
   - Strengths: Technical strengths, good projects, relevant education
   - Improvements: Actionable technical suggestions (learn X, build Y, deploy Z)

Be honest but encouraging. A fresher should NEVER get below 60 overall.`;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      console.log(`✅ Model ${modelName} succeeded`);
      return responseText;
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed:`, error.message);
      lastError = error;
      continue;
    }
  }
  throw lastError || new Error("No Gemini model available");
}

// ENHANCED Keyword-based extraction (fallback with better pattern matching)
function extractWithKeywords(text) {
  console.log("📊 Using enhanced keyword-based extraction");

  const textLower = text.toLowerCase();

  // Expanded skill database
  const technicalSkills = {
    // Frontend
    react: "React",
    "react.js": "React",
    reactjs: "React",
    angular: "Angular",
    vue: "Vue.js",
    "next.js": "Next.js",
    nextjs: "Next.js",
    html: "HTML",
    html5: "HTML5",
    css: "CSS",
    css3: "CSS3",
    tailwind: "Tailwind CSS",
    bootstrap: "Bootstrap",
    sass: "SASS",
    redux: "Redux",
    typescript: "TypeScript",
    javascript: "JavaScript",
    js: "JavaScript",
    jquery: "jQuery",

    // Backend
    "node.js": "Node.js",
    nodejs: "Node.js",
    express: "Express.js",
    expressjs: "Express.js",
    python: "Python",
    django: "Django",
    flask: "Flask",
    java: "Java",
    spring: "Spring Boot",
    "c#": "C#",
    "c++": "C++",
    php: "PHP",
    laravel: "Laravel",
    go: "Go",
    rust: "Rust",
    ruby: "Ruby",
    rails: "Rails",
    graphql: "GraphQL",
    "rest api": "REST API",

    // Databases
    mongodb: "MongoDB",
    mysql: "MySQL",
    postgresql: "PostgreSQL",
    sql: "SQL",
    firebase: "Firebase",
    redis: "Redis",
    oracle: "Oracle",
    dynamodb: "DynamoDB",

    // Cloud & DevOps
    aws: "AWS",
    azure: "Azure",
    gcp: "GCP",
    docker: "Docker",
    kubernetes: "Kubernetes",
    jenkins: "Jenkins",
    git: "Git",
    github: "GitHub",
    gitlab: "GitLab",
    "ci/cd": "CI/CD",

    // Tools
    postman: "Postman",
    vscode: "VS Code",
    figma: "Figma",
    jira: "Jira",
    confluence: "Confluence",
    slack: "Slack",
    trello: "Trello",
    notion: "Notion",
    drizzle: "Drizzle ORM",
  };

  // Find all matching skills
  const foundSkills = new Set();
  for (const [pattern, skill] of Object.entries(technicalSkills)) {
    if (textLower.includes(pattern)) {
      foundSkills.add(skill);
    }
  }

  // Extract years of experience
  let experience = "0 years";
  const yearPatterns = [
    /(\d+)\+?\s*years?/i,
    /(\d+)\+?\s*yrs?/i,
    /experience of (\d+)/i,
    /worked for (\d+)\s*years?/i,
  ];

  for (const pattern of yearPatterns) {
    const match = text.match(pattern);
    if (match) {
      experience = `${match[1]} years`;
      break;
    }
  }

  // Extract education — both degree and school level
  const education = [];
  const educationPatterns = [
    {
      degree: "Bachelor's Degree",
      keywords: ["b.tech", "bachelor", "b.e", "b.sc", "b.com", "b.b.a", "bba"],
      type: "degree",
    },
    {
      degree: "Master's Degree",
      keywords: ["m.tech", "master", "m.e", "m.sc", "m.com", "m.b.a", "mba"],
      type: "degree",
    },
    { degree: "PhD", keywords: ["phd", "doctorate"], type: "degree" },
    { degree: "Diploma", keywords: ["diploma", "polytechnic"], type: "degree" },
    {
      degree: "12th / Higher Secondary",
      keywords: ["12th", "hsc", "higher secondary", "senior secondary", "+2", "intermediate"],
      type: "school",
    },
    {
      degree: "10th / Matriculation",
      keywords: ["10th", "ssc", "matric", "matriculation", "secondary school", "cbse"],
      type: "school",
    },
  ];

  for (const edu of educationPatterns) {
    for (const keyword of edu.keywords) {
      if (textLower.includes(keyword)) {
        // Try to extract institution name from context
        let institution = "Not specified";
        const instMatch = text.match(
          new RegExp(`${keyword}[\\s\\n]*([^\\n,]+)`, "i"),
        );
        if (instMatch && instMatch[1]) {
          institution = instMatch[1].trim();
        }

        education.push({
          degree: edu.degree,
          institution: institution,
          year: "Not specified",
          type: edu.type || "degree",
        });
        break;
      }
    }
  }

  // Remove duplicates from education
  const uniqueEducation = [];
  for (const edu of education) {
    if (!uniqueEducation.some((e) => e.degree === edu.degree)) {
      uniqueEducation.push(edu);
    }
  }

  // Extract projects
  const projects = [];
  const projectPatterns = [
    /project[s]?:?\s*([^\n]+)/gi,
    /•\s*([^•\n]+project[^•\n]+)/gi,
    /\d+\.\s*([^\n]+project[^\n]+)/gi,
  ];

  for (const pattern of projectPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].length > 3) {
        const projectName = match[1].substring(0, 60).trim();
        if (!projects.some((p) => p.name === projectName)) {
          projects.push({
            name: projectName,
            description: "Extracted from resume",
          });
        }
      }
    }
  }

  // Limit to 5 projects
  const uniqueProjects = projects.slice(0, 5);

  console.log(
    `📊 Keyword extraction results: ${foundSkills.size} skills, ${uniqueEducation.length} education, ${uniqueProjects.length} projects`,
  );

  return {
    skills: Array.from(foundSkills),
    experience: experience,
    education: uniqueEducation,
    projects: uniqueProjects,
  };
}
