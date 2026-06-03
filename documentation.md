# SkillSync AI - Comprehensive Project Documentation

Welcome to the **SkillSync AI** comprehensive documentation. This document provides an exhaustive, end-to-end overview of the project, including its core features, underlying architecture, technical stack, execution steps, and how it overcomes traditional recruitment challenges.

---

## 1. Project Overview & Vision

**SkillSync AI** is a modern, AI-powered recruitment and job application platform built entirely on the MERN stack (MongoDB, Express.js, React.js, Node.js). 

Traditional hiring processes are plagued by keyword-matching ATS (Applicant Tracking Systems) that fail to understand true candidate potential. On the flip side, job seekers often lack personalized feedback on how to improve. **SkillSync AI** bridges the gap between talented jobseekers and recruiters by leveraging advanced Artificial Intelligence (Google Gemini AI) to analyze deep candidate-job fit, parse resumes intelligently, and generate personalized learning roadmaps.

### The Problems It Overcomes:
- **For Job Seekers:** Solves the "black hole" of job applications by providing immediate, AI-driven feedback on their skill gaps and creating actionable, week-by-week roadmaps to upskill.
- **For Recruiters:** Overcomes the tedious process of manually screening hundreds of resumes by providing AI-generated Match Scores and detailed analyses for every applicant.
- **System Inefficiency:** Reduces redundant API calls to LLMs through an intelligent caching and 24-hour rate-limiting layer.

---

## 2. Technology Stack

The project utilizes a robust, modern technology stack carefully chosen for performance, scalability, and developer experience.

### Frontend
- **React.js (v19):** Component-based UI library.
- **Vite:** Next-generation frontend tooling for instantaneous hot module replacement (HMR) and optimized builds.
- **Redux Toolkit (RTK) & RTK Query:** Centralized state management and advanced data fetching, caching, and synchronization.
- **Tailwind CSS:** Utility-first CSS framework for highly responsive, modern, and glassmorphic UI designs.
- **Lucide React:** Clean, consistent SVG icon library.
- **Sonner:** High-performance toast notifications for UX feedback.
- **Recharts:** Composable charting library used for the Recruiter Analytics dashboard.

### Backend
- **Node.js & Express.js:** Fast, asynchronous, event-driven server environment.
- **Google Gemini AI (Generative AI API):** Powers all intelligent features (Resume Parsing, Skill Gaps, Candidate Matching).
- **Socket.io:** Enables real-time, bi-directional communication for instant notifications.
- **Argon2:** State-of-the-art password hashing algorithm, vastly superior to bcrypt in defending against brute-force attacks.
- **JSON Web Tokens (JWT):** Stateless authentication mechanism.
- **Multer:** Middleware for handling `multipart/form-data` (file uploads).
- **Cloudinary:** Cloud-based image and asset management for user avatars and company logos.
- **Nodemailer:** Handles transactional emails (OTP, password resets).

### Database
- **MongoDB & Mongoose:** NoSQL document database, ideal for flexible schemas and rapid iteration.

---

## 3. System Architecture & Workflows

SkillSync AI follows a strict **Model-View-Controller (MVC)** architectural pattern on the backend, decoupled from a Single Page Application (SPA) frontend.

### Authentication Flow
1. User registers as either a `jobseeker` or `recruiter`.
2. Backend hashes password via Argon2 and saves to DB.
3. User logs in. Backend verifies credentials and issues an HTTP-only or client-side JWT token.
4. Token is passed in the `Authorization: Bearer <token>` header for protected routes.
5. `protect` and `authorize("role")` middlewares ensure strict Role-Based Access Control (RBAC).

### AI Generation & Caching Flow (The "Smart Cache" System)
To prevent API abuse and reduce latency, the platform implements a sophisticated caching layer:
- **Jobseeker Limits:** When a user parses a resume or generates a roadmap, the backend records the timestamp (`aiUsage.roadmap.lastGeneratedAt`). If a new request is made within 24 hours, the backend bypasses the Gemini API and serves the `cachedData` directly. The frontend intelligently disables the "Regenerate" buttons and displays an "Available in 24h" state.
- **Recruiter Caching:** When a recruiter analyzes an application, the AI Match Analysis is permanently stored inside the `Application` document. Subsequent views load instantly from the database.

---

## 4. Comprehensive Feature Guide: Job Seeker (Candidate)

The Job Seeker portal is designed to act as an intelligent career coach.

### 4.1. Intelligent Resume Parsing
- **How it works:** Candidates upload a PDF or DOCX file. The backend reads the file buffer, converts it to text, and sends a highly specific prompt to Gemini AI to extract structured JSON (Skills, Experience, Education, Projects).
- **UX:** Drag-and-drop interface with loading states. Rate limited to 1 parse per 24 hours to prevent abuse.

### 4.2. AI Skill Gap Analysis
- **How it works:** Compares the candidate's extracted skills against the aggregate requirements of top active jobs in the database.
- **Output:** Identifies exactly which modern skills the candidate is missing and scores their current market readiness.

### 4.3. AI Learning Roadmap Generation
- **How it works:** Based on the missing skills identified, Gemini AI formulates a customized, week-by-week curriculum.
- **Customization:** Users can dictate how many weeks they have and how many hours per week they can commit.
- **Output:** A visual timeline of courses, projects, and reading materials.

### 4.4. Job Discovery & Application
- **Search & Filter:** Advanced filtering by location, salary, job type, and experience level.
- **One-Click Apply:** Users can apply instantly. Their stored profile and parsed resume data are automatically attached to the application.
- **Application Tracking:** A Kanban-style or list view of all applied jobs, tracking statuses (Pending, Reviewed, Shortlisted, Rejected).

### 4.5. Real-Time Notifications
- Utilizing Socket.io, candidates receive instantaneous alerts when a recruiter views their application or changes its status.

---

## 5. Comprehensive Feature Guide: Recruiter

The Recruiter portal serves as a lightweight, AI-augmented Applicant Tracking System (ATS).

### 5.1. Company & Brand Management
- Recruiters can create and manage their company’s public page, including uploading logos to Cloudinary, defining mission statements, and listing benefits to attract top talent.

### 5.2. Job Posting & Pipeline Management
- **Creation:** Intuitive forms to post jobs with rich descriptions, required skills, and salary ranges.
- **Management:** Toggle job visibility (Active/Closed) and track total views and application counts.

### 5.3. AI Candidate Matching (The Core Value Prop)
- **How it works:** Instead of reading every resume, the recruiter clicks "Analyze Fit". The backend sends the Job Description and the Candidate's Parsed Resume to Gemini AI.
- **Output:** The AI returns a precise `matchScore` (0-100), an array of `matchedSkills`, `missingSkills`, and a detailed textual `recommendation` on whether to hire.
- **Efficiency:** The result is permanently cached on the `Application` record. If the recruiter views it again, it loads in milliseconds without hitting the AI service.

### 5.4. Recruiter Analytics Dashboard
- **Visual Insights:** Uses Recharts to plot application trends over time (e.g., applications received this week).
- **Metrics:** Displays total active jobs, total candidates, and average candidate quality scores.

---

## 6. Frontend Deep Dive (Client)

The frontend is organized via a highly modular structure.

### 6.1 State Management (Redux Toolkit)
The application utilizes Redux Toolkit and RTK Query to manage local state and server caching. 
- **authSlice:** Manages the logged-in user state, JWT tokens, and user roles.
- **resumeSlice:** Manages the active state of the parsed resume data so it's globally available across Roadmap and Job Application flows.
- **Base API:** `client/src/services/baseApi.js` provides the fundamental fetch functionality, including automatic header injection for JWT.

### 6.2 Key Components
- **Card, Badge, Button:** Reusable atom-level components built with Tailwind for consistency.
- **PageLoader:** Global loading spinner for suspense boundaries and API waits.
- **ProgressBar:** Visual component to show matching scores and profile completion percentage.

### 6.3 Jobseeker Pages
- **JobsPage.jsx:** The primary job search interface with a left-hand filter sidebar and a grid of job cards.
- **RoadmapPage.jsx:** Renders a vertical timeline using CSS gradients to show the AI-generated weekly plan.
- **SkillGapPage.jsx:** Uses progress bars to show current vs required skills.
- **MyApplicationsPage.jsx:** Status tracking for applied jobs.

### 6.4 Recruiter Pages
- **PostedJobsPage.jsx:** A tabular view of all jobs posted by the recruiter.
- **CandidateProfile.jsx:** Detailed view of an individual candidate's resume, application, and AI fit score.
- **AnalyticsPage.jsx:** Chart-heavy dashboard for high-level metrics.

---

## 7. Database Schema Design (MongoDB)

The database relies on specific schemas tailored for quick analytical queries.

### 7.1. User Schema (`User.js`)
Stores base information for all users.
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String)
- `role` (String, enum: 'jobseeker', 'recruiter')
- `skills` (Array of Strings)
- `experience` (String)
- `resumeUrl` (String)
- **`aiUsage` (Object):** 
  - `resumeParse`: { lastParsedAt: Date, count: Number }
  - `skillGap`: { lastAnalyzedAt: Date, cachedData: Object }
  - `roadmap`: { lastGeneratedAt: Date, cachedData: Object }

### 7.2. Job Schema (`Job.js`)
- `recruiter` (ObjectId, ref: 'User')
- `companyName` (String)
- `title` (String, required)
- `description` (String, required)
- `requiredSkills` (Array of Strings)
- `preferredSkills` (Array of Strings)
- `salaryRange` (Object: min, max, currency)
- `location` (String)
- `jobType` (String, enum: 'Full-time', 'Part-time', 'Contract', 'Internship')
- `status` (String, enum: 'active', 'closed')
- `views` (Number)
- `applicationCount` (Number)

### 7.3. Application Schema (`Application.js`)
Links a Jobseeker to a Job.
- `job` (ObjectId, ref: 'Job')
- `applicant` (ObjectId, ref: 'User')
- `recruiter` (ObjectId, ref: 'User')
- `status` (String, enum: 'pending', 'reviewed', 'shortlisted', 'rejected', 'hired')
- `resume` (ObjectId, ref: 'Resume')
- **`aiAnalysis` (Object):** 
  - `matchScore` (Number)
  - `matchedSkills` (Array of Strings)
  - `missingSkills` (Array of Strings)
  - `recommendation` (String)
  - `createdAt` (Date)

### 7.4. Resume Schema (`Resume.js`)
- `userId` (ObjectId, ref: 'User')
- `fileUrl` (String)
- `fileName` (String)
- `parsedSkills` (Array of Strings)
- `experience` (String)
- `education` (Array of Objects)
- `projects` (Array of Objects)

### 7.5. Notification Schema (`Notification.js`)
- `recipient` (ObjectId, ref: 'User')
- `sender` (ObjectId, ref: 'User')
- `type` (String, enum: 'application_update', 'new_application', 'general')
- `message` (String)
- `isRead` (Boolean)

---

## 8. Complete API Endpoints Reference

The backend exposes a comprehensive set of RESTful APIs, protected by JWT middleware.

### 8.1 Auth Routes (`/api/auth`)
- `POST /register`: Registers a new user. Returns JWT and user object.
- `POST /login`: Authenticates user via email/password. Returns JWT.
- `GET /me`: Retrieves current user profile (requires Bearer token).
- `POST /verify-email`: Validates OTP for new accounts.
- `POST /forgot-password`: Sends reset link via Nodemailer.
- `POST /reset-password`: Resets password using token.

### 8.2 AI Routes (`/api/ai`)
- `GET /status`: Returns the current rate-limit and cache status for the user (isCached, lastGeneratedAt) without triggering the LLM.
- `GET /skill-gap`: Analyzes jobseeker skills against global market data. Includes caching.
- `POST /skill-gap`: Analyzes skills against a specific Job ID.
- `POST /roadmap`: Generates custom learning plan based on skill gaps. Includes caching.

### 8.3 Job Routes (`/api/jobs`)
- `GET /`: Fetch all active jobs. Supports query parameters (search, location, type).
- `POST /`: Create a new job. Requires `recruiter` role.
- `GET /:id`: Get detailed information for a single job.
- `PATCH /:id`: Update job details (recruiter only).
- `DELETE /:id`: Delete or close a job.

### 8.4 Application Routes (`/api/applications`)
- `POST /`: Apply to a specific job. Validates existing resume.
- `GET /my-applications`: Jobseeker's application history.
- `GET /job/:jobId`: Recruiter fetches all applicants for a specific job.
- `PATCH /:id/status`: Recruiter updates the status of an application.

### 8.5 Match Routes (`/api/match`)
- `GET /candidate/:applicationId`: Recruiter fetches AI match analysis for a specific application. Triggers Gemini API if not cached.

### 8.6 Resume Routes (`/api/resume`)
- `POST /upload`: Uploads a PDF/DOCX to Cloudinary, extracts text, and triggers AI parsing.
- `GET /`: Retrieves the currently active parsed resume for the user.

---

## 9. Deep Dive: AI Integration Strategies & Prompts

SkillSync AI relies heavily on **Google Generative AI (Gemini)**. To ensure stability, accuracy, and cost-effectiveness, several strict strategies are employed:

### 9.1. Structured Prompting
When communicating with Gemini, prompts are strictly engineered to return JSON. For example, the resume parser prompt explicitly forbids conversational text and demands a specific JSON schema structure. 

#### Example Resume Parsing Prompt Structure:
```text
You are an expert ATS system. Analyze the following resume text and extract the exact information in this strict JSON format. 
Do not include markdown formatting, backticks, or any conversational text outside of the JSON block.

Expected JSON Structure:
{
  "parsedSkills": ["javascript", "react", "node"],
  "experience": "Fresher",
  "education": [
    {
      "degree": "B.Tech Computer Science",
      "institution": "University Name",
      "year": "2024",
      "type": "degree"
    }
  ],
  "projects": [
    {
      "name": "E-commerce App",
      "description": "Built using MERN stack",
      "technologies": ["react", "node", "mongodb"]
    }
  ]
}

Resume Text: [INJECTED_RESUME_TEXT_HERE]
```
By enforcing strict schema rules, the Node.js backend can safely call `JSON.parse(aiResponse)` without crashing from unexpected conversational outputs like "Here is your data:".

### 9.2. Rate Limiting via Database State (The 24-Hour Rule)
Traditional rate limiters (like `express-rate-limit`) use in-memory stores or Redis, which reset on server restart and apply per IP. SkillSync implements **User-Bound Rate Limiting** directly in the MongoDB `User` model.
- If a jobseeker generates a roadmap, `user.aiUsage.roadmap.lastGeneratedAt` is updated in the database.
- When the user visits the page, the frontend calls `GET /api/ai/status`.
- If the current time minus `lastGeneratedAt` is less than 24 hours, the frontend disables the generation buttons and uses the cached payload.
- This creates a flawless UX where the frontend instantly loads data, saving the platform huge LLM API costs and preventing malicious spamming.

### 9.3. Recruiter Application Caching
For recruiters, analyzing a candidate against a job description is computationally expensive.
- When a recruiter clicks "Analyze Fit", the result is generated and then permanently saved to `Application.aiAnalysis`.
- Any subsequent viewing of that candidate by that recruiter will fetch the data from MongoDB instantly.

---

## 10. Real-time Communication (Socket.io)

SkillSync AI uses Socket.io to push real-time notifications to users without requiring them to refresh the page.

### 10.1. Connection & Authentication
- When a user logs in, the React frontend initializes a WebSocket connection to the Node.js backend.
- The user passes their JWT in the initial handshake payload.
- The server validates the token in `socketHandler.js` and associates the socket ID with the User ID.

### 10.2. Event Emitting
- **`application_status_update`**: When a recruiter changes a candidate's status from "Pending" to "Reviewed", the controller triggers a DB update and fires an event `io.to(jobseekerSocketId).emit('notification', newNotification)`.
- **`new_application`**: When a jobseeker applies to a job, the recruiter instantly receives a notification payload alerting them of the new candidate.

---

## 11. UI/UX Design Philosophy

The frontend is built with strict adherence to modern design principles, ensuring a premium feel.

- **Color Palette:** Dominated by deep purples, indigos, and emerald greens for success states. The use of gradients (`bg-gradient-to-r from-purple-600 to-indigo-600`) gives components depth.
- **Glassmorphism:** Heavily utilized in background cards and modals (`bg-white/80 backdrop-blur-sm border-white/30`) to provide a sleek, layered aesthetic.
- **Micro-animations:** Hover effects (`hover:-translate-y-1`, `hover:shadow-lg`, `transition-all duration-300`) make the UI feel reactive and alive. 
- **Dark Mode Compatibility:** Tailwind's `dark:` prefix is used universally to ensure the app looks stunning on dark themes, swapping pure whites for slate grays and adjusting text contrasts accordingly.
- **Toast Notifications:** Sonner is used to provide immediate, non-intrusive feedback for actions like successfully applying to a job or hitting an AI rate limit.

---

## 12. Setup, Execution & Installation Guide

To run SkillSync AI locally, follow these steps meticulously.

### 12.1. Prerequisites
- **Node.js:** v18 or higher.
- **MongoDB:** A local MongoDB server running, or a MongoDB Atlas connection string.
- **API Keys Required:**
  - Google Gemini API Key (for AI features).
  - Cloudinary API Credentials (for image uploads).
  - Google OAuth Client ID (for Google Login).
  - SMTP Credentials (for NodeMailer).

### 12.2. Environment Variables
Create a `.env` file in the `server` directory with the following structure:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillsync
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SMTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google Auth
GOOGLE_CLIENT_ID=your_google_client_id
```

### 12.3. Running the Application

**Step 1: Install Dependencies**
Open two terminal windows.
Terminal 1 (Backend):
```bash
cd server
npm install
```
Terminal 2 (Frontend):
```bash
cd client
npm install
```

**Step 2: Start the Servers**
Terminal 1 (Backend):
```bash
# Starts Express server on port 5000 with Nodemon for auto-restarts
npm run dev
```
Terminal 2 (Frontend):
```bash
# Starts Vite development server on port 5173
npm run dev
```

**Step 3: Access the Application**
Open your browser and navigate to `http://localhost:5173`. You can now register as a Jobseeker or Recruiter and explore the platform.

---

## 13. Security & Best Practices Implemented

- **Password Hashing:** Utilizing Argon2 instead of bcrypt. Argon2 is memory-hard, making it significantly more resistant to GPU-based cracking.
- **Data Sanitization:** Mongoose schemas enforce strict typing, preventing NoSQL injection.
- **Role-Based Routing:** The frontend uses React Router with Protected Route wrappers that check Redux state for authorized roles. The backend verifies the JWT role payload.
- **Error Boundaries:** The React frontend employs error boundaries to prevent the entire app from crashing if an AI widget fails to load.
- **Graceful AI Fallbacks:** If the Gemini API limits are exhausted globally, the backend safely catches the error and returns standard Mongoose data without the AI augmentations, ensuring the platform remains usable.
- **File Upload Security:** Multer checks file mimetypes (PDF, DOCX) and enforces a 5MB size limit before passing buffers to the parser.

---

## 14. Testing & Quality Assurance

To ensure the system remains stable, rigorous testing strategies should be applied:
- **Unit Testing (Jest):** Isolate utility functions like date formatting and score calculation logic to ensure deterministic outputs.
- **Integration Testing (Supertest):** API routes can be tested by mocking the MongoDB instance using `mongodb-memory-server` to verify that controllers properly modify data and return correct HTTP status codes.
- **E2E Testing (Cypress/Playwright):** Critical user flows, such as User Registration -> Upload Resume -> Generate Roadmap -> Apply to Job, must be tested end-to-end simulating a real browser environment.

---

## 15. Troubleshooting & Common Errors

- **Error: "Failed to fetch AI Status"** 
  - *Cause:* Gemini API key is missing or quota is exhausted.
  - *Fix:* Check your `.env` file and verify your Google Cloud console quota.
- **Error: "CORS Blocked"**
  - *Cause:* Client port mismatch.
  - *Fix:* Ensure the frontend is running on the exact port whitelisted in `server.js` (usually 5173).
- **Socket Disconnects:**
  - *Cause:* Proxies or strict firewalls blocking WebSockets.
  - *Fix:* Ensure port 5000 is open and allows long-polling fallbacks.
- **MongoDB Authentication Error:**
  - *Cause:* Invalid password or IP whitelist restrictions on MongoDB Atlas.
  - *Fix:* Navigate to Atlas Network Access and add your current IP address.

---

## 16. Future Scope & Scalability

While SkillSync AI is robust, it can be extended further:
1. **Microservices Migration:** As user load increases, the AI parsing logic can be decoupled into a separate Python/FastAPI microservice or AWS Lambda function, freeing up the Node.js event loop.
2. **Redis Integration:** Caching job listings and session states in Redis to reduce MongoDB reads and speed up list queries.
3. **Automated Interviews:** Integrating WebRTC and AI to conduct initial 5-minute technical screening interviews based on the candidate's parsed skills.
4. **Webhooks & ATS Integrations:** Allowing recruiters to integrate SkillSync directly with external HRMS tools like Workday or BambooHR.
5. **Mobile Application:** Utilizing React Native to port the existing Redux logic into an iOS and Android application with push notifications.

---
*End of SkillSync AI Documentation.*

## 17. Comprehensive Deployment Guide

Deploying the SkillSync AI application involves deploying the React frontend, the Node.js backend, and ensuring all services (MongoDB, Cloudinary, Gemini) are properly configured in production environments.

### 17.1. Backend Deployment (Render / Heroku)

For the backend, we recommend using Render.com or Heroku due to their easy integration with Node.js applications and WebSockets.

**Step 1: Prepare the Node.js Application**
Ensure your `package.json` has the appropriate start script:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

**Step 2: Connect to Render**
1. Create a new Web Service on Render.
2. Connect your GitHub repository.
3. Set the Root Directory to `server`.
4. Set the Build Command to `npm install`.
5. Set the Start Command to `npm start`.

**Step 3: Environment Variables**
In the Render dashboard, carefully input every single environment variable from your `.env` file. Ensure `CLIENT_URL` is set to the production URL of your frontend (e.g., `https://skillsync.vercel.app`) to prevent CORS issues.

### 17.2. Frontend Deployment (Vercel / Netlify)

Vercel is the optimal choice for deploying Vite + React applications.

**Step 1: Configure Vite**
Ensure your `vite.config.js` or `.env` inside the `client` folder points to the deployed backend URL.
Create a `.env.production` file:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

**Step 2: Deploy to Vercel**
1. Import your GitHub repository into Vercel.
2. Set the Framework Preset to `Vite`.
3. Set the Root Directory to `client`.
4. Add the `VITE_API_URL` and `VITE_SOCKET_URL` to Vercel's Environment Variables panel.
5. Click Deploy. Vercel will automatically build the `dist` folder and serve the static files over a global CDN.

### 17.3. MongoDB Atlas (Production Database)
Never use local MongoDB for production.
1. Create a free cluster on MongoDB Atlas.
2. Under "Network Access", add `0.0.0.0/0` (Allow access from anywhere) so Render can connect to it.
3. Under "Database Access", create a user and copy the strong password.
4. Replace your backend `MONGO_URI` with the connection string provided by Atlas, ensuring the password and database name (`skillsync_prod`) are correct.

### 17.4. Post-Deployment Checks
- **CORS:** Open the browser console on your deployed frontend and attempt a login. If it fails with a CORS error, check that `CLIENT_URL` on the backend matches the Vercel URL exactly (no trailing slashes).
- **WebSockets:** Check the network tab for a successful `101 Switching Protocols` response to ensure Socket.io connected.
- **Image Uploads:** Upload a resume or profile picture to verify Cloudinary integration works in production.

---
*End of Appendix.*
