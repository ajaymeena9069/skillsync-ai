// client/src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Bell, Menu, Sparkles, Moon, Sun, X } from "lucide-react";
import { getUser } from "../features/auth/authUtils";
import { useSelector } from "react-redux";

export function Navbar({
  onMenuClick,
  onNotificationsClick,
  darkMode,
  onDarkModeToggle,
  isMenuOpen = false,
}) {
  const [scrolled, setScrolled] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper function to get avatar URL
  const getAvatarUrl = () => {
    if (user?.avatar) {
      return user.avatar;
    }
    return null;
  };

  const lightGradient =
    "bg-gradient-to-r from-[#6f31f8] via-[#7c3aed] to-[#8b5cf6]";
  const lightGradientScrolled =
    "bg-gradient-to-r from-[#6f31f8]/95 via-[#7c3aed]/95 to-[#8b5cf6]/95";
  const darkGradient =
    "bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-[#4c1d95]";
  const darkGradientScrolled =
    "bg-gradient-to-r from-[#1e1b4b]/95 via-[#2e1065]/95 to-[#4c1d95]/95";

  return (
    <>
      <nav
        className={`
          lg:hidden
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            scrolled
              ? `${darkMode ? darkGradientScrolled : lightGradientScrolled} backdrop-blur-xl`
              : `${darkMode ? darkGradient : lightGradient}`
          }
        `}
      >
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-white">
                SkillSyncAI
              </span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={onDarkModeToggle}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-yellow-300" />
                ) : (
                  <Moon className="w-4 h-4 text-white" />
                )}
              </button>

              <button
                onClick={onNotificationsClick}
                className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
              >
                <Bell className="w-4 h-4 text-white" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Menu Button (3 bars) */}
              <button
                onClick={onMenuClick}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
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
      <div className="h-14 lg:h-0" />
    </>
  );
}
