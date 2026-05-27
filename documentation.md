# 🚀 SkillSync AI — Complete Project Documentation

> **Last Updated**: May 25, 2026
> **Purpose**: Full context for any AI agent to continue development seamlessly.

---

## 📌 Project Overview

**SkillSync AI** is an AI-powered career intelligence platform built on the **MERN stack** (MongoDB, Express, React 19, Node.js). Job seekers upload resumes, get AI-parsed skills, match with jobs via intelligent algorithms, and receive personalized learning roadmaps. Recruiters post jobs, manage applications, view AI-ranked candidates, and track analytics.

---

## ✅ Completed Features (Production Ready)

### 1. 🔐 Authentication System

- Email/Password registration with Argon2 hashing
- JWT tokens stored in `localStorage` (`accessToken` key)
- Google OAuth 2.0 (credential flow with account linking)
- Email verification (6-digit OTP via Brevo API, 10 min expiry)
- Password reset (token-based, 1 hour expiry)
- Role-based access (`user` / `recruiter`) with middleware
- Role selection modal for Google sign-in (first-time users)
- Auth persistence via Redux + localStorage

### 2. 📄 Resume Processing

- File upload: PDF/DOCX via Multer (memory storage)
- Text extraction: `pdf-parse` (PDF), `mammoth` (DOCX)
- AI parsing: Google Gemini API with multi-model fallback
- Keyword fallback: 60+ skills database
- Cloudinary upload after parsing (parallel, non-blocking)
- Resume scoring with visual progress rings
- Resume synced to Redux + localStorage

### 3. 👤 User Profile (Job Seeker)

- View & edit profile with Save/Cancel pattern
- Avatar upload via Cloudinary with preview & cleanup
- Skills management (add/remove)
- Social links (LinkedIn, GitHub, Portfolio)
- Profile completeness tracking
- Dark mode support

### 4. 🏢 Company Profile (Recruiter)

- View & edit company details with Save/Cancel pattern
- Logo upload via Cloudinary with preview & cleanup
- Company completion tracking
- Benefit tags management
- Social links & company stats

### 5. 💼 Job Management

- Full CRUD operations
- Job form modal with React Hook Form + Zod validation
- Public job listing with search, filter, pagination
- Employment type & location filters
- Experience level & salary range filters

### 6. 📝 Application System

- Apply with cover letter (React Hook Form)
- Track application status (Pending → Reviewed → Shortlisted → Rejected/Hired)
- Withdraw applications
- My Applications page with status tracking & stats
- Recruiter: View applications per job, update status, add notes
- Match score on candidate cards

### 7. 🎯 Job Matching (AI-Powered)

- Skill-based match score calculation
- Color-coded match badges
- `useJobMatch` hook for sorting/filtering
- AI-powered candidate match analysis
- Matched skills, missing skills, extra skills breakdown

### 8. 👥 Candidate Management (Recruiter)

- Candidates list with filtering by job & status
- Candidate profile with AI analysis panel
- Status management & notes section
- Stats cards (Total, Pending, Shortlisted, Hired)

### 9. 📊 Recruiter Dashboard

- Dashboard stats (Active Jobs, Total Candidates, Interviews, Hires)
- Recent activity feed
- Quick action buttons

### 10. 📈 Analytics Page (Recruiter)

- Status distribution chart (Recharts PieChart)
- Monthly applications trend (Recharts LineChart)
- Top performing jobs (Recharts BarChart)
- Key metrics cards

### 11. 📋 User Dashboard (Job Seeker)

- Profile completion score with progress ring
- Top job matches (sorted by match score)
- Recent activity feed
- Quick stats

### 12. 🔍 Skill Gap Analysis

- Current vs required skills comparison
- Missing skills by importance (Critical/Recommended/Nice to Have)
- Learning resource recommendations

### 13. 🗺️ Roadmap Generation

- Multi-week/multi-phase learning roadmaps
- Tasks with status tracking
- Resources linked per task

### 14. 💬 AI Chat Assistant

- Floating chat panel with suggested prompts
- Simulated AI responses (ready for real API integration)

### 15. 🔔 Notifications Panel

- Slide-out notification panel
- Categorized notifications
- Unread count indicator

### 16. 🌐 Marketing Pages

- Landing, Features, About, Contact pages

### 17. 🎨 UI Components (50+ shadcn/ui)

- Complete shadcn/ui component library
- Custom: `MatchBadge`, `ProgressBar`, `ProfileProgress`, `StatsCard`, `CandidateCard`, `FilterBar`, `EmptyState`, `PageLoader`

---

## 🏗️ Tech Stack

### Backend

| Category    | Technology                       |
| ----------- | -------------------------------- |
| Runtime     | Node.js (ES Modules)             |
| Framework   | Express 4.18.2                   |
| Database    | Mongoose 8.0.0 + MongoDB         |
| Auth        | JWT, Argon2, Google Auth Library |
| AI          | @google/generative-ai 0.24.1     |
| File Upload | Multer, Cloudinary               |
| Email       | Brevo REST API                   |
| Parsing     | pdf-parse, mammoth               |
| Validation  | Zod 3.22.4                       |
| Security    | Helmet, CORS, Rate Limit         |
| Realtime    | Socket.io, Redis (optional)      |

### Frontend

| Category | Technology               |
| -------- | ------------------------ |
| Runtime  | React 19 + Vite 8        |
| State    | Redux Toolkit, RTK Query |
| Styling  | Tailwind CSS 4           |
| UI Kit   | shadcn/ui components     |
| Icons    | Lucide React             |
| Forms    | React Hook Form 7        |
| Charts   | Recharts 3               |
| Auth     | @react-oauth/google      |
| Router   | React Router DOM 7       |

---

## 📁 Folder Structure (Key Paths)

### Frontend (`client/src/`)

---

## 🗄️ Database Models

### User Model

```js
{
  name: String,
  email: String (unique),
  password: String (null for Google users),
  googleId: String,
  role: "user" | "recruiter",
  avatar: String,                    // Cloudinary URL
  avatarPublicId: String,            // For cleanup on re-upload
  phone: String,
  location: String,
  bio: String,
  currentRole: String,
  experience: String,
  skills: [String],
  resumeUrl: String,
  parsedResume: Mixed,
  preferredJobType: String,
  expectedSalary: String,
  socialLinks: { linkedin, github, portfolio, twitter },
  company: {                         // Recruiters only
    name, logo, logoPublicId, description, website, industry, size,
    founded, headquarters, culture, benefits, socialLinks
  },
  isProfileComplete: Boolean,
  isCompanyComplete: Boolean,
  isEmailVerified: Boolean,
  verificationCode: String,
  verificationCodeExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}
```

{
userId: ObjectId,
originalName: String,
fileUrl: String, // Cloudinary URL
cloudinaryId: String,
extractedText: String,
parsedSkills: [String],
experience: String,
education: [{ degree, institution, year }],
projects: [{ name, description }],
isActive: Boolean
}

{
title: String,
company: String,
location: String,
locationType: "remote" | "onsite" | "hybrid",
employmentType: "full-time" | "part-time" | "contract" | "internship",
experienceLevel: "entry" | "mid" | "senior" | "lead",
salaryMin: Number,
salaryMax: Number,
salaryCurrency: String,
description: String,
requiredSkills: [String],
preferredSkills: [String],
benefits: [String],
recruiterId: ObjectId,
status: "active" | "closed" | "draft",
applicationsCount: Number,
viewsCount: Number
}

{
jobId: ObjectId,
userId: ObjectId,
resumeUrl: String,
coverLetter: String,
status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired",
matchScore: Number,
notes: String,
reviewedAt: Date,
reviewedBy: ObjectId
}

🔌 API Endpoints (Core)
Auth (/api/auth)
Method Endpoint Description
POST /register Email/password registration
POST /login Email/password login
POST /google Google OAuth verification
POST /verify-email 6-digit OTP verification
POST /forgot-password Send reset email
POST /reset-password Reset password with token
Users (/api/users) — Protected
Method Endpoint Description
GET /profile Get user profile
PUT /profile Update profile
POST /avatar Upload avatar (Cloudinary)
Jobs (/api/jobs)
Method Endpoint Auth Description
GET / Public List jobs with filters
GET /:id Public Get single job
POST / Recruiter Create job
PUT /:id Recruiter Update job
DELETE /:id Recruiter Delete job
GET /recruiter/my-jobs Recruiter Get recruiter's jobs
Applications (/api/applications) — Protected
Method Endpoint Auth Description
POST /apply User Apply for job
GET /my-applications User Get user's applications
DELETE /:id User Withdraw application
GET /job/:jobId Recruiter Get job applications
PUT /:id/status Recruiter Update status
Matches (/api/matches) — Recruiter Only
Method Endpoint Description
GET /job/:jobId/candidates Get candidates with match scores
GET /application/:id/analysis AI analysis for application
Company (/api/company) — Recruiter Only
Method Endpoint Description
GET /profile Get company profile
PUT /profile Update company profile
POST /logo Upload company logo
🔄 Key System Flows
Job Seeker Flow
text
Register/Login → Upload Resume → AI Parsing → View Resume Page
↓
Browse Jobs (match score badges) → Apply with Cover Letter
↓
Track Applications → View Skill Gap Analysis → Follow Roadmap
Recruiter Flow
text
Register/Login → Setup Company Profile → Post Jobs
↓
View Candidates (AI-ranked by match score)
↓
Review Applications → Update Status → Add Notes
↓
View Analytics & Dashboard Stats
Avatar Upload Flow
text
User clicks avatar → File picker → Preview shown
↓
Save Changes → Upload to Cloudinary → Old avatar deleted
↓
Redux updated → UI reflects new avatar
🔧 Environment Variables
env
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=
GEMINI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=SkillSync AI
FRONTEND_URL=http://localhost:5173
📊 Feature Status
Feature Status
Email/Password Auth ✅
Google OAuth ✅
Email Verification ✅
Password Reset ✅
Role-based Access ✅
Resume Upload & AI Parsing ✅
Cloudinary Storage (Avatars, Logos, Resumes) ✅
User Profile (Save/Cancel) ✅
Company Profile ✅
Job CRUD ✅
Application System ✅
Match Algorithm ✅
AI Match Analysis ✅
Candidate Management ✅
Recruiter Dashboard ✅
Analytics Charts ✅
User Dashboard ✅
Skill Gap Analysis ✅
Roadmap Generation ✅
Marketing Pages ✅
Dark Mode ✅
Mobile Responsive ✅
Redux Persistence ✅
RTK Query Caching ✅
Zod Validation ✅
🏆 Technical Highlights
Full-Stack Authentication — JWT, Google OAuth, email verification, password reset, role-based guards

AI-Powered Resume Parsing — Gemini API with multi-model fallback + 60+ skill keyword extraction

Intelligent Job Matching — Skill-based scoring, AI analysis, color-coded badges

Cloud File Management — Multer + Cloudinary with old file cleanup on re-upload

Email Service — Brevo REST API (bypasses Render SMTP blocks)

Save/Cancel UX Pattern — Profile edits only persist on explicit Save

50+ shadcn/ui Components — Consistent, accessible UI kit

Dark Mode — Full Tailwind CSS dark mode support

🔑 Key Files for AI Agents
If you need to work on:
Authentica
