// client/src/routes/index.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "../layouts/root-layout";
import { AuthenticatedLayout } from "../layouts/authenticated-layout";
import { MarketingLayout } from "../layouts/marketing-layout";
import { ProtectedRoute } from "./protected-route";
import { getUser, getRedirectPath } from "../features/auth/authUtils";

// Marketing Pages
import { LandingPage } from "../pages/marketing/LandingPage";
import { FeaturesPage } from "../pages/marketing/FeaturesPage";
import { AboutPage } from "../pages/marketing/AboutPage";
import { ContactPage } from "../pages/marketing/ContactPage";

// Authenticated Pages - Common
import { Dashboard } from "../pages/jobseeker/Dashboard";
import { JobsPage } from "../pages/jobseeker/JobsPage";
import { SettingsPage } from "../pages/SettingsPage";

// Job Seeker Only Pages
import { ResumePage } from "../pages/jobseeker/ResumePage";
import { SkillGapPage } from "../pages/jobseeker/SkillGapPage";
import { RoadmapPage } from "../pages/jobseeker/RoadmapPage";
import { ProfilePage } from "../pages/jobseeker/ProfilePage";
import MyApplicationsPage from "../pages/jobseeker/MyApplicationsPage";
import JobDetailsPage from "../pages/jobseeker/JobDetailsPage";
// Recruiter Only Pages
import { RecruiterDashboard } from "../pages/recruiter/RecruiterDashboard";
import { CandidatesListPage } from "../pages/recruiter/CandidatesListPage";
import { CandidateProfile } from "../pages/recruiter/CandidateProfile";
import { PostedJobsPage } from "../pages/recruiter/PostedJobsPage";
import { AnalyticsPage } from "../pages/recruiter/AnalyticsPage";
import { CompanyPage } from "../pages/recruiter/CompanyPage";
import { PublicCompanyPage } from "../pages/recruiter/PublicCompanyPage";
import JobApplicationsPage from "../pages/recruiter/JobApplicationsPage";

// Auth Pages
import { AuthPage } from "../pages/auth/AuthPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import { USER_ROLES } from "../features/auth/authConstants";

// Role-based redirect component
function RoleBasedRedirect() {
  const user = getUser();
  const redirectPath = getRedirectPath(user?.role);
  return <Navigate to={redirectPath} replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Marketing Routes (public)
      {
        element: <MarketingLayout />,
        children: [
          { index: true, element: <LandingPage /> },
          { path: "features", element: <FeaturesPage /> },
          { path: "about", element: <AboutPage /> },
          { path: "contact", element: <ContactPage /> },
        ],
      },

      // Auth Routes (public)
      { path: "auth", element: <AuthPage /> },
      { path: "verify-email", element: <VerifyEmailPage /> },

      // Protected Routes (require authentication)
      {
        path: "app",
        element: (
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        ),
        children: [
          // ========== COMMON ROUTES (Both roles can access) ==========
          { path: "settings", element: <SettingsPage /> },
          { path: "jobs/:jobId", element: <JobDetailsPage /> },
          { path: "companies/:recruiterId", element: <PublicCompanyPage /> },
          { path: "", element: <RoleBasedRedirect /> },

          // ========== JOB SEEKER ONLY ROUTES ==========
          {
            path: "jobs",
            element: (
              <ProtectedRoute requiredRole={USER_ROLES.JOBSEEKER}>
                <JobsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "dashboard",
            element: (
              <ProtectedRoute requiredRole="jobseeker">
                <Dashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute requiredRole="jobseeker">
                <ProfilePage />
              </ProtectedRoute>
            ),
          },
          {
            path: "resume",
            element: (
              <ProtectedRoute requiredRole="jobseeker">
                <ResumePage />
              </ProtectedRoute>
            ),
          },
          {
            path: "my-applications",
            element: (
              <ProtectedRoute requiredRole="jobseeker">
                <MyApplicationsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "skill-gap",
            element: (
              <ProtectedRoute requiredRole="jobseeker">
                <SkillGapPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "roadmap",
            element: (
              <ProtectedRoute requiredRole="jobseeker">
                <RoadmapPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "jobs/:jobId",
            element: (
              <ProtectedRoute>
                <JobDetailsPage />
              </ProtectedRoute>
            ),
          },

          // ========== RECRUITER ONLY ROUTES ==========
          {
            path: "recruiter-dashboard",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "company",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                <CompanyPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "candidates",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                <CandidatesListPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "candidates/:id",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                <CandidateProfile />
              </ProtectedRoute>
            ),
          },
          {
            path: "jobs-posted",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                <PostedJobsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "analytics",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                <AnalyticsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "jobs/:jobId/applications",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                <JobApplicationsPage />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Catch all - 404
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
