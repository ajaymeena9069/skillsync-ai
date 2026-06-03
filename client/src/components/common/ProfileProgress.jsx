// client/src/components/common/ProfileProgress.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Building2,
  User,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Globe,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ProgressBar } from "../ProgressBar";
import { isRecruiter } from "../../features/auth/authUtils";

export function ProfileProgress({ user }) {
  const navigate = useNavigate();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  const [pendingSections, setPendingSections] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const isRecruiterUser = isRecruiter(user);

  useEffect(() => {
    if (isRecruiterUser) {
      calculateRecruiterProgress();
    } else {
      calculateCandidateProgress();
    }
  }, [user, isRecruiterUser]);

  const calculateRecruiterProgress = () => {
    const sections = [];
    let completed = 0;
    let total = 0;
    const company = user?.company || {};

    const fields = [
      { name: "Company Name", value: company?.name, icon: Building2 },
      { name: "Company Email", value: company?.email, icon: Mail },
      { name: "Company Phone", value: company?.phone, icon: Phone },
      { name: "Location", value: company?.location, icon: MapPin },
      { name: "Industry", value: company?.industry, icon: Briefcase },
      {
        name: "Description",
        value: company?.description?.length >= 50,
        icon: Globe,
      },
      { name: "Company Logo", value: company?.logo, icon: Building2 },
      {
        name: "Benefits",
        value: company?.benefits?.length > 0,
        icon: Sparkles,
      },
    ];

    fields.forEach((field) => {
      total++;
      const isComplete =
        field.value &&
        (typeof field.value === "boolean"
          ? field.value
          : field.value.trim?.() !== "");
      if (isComplete) completed++;
      sections.push({
        name: field.name,
        completed: isComplete,
        icon: field.icon,
        path: "/app/company",
      });
    });

    setCompletionPercentage(Math.round((completed / total) * 100));
    setCompletedSections(sections.filter((s) => s.completed));
    setPendingSections(sections.filter((s) => !s.completed));
    setPendingSections(sections.filter((s) => !s.completed));
  };

  const calculateCandidateProgress = () => {
    const sections = [];
    let completed = 0;
    let total = 0;

    const fields = [
      {
        name: "Full Name",
        value: user?.name,
        icon: User,
        path: "/app/profile",
      },
      { name: "Email", value: user?.email, icon: Mail, path: "/app/profile" },
      { name: "Phone", value: user?.phone, icon: Phone, path: "/app/profile" },
      {
        name: "Location",
        value: user?.location,
        icon: MapPin,
        path: "/app/profile",
      },
      {
        name: "Profession",
        value: user?.profession,
        icon: Briefcase,
        path: "/app/profile",
      },
      {
        name: "Current Role",
        value: user?.currentRole,
        icon: Briefcase,
        path: "/app/profile",
      },
      {
        name: "Experience",
        value:
          user?.experience &&
          user.experience !== "" &&
          user.experience !== "0 years",
        icon: TrendingUp,
        path: "/app/profile",
      },
      {
        name: "Skills (3+)",
        value: user?.skills?.length >= 3,
        icon: Zap,
        path: "/app/profile",
      },
      {
        name: "Resume",
        value: user?.resumeUrl,
        icon: Target,
        path: "/app/resume",
      },
    ];

    fields.forEach((field) => {
      total++;
      const isComplete =
        field.value &&
        (typeof field.value === "boolean"
          ? field.value
          : field.value.trim?.() !== "");
      if (isComplete) completed++;
      sections.push({
        name: field.name,
        completed: isComplete,
        icon: field.icon,
        path: field.path,
      });
    });

    setCompletionPercentage(Math.round((completed / total) * 100));
    setCompletedSections(sections.filter((s) => s.completed));
    setPendingSections(sections.filter((s) => !s.completed));
  };

  const getScoreColor = () => {
    if (completionPercentage >= 75) return "#10b981";
    if (completionPercentage >= 50) return "#3b82f6";
    if (completionPercentage >= 25) return "#f59e0b";
    return "#8b5cf6";
  };

  const getTextColor = () => {
    if (completionPercentage >= 75)
      return "text-emerald-600 dark:text-emerald-400";
    if (completionPercentage >= 50) return "text-blue-600 dark:text-blue-400";
    if (completionPercentage >= 25) return "text-amber-600 dark:text-amber-400";
    return "text-purple-600 dark:text-purple-400";
  };

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-5 shadow-sm">
      {/* ✅ Flex with items-center for vertical alignment */}
      <div className="flex items-center gap-5">
        {/* Circular Progress */}
        <div className="relative flex-shrink-0">
          <svg className="w-[72px] h-[72px] transform -rotate-90">
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="5"
              fill="none"
              className="dark:stroke-gray-700"
            />
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke={getScoreColor()}
              strokeWidth="5"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-base font-bold ${getTextColor()}`}>
              {completionPercentage}
            </span>
            <span className="text-[8px] text-gray-400 dark:text-gray-500">
              %
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {isRecruiterUser ? "Company Profile" : "Profile Strength"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {completedSections.length} of{" "}
                {completedSections.length + pendingSections.length} completed
              </p>
            </div>
            {pendingSections.length > 0 && (
              <button
                onClick={() => navigate(pendingSections[0].path)}
                className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
              >
                Complete Profile
              </button>
            )}
          </div>

          <div className="mt-3">
            <ProgressBar
              value={completionPercentage}
              variant="primary"
              showPercentage={false}
              size="sm"
            />
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-500 transition-colors mt-3"
          >
            {showDetails ? "Show less" : "Show details"}
            {showDetails ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>

          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {pendingSections.map((section, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer group"
                    onClick={() => navigate(section.path)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <section.icon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {section.name}
                      </span>
                    </div>
                    <span className="text-purple-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Add
                    </span>
                  </div>
                ))}
                {completedSections.length > 0 && pendingSections.length > 0 && (
                  <div className="col-span-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                      Completed
                    </p>
                    <div className="space-y-2">
                      {completedSections.slice(0, 4).map((section, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                        >
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          <span>{section.name}</span>
                        </div>
                      ))}
                      {completedSections.length > 4 && (
                        <p className="text-xs text-gray-400">
                          +{completedSections.length - 4} more
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
