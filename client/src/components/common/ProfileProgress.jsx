// client/src/components/common/ProfileProgress.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Building2,
  User,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Globe,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Target,
  Rocket,
  Zap,
  XCircle,
} from "lucide-react";
import { ProgressBar } from "../ProgressBar";
import { Button } from "../Button";
import { isRecruiter, isUser } from "../../features/auth/authUtils";

export function ProfileProgress({ user, userType = "jobseeker" }) {
  const navigate = useNavigate();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  const [pendingSections, setPendingSections] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const isRecruiterUser = isRecruiter(user);
  const isCandidateUser = isUser(user);

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

    // Company Name
    total++;
    if (company?.name && company.name.trim() !== "") {
      completed++;
      sections.push({
        name: "Company Name",
        completed: true,
        icon: Building2,
        path: "/app/company",
      });
    } else {
      sections.push({
        name: "Company Name",
        completed: false,
        icon: Building2,
        path: "/app/company",
      });
    }

    // Company Email
    total++;
    if (company?.email && company.email.trim() !== "") {
      completed++;
      sections.push({
        name: "Company Email",
        completed: true,
        icon: Mail,
        path: "/app/company",
      });
    } else {
      sections.push({
        name: "Company Email",
        completed: false,
        icon: Mail,
        path: "/app/company",
      });
    }

    // Company Phone
    total++;
    if (company?.phone && company.phone.trim() !== "") {
      completed++;
      sections.push({
        name: "Company Phone",
        completed: true,
        icon: Phone,
        path: "/app/company",
      });
    } else {
      sections.push({
        name: "Company Phone",
        completed: false,
        icon: Phone,
        path: "/app/company",
      });
    }

    // Company Location
    total++;
    if (company?.location && company.location.trim() !== "") {
      completed++;
      sections.push({
        name: "Company Location",
        completed: true,
        icon: MapPin,
        path: "/app/company",
      });
    } else {
      sections.push({
        name: "Company Location",
        completed: false,
        icon: MapPin,
        path: "/app/company",
      });
    }

    // Industry
    total++;
    if (company?.industry && company.industry.trim() !== "") {
      completed++;
      sections.push({
        name: "Industry",
        completed: true,
        icon: Briefcase,
        path: "/app/company",
      });
    } else {
      sections.push({
        name: "Industry",
        completed: false,
        icon: Briefcase,
        path: "/app/company",
      });
    }

    // Description (min 50 chars)
    total++;
    if (company?.description && company.description.trim().length >= 50) {
      completed++;
      sections.push({
        name: "Company Description",
        completed: true,
        icon: Globe,
        path: "/app/company",
      });
    } else {
      sections.push({
        name: "Company Description",
        completed: false,
        icon: Globe,
        path: "/app/company",
      });
    }

    // Logo
    total++;
    if (company?.logo && company.logo.trim() !== "") {
      completed++;
      sections.push({
        name: "Company Logo",
        completed: true,
        icon: Building2,
        path: "/app/company",
      });
    } else {
      sections.push({
        name: "Company Logo",
        completed: false,
        icon: Building2,
        path: "/app/company",
      });
    }

    // Benefits
    total++;
    if (company?.benefits && company.benefits.length > 0) {
      completed++;
      sections.push({
        name: "Benefits & Perks",
        completed: true,
        icon: Sparkles,
        path: "/app/company",
      });
    } else {
      sections.push({
        name: "Benefits & Perks",
        completed: false,
        icon: Sparkles,
        path: "/app/company",
      });
    }

    const percentage = Math.round((completed / total) * 100);
    setCompletionPercentage(percentage);
    setCompletedSections(sections.filter((s) => s.completed));
    setPendingSections(sections.filter((s) => !s.completed));
  };

  const calculateCandidateProgress = () => {
    const sections = [];
    let completed = 0;
    let total = 0;

    // Name
    total++;
    if (user?.name && user.name.trim() !== "") {
      completed++;
      sections.push({
        name: "Full Name",
        completed: true,
        icon: User,
        path: "/app/profile",
      });
    } else {
      sections.push({
        name: "Full Name",
        completed: false,
        icon: User,
        path: "/app/profile",
      });
    }

    // Email
    total++;
    if (user?.email && user.email.trim() !== "") {
      completed++;
      sections.push({
        name: "Email Address",
        completed: true,
        icon: Mail,
        path: "/app/profile",
      });
    } else {
      sections.push({
        name: "Email Address",
        completed: false,
        icon: Mail,
        path: "/app/profile",
      });
    }

    // Phone
    total++;
    if (user?.phone && user.phone.trim() !== "") {
      completed++;
      sections.push({
        name: "Phone Number",
        completed: true,
        icon: Phone,
        path: "/app/profile",
      });
    } else {
      sections.push({
        name: "Phone Number",
        completed: false,
        icon: Phone,
        path: "/app/profile",
      });
    }

    // Location
    total++;
    if (user?.location && user.location.trim() !== "") {
      completed++;
      sections.push({
        name: "Location",
        completed: true,
        icon: MapPin,
        path: "/app/profile",
      });
    } else {
      sections.push({
        name: "Location",
        completed: false,
        icon: MapPin,
        path: "/app/profile",
      });
    }

    // Current Role
    total++;
    if (user?.currentRole && user.currentRole.trim() !== "") {
      completed++;
      sections.push({
        name: "Current Role",
        completed: true,
        icon: Briefcase,
        path: "/app/profile",
      });
    } else {
      sections.push({
        name: "Current Role",
        completed: false,
        icon: Briefcase,
        path: "/app/profile",
      });
    }

    // Experience
    total++;
    if (
      user?.experience &&
      user.experience !== "" &&
      user.experience !== "0 years"
    ) {
      completed++;
      sections.push({
        name: "Experience",
        completed: true,
        icon: TrendingUp,
        path: "/app/profile",
      });
    } else {
      sections.push({
        name: "Experience",
        completed: false,
        icon: TrendingUp,
        path: "/app/profile",
      });
    }

    // Skills (min 3)
    total++;
    if (user?.skills && user.skills.length >= 3) {
      completed++;
      sections.push({
        name: "Skills (min 3)",
        completed: true,
        icon: Zap,
        path: "/app/profile",
      });
    } else {
      sections.push({
        name: "Skills (min 3)",
        completed: false,
        icon: Zap,
        path: "/app/profile",
      });
    }

    // Resume
    total++;
    if (user?.resumeUrl && user.resumeUrl !== "") {
      completed++;
      sections.push({
        name: "Resume Uploaded",
        completed: true,
        icon: Target,
        path: "/app/resume",
      });
    } else {
      sections.push({
        name: "Resume Uploaded",
        completed: false,
        icon: Target,
        path: "/app/resume",
      });
    }

    const percentage = Math.round((completed / total) * 100);
    setCompletionPercentage(percentage);
    setCompletedSections(sections.filter((s) => s.completed));
    setPendingSections(sections.filter((s) => !s.completed));
  };

  const getProgressMessage = () => {
    if (completionPercentage === 100) {
      return {
        text: "Perfect! Your profile is complete! 🎉",
        icon: Award,
        color: "text-emerald-500 dark:text-emerald-400",
      };
    }
    if (completionPercentage >= 75) {
      return {
        text: "Great progress! Almost there! 🔥",
        icon: Rocket,
        color: "text-blue-500 dark:text-blue-400",
      };
    }
    if (completionPercentage >= 50) {
      return {
        text: "Good start! Keep going! 📈",
        icon: TrendingUp,
        color: "text-amber-500 dark:text-amber-400",
      };
    }
    if (completionPercentage >= 25) {
      return {
        text: "You're on your way! 🚀",
        icon: Zap,
        color: "text-purple-500 dark:text-purple-400",
      };
    }
    return {
      text: "Complete your profile to unlock more features! ✨",
      icon: Sparkles,
      color: "text-purple-500 dark:text-purple-400",
    };
  };

  const progressInfo = getProgressMessage();
  const ProgressIcon = progressInfo.icon;

  const getProgressColor = () => {
    if (completionPercentage >= 75) return "from-emerald-500 to-teal-600";
    if (completionPercentage >= 50) return "from-blue-500 to-cyan-600";
    if (completionPercentage >= 25) return "from-amber-500 to-orange-600";
    return "from-purple-600 to-indigo-600";
  };

  const getRedirectPath = () => {
    if (pendingSections.length > 0) {
      return pendingSections[0].path;
    }
    return isRecruiterUser ? "/app/company" : "/app/profile";
  };

  const getMissingFields = () => {
    return pendingSections.map((s) => s.name);
  };

  const missingFields = getMissingFields();
  const hasMissingFields = missingFields.length > 0;

  return (
    <div className="group relative overflow-hidden bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-500">
      {/* Decorative gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${getProgressColor()} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
            >
              {isRecruiterUser ? (
                <Building2 className="w-7 h-7 text-white" />
              ) : (
                <User className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {isRecruiterUser ? "Company Profile" : "Profile Strength"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <ProgressIcon className={`w-4 h-4 ${progressInfo.color}`} />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {progressInfo.text}
                </p>
              </div>
            </div>
          </div>

          {/* Circular Progress */}
          <div className="text-center">
            <div className="relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="url(#progressGradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - completionPercentage / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {completionPercentage}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <ProgressBar
            value={completionPercentage}
            variant="primary"
            showPercentage={false}
            size="md"
          />
        </div>

        {/* Next Action Button */}
        {completionPercentage < 100 && (
          <button
            onClick={() => navigate(getRedirectPath())}
            className="w-full mb-6 group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              <span>
                {missingFields.length > 0
                  ? `Complete ${missingFields[0]}`
                  : "Complete Your Profile"}
              </span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </button>
        )}

        {/* Missing Fields Alert */}
        {hasMissingFields && !showDetails && completionPercentage < 100 && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-2">
              ⚡ Complete these to reach 100%:
            </p>
            <div className="flex flex-wrap gap-2">
              {missingFields.slice(0, 4).map((field, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                >
                  {field}
                </span>
              ))}
              {missingFields.length > 4 && (
                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                  +{missingFields.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-4"
        >
          <span className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            {showDetails ? "Hide Details" : "View Details"}
          </span>
          <ArrowRight
            className={`w-4 h-4 transition-transform ${showDetails ? "rotate-90" : ""}`}
          />
        </button>

        {/* Details Section */}
        {showDetails && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top duration-300">
            {/* Completed Sections */}
            {completedSections.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-green-200 dark:border-green-800">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Completed ({completedSections.length}/
                    {completedSections.length + pendingSections.length})
                  </p>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {completedSections.map((section, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm p-2 rounded-lg bg-green-50/50 dark:bg-green-900/10 hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-colors group/item cursor-pointer"
                      onClick={() => navigate(section.path)}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 flex-1">
                        {section.name}
                      </span>
                      <ArrowRight className="w-3 h-3 text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Sections */}
            {pendingSections.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-amber-200 dark:border-amber-800">
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Circle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                    Pending ({pendingSections.length}/
                    {completedSections.length + pendingSections.length})
                  </p>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {pendingSections.map((section, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm p-2 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors group/item cursor-pointer"
                      onClick={() => navigate(section.path)}
                    >
                      <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                      <span className="text-gray-500 dark:text-gray-500 flex-1">
                        {section.name}
                      </span>
                      <button
                        className="text-xs py-1 px-2 rounded-lg bg-purple-600 text-white opacity-0 group-hover/item:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(section.path);
                        }}
                      >
                        Complete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Achievement Badge */}
        {completionPercentage === 100 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center animate-pulse">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  🎉 Profile Complete!
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500">
                  {isRecruiterUser
                    ? "Your company is ready to attract top talent"
                    : "You're ready to get the best job matches"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
}