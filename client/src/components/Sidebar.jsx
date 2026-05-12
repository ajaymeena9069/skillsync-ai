import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Target,
  Map,
  User,
  Users,
  BarChart2,
  LogOut,
} from "lucide-react";
import { Button } from "./Button";

const jobSeekerLinks = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "skill-gap", label: "Skill Gap", icon: Target },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "profile", label: "Profile", icon: User },
];

const recruiterLinks = [
  { id: "recruiter-dashboard", label: "Dashboard", icon: BarChart2 },
  { id: "candidates", label: "Candidates", icon: Users },
  { id: "profile", label: "Profile", icon: User },
];

export function Sidebar({ currentView, onViewChange, userType = "jobseeker", onLogout }) {
  const links = userType === "recruiter" ? recruiterLinks : jobSeekerLinks;

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] border-r border-border bg-card/50 p-4">
      <nav className="flex-1 space-y-1">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${currentView === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {onLogout && (
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={onLogout}>
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      )}
    </aside>
  );
}
