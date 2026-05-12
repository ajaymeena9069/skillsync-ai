import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "../layouts/root-layout";
import { AuthenticatedLayout } from "../layouts/authenticated-layout";
import { MarketingLayout } from "../layouts/marketing-layout";
import { ProtectedRoute } from "./protected-route";

// Marketing Pages
import { LandingPage } from "../pages/marketing/LandingPage";
import { FeaturesPage } from "../pages/marketing/FeaturesPage";
import { AboutPage } from "../pages/marketing/AboutPage";
import { ContactPage } from "../pages/marketing/ContactPage";

// Authenticated Pages
import { Dashboard } from "../pages/Dashboard";
import { ResumePage } from "../pages/ResumePage";
import { JobsPage } from "../pages/JobsPage";
import { SkillGapPage } from "../pages/SkillGapPage";
import { RoadmapPage } from "../pages/RoadmapPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RecruiterDashboard } from "../pages/RecruiterDashboard";
import { CandidateProfile } from "../pages/CandidateProfile";

// Auth Pages
import { AuthPage } from "../pages/auth/AuthPage";

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

      // Auth Route
      { path: "auth", element: <AuthPage /> },

      // Protected Routes (require authentication)
      {
        path: "app",
        element: (
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "resume", element: <ResumePage /> },
          { path: "jobs", element: <JobsPage /> },
          { path: "skill-gap", element: <SkillGapPage /> },
          { path: "roadmap", element: <RoadmapPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "recruiter-dashboard", element: <RecruiterDashboard /> },
          { path: "candidates", element: <CandidateProfile /> },
          { path: "", element: <Navigate to="/app/dashboard" replace /> },
        ],
      },

      // Catch all - 404
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
