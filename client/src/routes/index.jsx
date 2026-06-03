/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { RootLayout } from "../layouts/root-layout";
import { AuthenticatedLayout } from "../layouts/authenticated-layout";
import { MarketingLayout } from "../layouts/marketing-layout";
import { ProtectedRoute } from "./protected-route";
import { getUser, getRedirectPath } from "../features/auth/authUtils";
import { USER_ROLES } from "../features/auth/authConstants";
import { PageLoader } from "../components/PageLoader";
import ErrorBoundary from "../components/ErrorBoundary";
import { NotFoundPage } from "../pages/NotFoundPage";

// Lazy Loaded Marketing Pages
const LandingPage = lazy(() => import("../pages/marketing/LandingPage").then(m => ({ default: m.LandingPage })));
const FeaturesPage = lazy(() => import("../pages/marketing/FeaturesPage").then(m => ({ default: m.FeaturesPage })));
const AboutPage = lazy(() => import("../pages/marketing/AboutPage").then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import("../pages/marketing/ContactPage").then(m => ({ default: m.ContactPage })));
const TestimonialsPage = lazy(() => import("../pages/marketing/TestimonialsPage").then(m => ({ default: m.TestimonialsPage })));

// Lazy Loaded Authenticated Pages - Common
const Dashboard = lazy(() => import("../pages/jobseeker/Dashboard").then(m => ({ default: m.Dashboard })));
const JobsPage = lazy(() => import("../pages/jobseeker/JobsPage").then(m => ({ default: m.JobsPage })));
const SettingsPage = lazy(() => import("../pages/SettingsPage").then(m => ({ default: m.SettingsPage })));

// Lazy Loaded Job Seeker Only Pages
const ResumePage = lazy(() => import("../pages/jobseeker/ResumePage").then(m => ({ default: m.ResumePage })));
const SkillGapPage = lazy(() => import("../pages/jobseeker/SkillGapPage").then(m => ({ default: m.SkillGapPage })));
const RoadmapPage = lazy(() => import("../pages/jobseeker/RoadmapPage").then(m => ({ default: m.RoadmapPage })));
const ProfilePage = lazy(() => import("../pages/jobseeker/ProfilePage").then(m => ({ default: m.ProfilePage })));
const MyApplicationsPage = lazy(() => import("../pages/jobseeker/MyApplicationsPage").then(m => ({ default: m.MyApplicationsPage })));
const JobDetailsPage = lazy(() => import("../pages/jobseeker/JobDetailsPage"));

// Lazy Loaded Recruiter Only Pages
const RecruiterDashboard = lazy(() => import("../pages/recruiter/RecruiterDashboard").then(m => ({ default: m.RecruiterDashboard })));
const CandidatesListPage = lazy(() => import("../pages/recruiter/CandidatesListPage").then(m => ({ default: m.CandidatesListPage })));
const CandidateProfile = lazy(() => import("../pages/recruiter/CandidateProfile").then(m => ({ default: m.CandidateProfile })));
const PostedJobsPage = lazy(() => import("../pages/recruiter/PostedJobsPage").then(m => ({ default: m.PostedJobsPage })));
const AnalyticsPage = lazy(() => import("../pages/recruiter/AnalyticsPage").then(m => ({ default: m.AnalyticsPage })));
const CompanyPage = lazy(() => import("../pages/recruiter/CompanyPage").then(m => ({ default: m.CompanyPage })));
const PublicCompanyPage = lazy(() => import("../pages/recruiter/PublicCompanyPage").then(m => ({ default: m.PublicCompanyPage })));
const JobApplicationsPage = lazy(() => import("../pages/recruiter/JobApplicationsPage").then(m => ({ default: m.JobApplicationsPage })));

// Auth Pages
const AuthPage = lazy(() => import("../pages/auth/AuthPage").then(m => ({ default: m.AuthPage })));
const VerifyEmailPage = lazy(() => import("../pages/auth/VerifyEmailPage"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage").then(m => ({ default: m.ResetPasswordPage })));

// Route-level error fallback
function RouteErrorFallback() {
  return (
    <ErrorBoundary>
      <NotFoundPage />
    </ErrorBoundary>
  );
}

// Suspense Wrapper component
const Loadable = (Component) => (props) => (
  <Suspense fallback={<PageLoader />}>
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  </Suspense>
);

// Simple Suspense Wrapper for public/auth pages
const SimpleLoadable = (Component) => (props) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" /></div>}>
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  </Suspense>
);

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
    errorElement: <RouteErrorFallback />,
    children: [
      // Marketing Routes (public)
      {
        element: <MarketingLayout />,
        children: [
          { index: true, element: SimpleLoadable(LandingPage)() },
          { path: "features", element: SimpleLoadable(FeaturesPage)() },
          { path: "about", element: SimpleLoadable(AboutPage)() },
          { path: "contact", element: SimpleLoadable(ContactPage)() },
          { path: "testimonials", element: SimpleLoadable(TestimonialsPage)() },
        ],
      },

      // Auth Routes (public)
      { path: "auth", element: SimpleLoadable(AuthPage)() },
      { path: "verify-email", element: SimpleLoadable(VerifyEmailPage)() },
      { path: "forgot-password", element: SimpleLoadable(ForgotPasswordPage)() },
      { path: "reset-password", element: SimpleLoadable(ResetPasswordPage)() },

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
          { path: "settings", element: Loadable(SettingsPage)() },
          { path: "jobs/:jobId", element: Loadable(JobDetailsPage)() },
          { path: "companies/:recruiterId", element: Loadable(PublicCompanyPage)() },
          { path: "", element: <RoleBasedRedirect /> },

          // ========== JOB SEEKER ONLY ROUTES ==========
          {
            path: "jobs",
            element: (
              <ProtectedRoute requiredRole={USER_ROLES.JOBSEEKER}>
                {Loadable(JobsPage)()}
              </ProtectedRoute>
            ),
          },
          {
            path: "dashboard",
            element: (
              <ProtectedRoute requiredRole="jobseeker">
                {Loadable(Dashboard)()}
              </ProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute requiredRole="jobseeker">
                {Loadable(ProfilePage)()}
              </ProtectedRoute>
            ),
          },
          {
            path: "resume",
            element: (
              <ProtectedRoute requiredRole="jobseeker">
                {Loadable(ResumePage)()}
              </ProtectedRoute>
            ),
          },
          {
            path: "my-applications",
            element: (
              <ProtectedRoute requiredRole="jobseeker">
                {Loadable(MyApplicationsPage)()}
              </ProtectedRoute>
            ),
          },
          {
            path: "skill-gap",
            element: (
              <ProtectedRoute requiredRole="jobseeker">
                {Loadable(SkillGapPage)()}
              </ProtectedRoute>
            ),
          },
          {
            path: "roadmap",
            element: (
              <ProtectedRoute requiredRole="jobseeker">
                {Loadable(RoadmapPage)()}
              </ProtectedRoute>
            ),
          },

          // ========== RECRUITER ONLY ROUTES ==========
          {
            path: "recruiter-dashboard",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                {Loadable(RecruiterDashboard)()}
              </ProtectedRoute>
            ),
          },
          {
            path: "company",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                {Loadable(CompanyPage)()}
              </ProtectedRoute>
            ),
          },
          {
            path: "candidates",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                {Loadable(CandidatesListPage)()}
              </ProtectedRoute>
            ),
          },
          {
            path: "candidates/:id",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                {Loadable(CandidateProfile)()}
              </ProtectedRoute>
            ),
          },
          {
            path: "jobs-posted",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                {Loadable(PostedJobsPage)()}
              </ProtectedRoute>
            ),
          },
          {
            path: "analytics",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                {Loadable(AnalyticsPage)()}
              </ProtectedRoute>
            ),
          },
          {
            path: "jobs/:jobId/applications",
            element: (
              <ProtectedRoute requiredRole="recruiter">
                {Loadable(JobApplicationsPage)()}
              </ProtectedRoute>
            ),
          },
        ],
      },


      // Catch all - 404
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
