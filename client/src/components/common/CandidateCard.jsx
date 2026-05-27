// src/components/common/CandidateCard.jsx
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Mail,
  Calendar,
  FileText,
  Eye,
  TrendingUp,
  Sparkles,
  Building2,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
} from "lucide-react";
import { Button } from "../Button";
import { Badge } from "../Badge";

const statusConfig = {
  New: {
    icon: Clock,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  Reviewed: {
    icon: Eye,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  Shortlisted: {
    icon: UserCheck,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  Rejected: {
    icon: XCircle,
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  Hired: {
    icon: CheckCircle,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
};

export function CandidateCard({
  candidate,
  showActions = true,
  variant = "default",
  onViewProfile,
  className = "",
}) {
  const navigate = useNavigate();

  const {
    name,
    email,
    location,
    matchScore,
    skills = [],
    status,
    appliedFor,
    applicationId,
  } = candidate;

  const getInitials = () => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?"
    );
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80)
      return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30";
    if (score >= 60)
      return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30";
    if (score >= 40)
      return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30";
    return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800";
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(candidate);
    } else if (applicationId) {
      navigate(`/app/candidates/${applicationId}`);
    }
  };

  const StatusIcon = statusConfig[status]?.icon || Clock;
  const statusColorClass =
    statusConfig[status]?.color || statusConfig.New.color;

  // Compact variant
  if (variant === "compact") {
    return (
      <div
        className={`group bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 hover:shadow-md transition-all duration-200 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
              {candidate.avatar ? (
                <img
                  src={candidate.avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {getInitials()}
                </span>
              )}
            </div>
            {matchScore && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">
                  {matchScore}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {appliedFor}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant
  return (
    <div
      className={`group bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200 ${className}`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 flex-shrink-0 shadow-md">
              {candidate.avatar ? (
                <img
                  src={candidate.avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {getInitials()}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                {name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {appliedFor}
              </p>
              {location && (
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 dark:text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col items-end gap-2">
            {matchScore && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getMatchScoreColor(matchScore)}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-sm font-semibold">
                  {matchScore}% Match
                </span>
              </div>
            )}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColorClass}`}
            >
              <StatusIcon className="w-3 h-3" />
              {status}
            </div>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              >
                {skill}
              </span>
            ))}
            {skills.length > 6 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500">
                +{skills.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Email */}
        {email && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Mail className="w-3 h-3" />
            <span className="truncate">{email}</span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewProfile}
              className="gap-1.5 text-sm"
            >
              <Eye className="w-4 h-4" />
              View Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
