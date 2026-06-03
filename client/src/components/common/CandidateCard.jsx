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
  Briefcase,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Card, CardContent } from "../ui/Card";
import { OptimizedAvatar } from "./OptimizedAvatar";
import { ConfirmationModal } from "./ConfirmationModal";
import { CandidateActionButtons } from "../ui/CandidateActionButtons";
import { useUpdateApplicationStatusMutation } from "../../services/applicationApi";
import { AIAnalysisModal } from "../AIAnalysisModal";

const statusConfig = {
  New: {
    icon: Clock,
    color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    label: "New",
  },
  Reviewed: {
    icon: Eye,
    color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    label: "Reviewed",
  },
  Shortlisted: {
    icon: UserCheck,
    color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    label: "Shortlisted",
  },
  Rejected: {
    icon: XCircle,
    color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    label: "Rejected",
  },
  Hired: {
    icon: CheckCircle,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    label: "Hired",
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
    createdAt,
  } = candidate;

  // Normalize status
  const status = rawStatus
    ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase()
    : "New";

  const statusInfo = statusConfig[status] || statusConfig.New;
  const StatusIcon = statusInfo.icon;

  const getInitials = () => {
    return (
      name?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?"
    );
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
    if (score >= 60) return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    if (score >= 40) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
  };

  const handleViewProfile = () => {
    if (onViewProfile) onViewProfile(candidate);
    else if (applicationId) navigate(`/app/candidates/${applicationId}`);
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus !== status && applicationId) {
      setPendingStatus(newStatus);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmStatusChange = async () => {
    try {
      await updateStatus({ applicationId, status: pendingStatus?.toLowerCase() }).unwrap();
      toast.success(`Application marked as ${pendingStatus}`);
      setShowConfirmModal(false);
      setPendingStatus(null);
    } catch (error) {
      toast.error(error.data?.message || "Failed to update status");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Recently";
    const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  // Compact variant (optimized for small screens)
  if (variant === "compact") {
    return (
      <div
        onClick={handleViewProfile}
        className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-800/50 p-3 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full ring-2 ring-purple-500/30 dark:ring-purple-400/30 shadow-sm overflow-hidden">
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
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
              <StatusIcon className="w-3 h-3" />
              <span className="hidden sm:inline">{status}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full modern card – fully responsive
  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl">
        <CardContent className="p-0">
          <div className="p-4 sm:p-5 space-y-4">
            {/* Header: Avatar + Title + Match Badge */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full ring-2 ring-purple-500/30 dark:ring-purple-400/30 shadow-sm overflow-hidden flex-shrink-0">
                  <OptimizedAvatar
                    src={candidate.avatar}
                    alt={name}
                    fallbackText={getInitials()}
                    className="w-full h-full text-base sm:text-lg"
                    size={150}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg hover:text-purple-600 transition-colors">
                    {name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{appliedFor}</p>
                  {location && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 dark:text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
              {matchScore && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold self-start ${getMatchScoreColor(matchScore)}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {matchScore}% Match
                </div>
              )}
            </div>

            {/* Additional info row (email + date) – wraps on mobile */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              {email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  {email}
                </span>
              )}
              {createdAt && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" />
                  Applied {formatDate(createdAt)}
                </span>
              )}
            </div>

            {/* Skills – wraps naturally */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 6).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 6 && (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500">
                    +{skills.length - 6}
                  </span>
                )}
              </div>
            )}

            {/* Status + Actions – responsive flex wrap */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 flex-wrap">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusInfo.label}
                </div>
                {showActions && applicationId && (
                  <StatusDropdown
                    status={status}
                    statusConfig={statusConfig}
                    isUpdating={isUpdating}
                    onStatusChange={handleStatusChange}
                  />
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleViewProfile}
                  className="gap-1.5 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Eye className="w-4 h-4" />
                  Profile
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAIModal(true)}
                  className="gap-1.5 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <Brain className="w-4 h-4" />
                  AI
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AIAnalysisModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        applicationId={applicationId}
        candidateName={name}
        jobTitle={appliedFor}
      />
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

// Improved StatusDropdown – fully visible, with better positioning and z-index
function StatusDropdown({ status, statusConfig, isUpdating, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Recalculate position on open to ensure it's not clipped
      if (buttonRef.current && dropdownRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = 240; // approximate height
        if (spaceBelow < dropdownHeight) {
          dropdownRef.current.style.bottom = "100%";
          dropdownRef.current.style.top = "auto";
          dropdownRef.current.style.marginBottom = "8px";
        } else {
          dropdownRef.current.style.top = "100%";
          dropdownRef.current.style.bottom = "auto";
          dropdownRef.current.style.marginTop = "8px";
        }
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const options = ["New", "Reviewed", "Shortlisted", "Hired", "Rejected"];
  const currentConfig = statusConfig[status] || statusConfig.New;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => !isUpdating && setIsOpen(!isOpen)}
        disabled={isUpdating}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        Change
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 min-w-[160px] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 overflow-hidden"
            style={{
              top: "100%",
              left: 0,
              marginTop: "8px",
            }}
          >
            {options.map((opt) => {
              const OptIcon = statusConfig[opt]?.icon;
              const isSelected = status === opt;
              const optColor = statusConfig[opt]?.color.split(" ")[0] || "text-gray-600";
              return (
                <button
                  key={opt}
                  onClick={() => {
                    onStatusChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-all ${isSelected
                      ? `${optColor} font-semibold bg-gray-50 dark:bg-gray-700/30`
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                >
                  {OptIcon && <OptIcon className="w-4 h-4" />}
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