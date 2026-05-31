// client/src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Bell, Menu, Sparkles, Moon, Sun, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetNotificationsQuery } from "../services/notificationApi";

export function Navbar({
  onMenuClick,
  onNotificationsClick,
  darkMode,
  onDarkModeToggle,
  isMenuOpen = false,
}) {
  const [scrolled, setScrolled] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const { data: notificationsData } = useGetNotificationsQuery();
  const unreadCount = notificationsData?.unreadCount || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Premium gradient matching sidebar
  const lightGradient =
    "bg-gradient-to-r from-[#5B2C8F] via-[#7C3AED] to-[#A855F7]";
  const lightGradientScrolled =
    "bg-gradient-to-r from-[#5B2C8F]/95 via-[#7C3AED]/95 to-[#A855F7]/95";
  const darkGradient =
    "dark:bg-gradient-to-r dark:from-[#0F0F1A] dark:via-[#1A1A2E] dark:to-[#16213E]";
  const darkGradientScrolled =
    "dark:bg-gradient-to-r dark:from-[#0F0F1A]/95 dark:via-[#1A1A2E]/95 dark:to-[#16213E]/95";

  return (
    <>
      <nav
        className={`
          lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${
            scrolled
              ? `${darkMode ? darkGradientScrolled : lightGradientScrolled} backdrop-blur-xl shadow-lg`
              : `${darkMode ? darkGradient : lightGradient}`
          }
        `}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Sparkles
                  className="w-4.5 h-4.5 text-white"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">
                  SkillSync
                </span>
                <span className="text-base font-bold text-white/80">AI</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              {/* Dark Mode Toggle */}
              <button
                onClick={onDarkModeToggle}
                className="p-2 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-yellow-300" />
                ) : (
                  <Moon className="w-4 h-4 text-white" />
                )}
              </button>

              {/* Notifications */}
              <button
                onClick={onNotificationsClick}
                className="relative p-2 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200"
              >
                <Bell className="w-4 h-4 text-white" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-white dark:ring-gray-800">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </>
                )}
              </button>

              {/* Menu Toggle */}
              <button
                onClick={onMenuClick}
                className="p-2 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer for fixed navbar */}
      <div className="h-[60px] lg:hidden" />
    </>
  );
}
