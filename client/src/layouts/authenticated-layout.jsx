// client/src/layouts/AuthenticatedLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "../components/common/PageTransition";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { NotificationsPanel } from "../components/NotificationsPanel";
import { ConfirmationModal } from "../components/common/ConfirmationModal";
import { logout } from "../features/auth/authSlice";
import { removeUser } from "../features/auth/authUtils";

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(() => {
    const saved = localStorage.getItem("sidebarMinimized");
    return saved !== null ? saved === "true" : true;
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? saved === "true" : true;
  });

  // Listen to sidebar minimize changes (same tab)
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem("sidebarMinimized");
      const isMin = saved !== null ? saved === "true" : true;
      if (isMin !== isSidebarMinimized) {
        setIsSidebarMinimized(isMin);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isSidebarMinimized]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    removeUser();
    dispatch(logout());
    navigate("/");
    setShowLogoutConfirm(false);
  };

  const handleDarkModeToggle = () => setDarkMode(!darkMode);

  const mainMarginLeft = isSidebarMinimized ? "lg:ml-[88px]" : "lg:ml-[280px]";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100/90 via-white to-gray-100/80 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Simple, elegant background – no ugly grid, no weird icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Soft blur circles – minimal and modern */}
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-100/40 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-100/40 dark:bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onNotificationsClick={() => setNotificationsOpen(true)}
        darkMode={darkMode}
        onDarkModeToggle={handleDarkModeToggle}
        isMenuOpen={sidebarOpen}
      />

      <Sidebar
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogoutClick}
        darkMode={darkMode}
        onDarkModeToggle={handleDarkModeToggle}
        onNotificationsClick={() => setNotificationsOpen(true)}
        isOpen={sidebarOpen}
      />

      <main className={`transition-all duration-300 ${mainMarginLeft}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>

      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
      />
    </div>
  );
}
