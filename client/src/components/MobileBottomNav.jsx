import { useNavigate, useLocation } from "react-router-dom";
import { Home, Briefcase, FileText, User } from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Home", icon: Home, path: "/app/dashboard" },
  { id: "jobs", label: "Jobs", icon: Briefcase, path: "/app/jobs" },
  { id: "resume", label: "Resume", icon: FileText, path: "/app/resume" },
  { id: "profile", label: "Profile", icon: User, path: "/app/profile" },
];

export function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 lg:hidden z-40 shadow-lg">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? "text-purple-600 bg-purple-50 scale-105"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <item.icon
              className={`w-5 h-5 ${isActive(item.path) ? "scale-110" : ""}`}
            />
            <span className="text-[11px] font-medium">{item.label}</span>
            {isActive(item.path) && (
              <div className="w-1 h-1 rounded-full bg-purple-600 mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
