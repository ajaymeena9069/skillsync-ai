import { useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  User,
  Menu,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { Button } from "./Button";

export function Navbar({
  onMenuClick,
  onNotificationsClick,
  userType = "jobseeker",
}) {
  const navigate = useNavigate();

  // Get user name from localStorage or use default
  const userName = localStorage.getItem("userName") || "Alex Johnson";

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/app/dashboard")}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TalentAI
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search jobs, skills, candidates..."
                className="w-full pl-10 pr-4 py-2 bg-accent/50 border border-border/50 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                  transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNotificationsClick}
              className="relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <Button variant="ghost" size="sm">
              <MessageSquare className="w-5 h-5" />
            </Button>
            <div className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/50 hover:bg-accent cursor-pointer transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-sm">
                <div className="font-medium">{userName}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
