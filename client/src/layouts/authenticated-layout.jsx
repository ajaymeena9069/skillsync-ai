// client/src/layouts/AuthenticatedLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { NotificationsPanel } from "../components/NotificationsPanel";
import { AIChat } from "../components/AIChat";
import { MessageSquare } from "lucide-react";
import { logoutUser } from "../features/auth/authSlice";
import { removeAuthData, getUser } from "../features/auth/authUtils";

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const user = getUser();
  const userType = user?.role === "recruiter" ? "recruiter" : "jobseeker";

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (isDark || (!localStorage.getItem("darkMode") && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const getCurrentViewFromPath = () => {
    const path = location.pathname;
    if (path === "/app/dashboard" || path.startsWith("/app/dashboard"))
      return "dashboard";
    if (path === "/app/resume" || path.startsWith("/app/resume"))
      return "resume";
    if (path === "/app/jobs" || path.startsWith("/app/jobs")) return "jobs";
    if (path === "/app/skill-gap" || path.startsWith("/app/skill-gap"))
      return "skill-gap";
    if (path === "/app/roadmap" || path.startsWith("/app/roadmap"))
      return "roadmap";
    if (path === "/app/profile" || path.startsWith("/app/profile"))
      return "profile";
    if (
      path === "/app/recruiter-dashboard" ||
      path.startsWith("/app/recruiter-dashboard")
    )
      return "recruiter-dashboard";
    if (path === "/app/candidates" || path.startsWith("/app/candidates"))
      return "candidates";
    if (path === "/app/jobs-posted" || path.startsWith("/app/jobs-posted"))
      return "jobs-posted";
    if (path === "/app/analytics" || path.startsWith("/app/analytics"))
      return "analytics";
    if (path === "/app/company" || path.startsWith("/app/company"))
      return "company";
    return "dashboard";
  };

  const [currentView, setCurrentView] = useState(getCurrentViewFromPath());

  useEffect(() => {
    setCurrentView(getCurrentViewFromPath());
  }, [location.pathname]);

  const handleViewChange = (view) => {
    setCurrentView(view);
    const routeMap = {
      dashboard: "/app/dashboard",
      resume: "/app/resume",
      jobs: "/app/jobs",
      "skill-gap": "/app/skill-gap",
      roadmap: "/app/roadmap",
      profile: "/app/profile",
      "recruiter-dashboard": "/app/recruiter-dashboard",
      candidates: "/app/candidates",
      "jobs-posted": "/app/jobs-posted",
      analytics: "/app/analytics",
      company: "/app/company",
      settings: "/app/settings",
    };
    navigate(routeMap[view] || "/app/dashboard");
  };

  const handleLogout = () => {
    removeAuthData();
    dispatch(logoutUser());
    navigate("/");
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Decorative Background Elements - Simplified */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-indigo-500/5 dark:from-purple-500/2 dark:to-indigo-500/2 rounded-full filter blur-3xl"></div>
      </div>

      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onNotificationsClick={() => setNotificationsOpen(true)}
        darkMode={darkMode}
        onDarkModeToggle={handleDarkModeToggle}
        isMenuOpen={sidebarOpen}
      />

      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        userType={userType}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        darkMode={darkMode}
        onDarkModeToggle={handleDarkModeToggle}
        onNotificationsClick={() => setNotificationsOpen(true)}
      />

      <main className="lg:ml-64 xl:ml-72 min-h-screen overflow-x-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </main>

      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <AIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all hover:scale-105 z-30"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    </div>
  );
}
