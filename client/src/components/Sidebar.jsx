// client/src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Briefcase,
  TrendingUp,
  Map,
  Users,
  UserCircle,
  Settings,
  Building2,
  Sparkles,
  LogOut,
  Bell,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useGetNotificationsQuery } from "../services/notificationApi";
import { OptimizedAvatar } from "./common/OptimizedAvatar";

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isDesktop;
};

export function Sidebar({
  isOpen = false,
  onClose,
  onLogout,
  darkMode,
  onDarkModeToggle,
  onNotificationsClick,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const isDesktop = useIsDesktop();

  const [isMinimized, setIsMinimized] = useState(() => {
    if (!isDesktop) return false;
    const saved = localStorage.getItem("sidebarMinimized");
    return saved !== "false";
  });

  const { data: notificationsData } = useGetNotificationsQuery(undefined, {
    skip: !user,
  });
  const unreadCount = notificationsData?.unreadCount || 0;

  useEffect(() => {
    if (isDesktop) {
      localStorage.setItem("sidebarMinimized", isMinimized);
    }
  }, [isMinimized, isDesktop]);

  useEffect(() => {
    if (!isDesktop && isMinimized) {
      setIsMinimized(false);
    }
  }, [isDesktop, isMinimized]);

  const isRecruiter = user?.role === "recruiter";

  const getAvatarUrl = () => {
    if (user?.avatar) return user.avatar;
    if (isRecruiter && user?.company?.logo) return user.company.logo;
    return null;
  };
  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes("/app/dashboard")) return "dashboard";
    if (path.includes("/app/resume")) return "resume";
    if (path.includes("/app/jobs-posted")) return "jobs-posted";
    if (path.includes("/app/jobs") && !path.includes("/app/jobs-posted"))
      return "jobs";
    if (path.includes("/app/my-applications")) return "my-applications";
    if (path.includes("/app/skill-gap")) return "skill-gap";
    if (path.includes("/app/roadmap")) return "roadmap";
    if (path.includes("/app/profile")) return "profile";
    if (path.includes("/app/recruiter-dashboard")) return "recruiter-dashboard";
    if (path.includes("/app/candidates")) return "candidates";
    if (path.includes("/app/analytics")) return "analytics";
    if (path.includes("/app/company")) return "company";
    if (path.includes("/app/settings")) return "settings";
    return isRecruiter ? "recruiter-dashboard" : "dashboard";
  };

  const currentView = getCurrentView();

  const jobseekerItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/app/dashboard" },
    { id: "resume", label: "Resume", icon: FileText, path: "/app/resume" },
    { id: "jobs", label: "Jobs", icon: Briefcase, path: "/app/jobs" },
    {
      id: "my-applications",
      label: "Applications",
      icon: FileText,
      path: "/app/my-applications",
    },
    {
      id: "skill-gap",
      label: "Skill Gap",
      icon: TrendingUp,
      path: "/app/skill-gap",
    },
    { id: "roadmap", label: "Roadmap", icon: Map, path: "/app/roadmap" },
    { id: "profile", label: "Profile", icon: UserCircle, path: "/app/profile" },
  ];

  const recruiterItems = [
    {
      id: "recruiter-dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/app/recruiter-dashboard",
    },
    {
      id: "candidates",
      label: "Candidates",
      icon: Users,
      path: "/app/candidates",
    },
    {
      id: "jobs-posted",
      label: "Posted Jobs",
      icon: Briefcase,
      path: "/app/jobs-posted",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: TrendingUp,
      path: "/app/analytics",
    },
    { id: "company", label: "Company", icon: Building2, path: "/app/company" },
  ];

  const items = isRecruiter ? recruiterItems : jobseekerItems;

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const toggleMinimize = () => {
    if (isDesktop) setIsMinimized(!isMinimized);
  };

  const lightGradient =
    "bg-gradient-to-br from-[#5B2C8F] via-[#7C3AED] to-[#A855F7]";
  const darkGradient =
    "dark:bg-gradient-to-br dark:from-[#0F0F1A] dark:via-[#1A1A2E] dark:to-[#16213E]";

  const sidebarWidthClass = isDesktop
    ? isMinimized
      ? "w-[280px] sm:w-[320px] lg:w-[80px]"
      : "w-[280px] sm:w-[320px] lg:w-[280px]"
    : "w-[280px] sm:w-[320px]";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full ${sidebarWidthClass}
          ${lightGradient} ${darkGradient}
          flex flex-col transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:rounded-r-2xl 
          lg:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset]
          dark:lg:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]
        `}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        </div>

        {/* Logo Section */}
        <div
          className={`relative px-5 py-6 border-b border-white/10 dark:border-white/5 transition-all duration-300 ${isMinimized && isDesktop ? "lg:px-4" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-white rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${isMinimized && isDesktop ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100"}`}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white whitespace-nowrap tracking-tight">
                  SkillSync
                </span>
                <span className="text-xl font-bold text-white/80 whitespace-nowrap">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-white/50 -mt-0.5 whitespace-nowrap">
                Career Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Modern Minimize Control */}
        {isDesktop && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-50">
            <button
              onClick={toggleMinimize}
              className="group relative flex items-center justify-center w-5 h-16 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-white/40 dark:border-gray-700/80 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400 transition-all duration-300 dot-1" />
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400 transition-all duration-300 dot-2" />
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400 transition-all duration-300 dot-3" />
              </div>
              <div className="absolute right-full mr-3 px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg">
                {isMinimized ? "Expand sidebar" : "Collapse sidebar"}
              </div>
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <div className="relative flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <nav className="space-y-1.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    relative flex items-center gap-3 rounded-xl transition-all duration-300 group
                    ${isActive
                      ? "bg-gradient-to-r from-purple-500/40 to-indigo-500/40 backdrop-blur-md text-white font-medium shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-white/20"
                      : "text-white/60 hover:bg-white/10 hover:text-white border border-transparent"
                    }
                    ${isMinimized && isDesktop ? "lg:w-11 lg:h-11 lg:p-0 lg:justify-center mx-auto" : "w-full px-3 py-2.5"}
                  `}
                  title={isMinimized && isDesktop ? item.label : ""}
                >
                  <Icon
                    className={`w-5 h-5 transition-all duration-200 shrink-0 ${isActive
                      ? "text-white"
                      : "text-white/60 group-hover:text-white group-hover:scale-110 group-hover:drop-shadow-[0_0_3px_rgba(255,255,255,0.4)]"
                      }`}
                  />
                  <span
                    className={`text-sm font-medium transition-all duration-300 ${isMinimized && isDesktop ? "lg:hidden" : ""}`}
                  >
                    {item.label}
                  </span>
                  {isActive && !(isMinimized && isDesktop) && (
                    <ChevronRight className="ml-auto w-4 h-4 text-white/60" />
                  )}
                  {isActive && isMinimized && isDesktop && (
                    <div className="absolute -left-2 w-1 h-6 bg-white rounded-r-full shadow-[0_0_10px_white]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div
          className={`relative px-3 py-5 border-t border-white/10 dark:border-white/5 mt-auto space-y-1.5 transition-all duration-300 ${isMinimized && isDesktop ? "lg:px-2" : ""}`}
        >
          {/* User Profile Section */}
          <div
            className={`
            flex items-center px-3 py-2 mb-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg
            ${isMinimized && isDesktop ? "lg:justify-center lg:px-2 lg:gap-0 gap-3 rounded-full lg:w-14 lg:h-14 lg:p-0 mx-auto" : "gap-3 rounded-xl"}
          `}
          >
            <div className="relative w-10 h-10 flex-shrink-0 shadow-md rounded-full">
              <OptimizedAvatar
                src={getAvatarUrl()}
                alt={user?.name}
                fallbackText={getInitials()}
                className="w-full h-full text-sm"
                size={100}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${isMinimized && isDesktop ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100"}`}
            >
              <p className="text-sm font-semibold text-white truncate whitespace-nowrap">
                {user?.name || "Guest User"}
              </p>
              <p className="text-xs text-white/60 mt-0.5 flex items-center gap-1.5 whitespace-nowrap">
                {isRecruiter ? "Recruiter" : "Job Seeker"}
              </p>
            </div>
          </div>

          {/* Home (Marketing Page) */}
          <button
            onClick={() => handleNavigation("/")}
            className={`flex items-center gap-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300 group border border-transparent 
                ${isMinimized && isDesktop ? "lg:w-11 lg:h-11 lg:p-0 lg:justify-center mx-auto" : "w-full px-3 py-2.5"}`}
            title={isMinimized && isDesktop ? "Home" : ""}
          >
            <Home className="w-5 h-5 text-white/60 group-hover:text-white group-hover:scale-110 transition-all duration-200 shrink-0" />
            <span
              className={`text-sm font-medium ${isMinimized && isDesktop ? "lg:hidden" : ""}`}
            >
              Home Page
            </span>
          </button>

          {/* Notifications */}
          <button
            onClick={onNotificationsClick}
            className={`flex items-center gap-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300 group border border-transparent 
              ${isMinimized && isDesktop ? "lg:w-11 lg:h-11 lg:p-0 lg:justify-center mx-auto" : "w-full px-3 py-2.5"}`}
            title={isMinimized && isDesktop ? "Notifications" : ""}
          >
            <div className="relative flex items-center justify-center">
              <Bell className="w-5 h-5 text-white/60 group-hover:text-white group-hover:scale-110 transition-all duration-200 shrink-0" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <div className={`flex items-center justify-between w-full transition-all duration-300 ${isMinimized && isDesktop ? "lg:hidden" : ""}`}>
              <span className="text-sm font-medium">Notifications</span>
            </div>
          </button>


          {/* Dark Mode Toggle */}
          <button
            onClick={onDarkModeToggle}
            className={`flex items-center gap-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300 group border border-transparent 
              ${isMinimized && isDesktop ? "lg:w-11 lg:h-11 lg:p-0 lg:justify-center mx-auto" : "w-full px-3 py-2.5"}`}
            title={
              isMinimized && isDesktop
                ? darkMode
                  ? "Light Mode"
                  : "Dark Mode"
                : ""
            }
          >
            {darkMode ? (
              <>
                <Sun className="w-5 h-5 text-yellow-300 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-200 shrink-0" />
                <span
                  className={`text-sm font-medium ${isMinimized && isDesktop ? "lg:hidden" : ""}`}
                >
                  Light Mode
                </span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 text-white/60 group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-200 shrink-0" />
                <span
                  className={`text-sm font-medium ${isMinimized && isDesktop ? "lg:hidden" : ""}`}
                >
                  Dark Mode
                </span>
              </>
            )}
          </button>



          {/* Logout */}
          <div className="pt-2">
            <button
              onClick={onLogout}
              className={`flex items-center gap-3 rounded-xl text-red-300/80 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 group border border-transparent
                ${isMinimized && isDesktop ? "lg:w-11 lg:h-11 lg:p-0 lg:justify-center mx-auto" : "w-full px-3 py-2.5"}`}
              title={isMinimized && isDesktop ? "Sign Out" : ""}
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 group-hover:scale-105 transition-transform duration-200 shrink-0" />
              <span
                className={`text-sm font-medium ${isMinimized && isDesktop ? "lg:hidden" : ""}`}
              >
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }
        .dark .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); }
        @media (min-width: 1024px) { aside { transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); } }

        /* Sequential Blinking Dots Animation */
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(0.75); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        .dot-1 { animation: pulse-dot 1.5s infinite ease-in-out; animation-delay: 0s; }
        .dot-2 { animation: pulse-dot 1.5s infinite ease-in-out; animation-delay: 0.2s; }
        .dot-3 { animation: pulse-dot 1.5s infinite ease-in-out; animation-delay: 0.4s; }
        
        button:hover .dot-1, button:hover .dot-2, button:hover .dot-3 {
          animation: none;
          opacity: 1;
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
}