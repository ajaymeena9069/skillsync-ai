import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { NotificationsPanel } from "../components/NotificationsPanel";
import { AIChat } from "../components/AIChat";
import { MessageSquare } from "lucide-react";

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const userType = localStorage.getItem("userType") || "jobseeker";
  const currentView = location.pathname.split("/").pop() || "dashboard";

  const handleViewChange = (view) => {
    navigate(`/app/${view}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onNotificationsClick={() => setNotificationsOpen(true)}
        userType={userType}
      />

      <div className="flex">
        <Sidebar
          currentView={currentView}
          onViewChange={handleViewChange}
          userType={userType}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <AIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-200 hover:scale-110 z-30"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
