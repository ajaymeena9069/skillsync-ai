// src/components/common/CandidateCard.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Mail,
  Eye,
  TrendingUp,
  Sparkles,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  ChevronDown,
  Brain,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../Button";
import { Badge } from "../Badge";
import { OptimizedAvatar } from "./OptimizedAvatar";
import { ConfirmationModal } from "./ConfirmationModal";
import { CandidateActionButtons } from "../ui/CandidateActionButtons";
import { useUpdateApplicationStatusMutation } from "../../services/applicationApi";
import { AIAnalysisModal } from "../AIAnalysisModal";

const statusConfig = {
  New: {
    icon: Clock,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
  },
  Reviewed: {
    icon: Eye,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    hoverBg: "hover:bg-purple-50 dark:hover:bg-purple-900/20",
  },
  Shortlisted: {
    icon: UserCheck,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    hoverBg: "hover:bg-amber-50 dark:hover:bg-amber-900/20",
  },
  Rejected: {
    icon: XCircle,
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    hoverBg: "hover:bg-red-50 dark:hover:bg-red-900/20",
  },
  Hired: {
    icon: CheckCircle,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
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
  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);

  const {
    name,
    email,
    location,
    appliedFor,
    status: rawStatus = "New",
    matchScore,
    skills = [],
    applicationId,
  } = candidate;

  // Normalize status to match statusConfig keys (e.g. "shortlisted" -> "Shortlisted")
  const status = rawStatus
    ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase()
    : "New";

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
      return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30";
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

  const handleStatusChange = (newStatus) => {
    if (newStatus !== status && applicationId) {
      setPendingStatus(newStatus);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmStatusChange = async () => {
    try {
      await updateStatus({
        applicationId,
        status: pendingStatus?.toLowerCase(),
      }).unwrap();
      toast.success(`Application marked as ${pendingStatus}`);
      setShowConfirmModal(false);
      setPendingStatus(null);
    } catch (error) {
      toast.error(error.data?.message || "Failed to update status");
    }
  };

  const StatusIcon = statusConfig[status]?.icon || Clock;
  const statusColorClass = statusConfig[status]?.color || statusConfig.New.color;

  // Compact variant (for sidebars, mobile)
  if (variant === "compact") {
    return (
      <div
        onClick={handleViewProfile}
        className={`group bg-white dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700/50 p-3 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800/50 transition-all duration-200 cursor-pointer ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full shadow-md">
              <OptimizedAvatar
                src={candidate.avatar}
                alt={name}
                fallbackText={getInitials()}
                className="w-full h-full text-sm"
                size={100}
              />
            </div>
            {matchScore && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-bold text-white">{matchScore}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{appliedFor}</p>
          </div>
          {showActions && (
            <div className="flex-shrink-0">
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColorClass}`}>
                <StatusIcon className="w-3 h-3" />
                <span className="hidden sm:inline">{status}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detailed variant (full card)
  return (
    <>
      <div
        className={`group bg-white dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-800/50 transition-all duration-200 ${className}`}
      >
        <div className="p-4 sm:p-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex-shrink-0 shadow-md">
                <OptimizedAvatar
                  src={candidate.avatar}
                  alt={name}
                  fallbackText={getInitials()}
                  className="w-full h-full text-base sm:text-lg"
                  size={150}
                />
              </div>

              {/* Main info */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                  {name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{appliedFor}</p>
                {location && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 dark:text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right side: match score + status */}
            <div className="flex flex-row sm:flex-col items-center justify-between sm:items-end gap-3 sm:gap-2">
              {matchScore && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full ${getMatchScoreColor(matchScore)}`}>
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="text-xs sm:text-sm font-semibold">{matchScore}% Match</span>
                </div>
              )}
              {showActions && applicationId ? (
                <StatusDropdown
                  status={status}
                  statusColorClass={statusColorClass}
                  StatusIcon={StatusIcon}
                  isUpdating={isUpdating}
                  onStatusChange={handleStatusChange}
                />
              ) : (
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColorClass}`}>
                  <StatusIcon className="w-3 h-3" />
                  <span>{status}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
              {skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 6 && (
                <span className="text-[11px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500">
                  +{skills.length - 6}
                </span>
              )}
            </div>
          )}

          {/* Email */}
          {email && (
            <div className="mt-2 sm:mt-3 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Mail className="w-3 h-3" />
              <span className="truncate flex-1">{email}</span>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <CandidateActionButtons
                    candidate={candidate}
                    onViewProfile={handleViewProfile}
                  />
                </div>
                {/* AI Analysis Button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAIModal(true)}
                  className="gap-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 hover:text-purple-800 dark:hover:bg-purple-900/30 dark:hover:text-purple-200"
                >
                  <Brain className="w-3.5 h-3.5" />
                  AI Analysis
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Modal */}
      {applicationId && (
        <AIAnalysisModal
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
          applicationId={applicationId}
          candidateName={name}
          jobTitle={appliedFor}
        />
      )}

      {/* Status Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setPendingStatus(null);
        }}
        onConfirm={handleConfirmStatusChange}
        title="Update Status"
        message={`Are you sure you want to mark this candidate as ${pendingStatus?.toLowerCase()}?`}
        status={pendingStatus?.toLowerCase()}
        isLoading={isUpdating}
      />
    </>
  );
}

// Status dropdown component (unchanged, but we keep it inside the same file)
function StatusDropdown({ status, statusColorClass, StatusIcon, isUpdating, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const options = ["New", "Reviewed", "Shortlisted", "Hired", "Rejected"];

  return (
    <div className="relative" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => !isUpdating && setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold
          transition-all duration-200 focus:outline-none
          ${statusColorClass}
          ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"}
          ${isOpen ? "ring-2 ring-purple-500/50 shadow-md" : "shadow-sm"}
        `}
      >
        <span className="flex items-center gap-1.5">
          <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden xs:inline">{status}</span>
        </span>
        <div className="w-px h-3.5 bg-current opacity-30 mx-0.5" />
        <ChevronDown
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-40 sm:w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700/50 py-1.5 z-[60]"
          >
            {options.map((opt) => {
              const OptIcon = statusConfig[opt]?.icon || Clock;
              const isSelected = status === opt;
              const optColor = statusConfig[opt]?.color.split(" ")[0] || "text-gray-600";
              const hoverBg = statusConfig[opt]?.hoverBg || "hover:bg-gray-50 dark:hover:bg-gray-700/50";

              return (
                <button
                  key={opt}
                  onClick={() => {
                    onStatusChange(opt);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-2.5 px-3 sm:px-4 py-2 text-xs sm:text-sm text-left transition-all duration-150
                    ${isSelected
                      ? `${optColor} font-semibold bg-gray-50 dark:bg-gray-700/30`
                      : `text-gray-600 dark:text-gray-400 ${hoverBg} hover:text-gray-900 dark:hover:text-white`
                    }
                  `}
                >
                  <OptIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSelected ? "opacity-100" : "opacity-60"}`} />
                  <span>{opt}</span>
                  {isSelected && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}