// client/src/components/Sidebar.jsx
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
  X,
  Sparkles,
  LogOut,
  Bell,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";

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

  const isRecruiter = user?.role === "recruiter";
  const isJobSeeker = user?.role === "jobseeker" || user?.role === "user";

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return user.avatar;
    }
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

  // ✅ Job Seeker (Candidate) Menu Items
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

  // ✅ Recruiter Menu Items
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

  const lightGradient =
    "bg-gradient-to-br from-[#6f31f8] via-[#7c3aed] to-[#8b5cf6]";
  const darkGradient =
    "dark:bg-gradient-to-br dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f3460]";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 lg:hidden dark:bg-black/60"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[70%] md:w-[50%] lg:max-w-[230px] xl:max-w-[280px]
          ${lightGradient} ${darkGradient}
          flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          
          lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-72 lg:translate-x-0
          lg:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3),20px_0_45px_-20px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)_inset]
          dark:lg:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),20px_0_45px_-20px_rgba(0,0,0,0.6)]
          lg:mr-4 
        `}
      >
        {/* Decorative Blur Elements */}
        <div className="absolute top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl dark:bg-white/5" />
        <div className="absolute bottom-10 -left-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl dark:bg-purple-900/10" />

        {/* Logo Section */}
        <div className="relative px-5 py-6 border-b border-white/10 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-xl blur-md opacity-30 dark:opacity-20" />
              <div className="relative w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white dark:text-white">
                  SkillSync
                </span>
                <span className="text-xl font-bold text-white/80 dark:text-white/80">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-white/60 dark:text-white/50 -mt-0.5">
                Career Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="relative flex-1 overflow-y-auto py-5 px-3 custom-scrollbar">
          <nav className="space-y-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-white/20 backdrop-blur-sm text-white font-medium shadow-lg dark:bg-white/10"
                        : "text-white/70 hover:bg-white/10 hover:text-white dark:text-white/60 dark:hover:bg-white/5"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-all duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-white/60 group-hover:text-white dark:text-white/50"
                    }`}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="ml-auto w-4 h-4 text-white/80 dark:text-white/60" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="relative px-3 py-5 border-t border-white/10 dark:border-white/5 mt-auto space-y-1">
          {/* User Avatar Section - Fixed */}
          <div className="flex items-center gap-4 px-3 py-3 mb-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg">
            {/* Avatar - Show either image OR initials, not both */}
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg shadow-md overflow-hidden">
              {getAvatarUrl() ? (
                <img
                  src={getAvatarUrl()}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.target.style.display = "none";
                    // Show initials on error
                    const parent = e.target.parentElement;
                    if (parent) {
                      const span = document.createElement("span");
                      span.className = "relative z-10";
                      span.textContent = getInitials();
                      parent.appendChild(span);
                    }
                  }}
                />
              ) : (
                <span className="relative z-10">{getInitials()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate tracking-wide">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-white/70 mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-sm shadow-green-400/50"></span>
                {isRecruiter ? "Recruiter" : "Job Seeker"}
              </p>
            </div>
          </div>
          {/* Buttons */}
          <button
            onClick={onNotificationsClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group"
          >
            <Bell className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium">Notifications</span>
          </button>
          <button
            onClick={onDarkModeToggle}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group"
          >
            {darkMode ? (
              <>
                <Sun className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-medium">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 text-white/60 group-hover:-rotate-12 transition-transform" />
                <span className="text-sm font-medium">Dark Mode</span>
              </>
            )}
          </button>
          <button
            onClick={() => handleNavigation("/app/settings")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group"
          >
            <Settings className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <div className="pt-2">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-white transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.35);
        }
      `}</style>
    </>
  );
}
