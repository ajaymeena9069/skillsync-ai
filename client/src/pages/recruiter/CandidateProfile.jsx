// client/src/pages/recruiter/CandidateProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Mail,
  Download,
  Sparkles,
  ChevronLeft,
  Check,
  Calendar,
  UserCheck,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  Loader2,
  X,
  MessageSquare,
  Briefcase,
  Award,
  Lightbulb,
  AlertCircle,
  Brain,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Star,
  Code,
  GraduationCap,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { toast } from "sonner";
import { LoadingPage } from "../../components/LoadingPage";
import {
  useGetApplicationByIdQuery,
  useUpdateApplicationStatusMutation,
} from "../../services/applicationApi";
import { useGetCandidateMatchAnalysisQuery } from "../../services/matchApi";

const getStatusConfig = (status) => {
  const configs = {
    pending: {
      label: "Pending",
      icon: Clock,
      color:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
    },
    reviewed: {
      label: "Reviewed",
      icon: Eye,
      color:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
    },
    shortlisted: {
      label: "Shortlisted",
      icon: UserCheck,
      color:
        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      color:
        "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
    },
    hired: {
      label: "Hired",
      icon: CheckCircle,
      color:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
  };
  return configs[status] || configs.pending;
};

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  status,
  isLoading,
}) {
  if (!isOpen) return null;

  const getStatusColor = () => {
    switch (status) {
      case "rejected":
        return "bg-red-600 hover:bg-red-700";
      case "hired":
        return "bg-emerald-600 hover:bg-emerald-700";
      case "shortlisted":
        return "bg-purple-600 hover:bg-purple-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 transition-all duration-300"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 animate-in fade-in zoom-in duration-200">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                className={`flex-1 ${getStatusColor()}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming...
                  </span>
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// AI Analysis Card Component
function AIAnalysisCard({ analysis, isLoading, onAnalyze }) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 text-center shadow-sm">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">AI is analyzing...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-8 text-center border border-purple-100 dark:border-purple-800/30">
        <Brain className="w-12 h-12 text-purple-500 mx-auto mb-3 opacity-60" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          AI Deep Analysis
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
          Get comprehensive AI-powered analysis of this candidate's fit for the
          role, including skill matching, recommendations, and fit assessment.
        </p>
        <Button onClick={onAnalyze} className="gap-2">
          <Sparkles className="w-4 h-4" />
          Run Deep Analysis
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Score Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm mb-1">Overall Match Score</p>
            <p className="text-5xl font-bold">{analysis.matchScore}%</p>
          </div>
          <div className="w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="45"
                cy="45"
                r="38"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="45"
                cy="45"
                r="38"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 38}`}
                strokeDashoffset={`${2 * Math.PI * 38 * (1 - analysis.matchScore / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-purple-500" />
          Skills Analysis
        </h4>
        <div className="space-y-4">
          {analysis.strengthMatches?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Strengths ({analysis.strengthMatches.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.strengthMatches.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm dark:bg-green-900/30 dark:text-green-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {analysis.gapSkills?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Skill Gaps ({analysis.gapSkills.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.gapSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm dark:bg-red-900/30 dark:text-red-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fit Analysis */}
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          Fit Analysis
        </h4>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {analysis.fitAnalysis}
        </p>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Recommendations
        </h4>
        <ul className="space-y-2">
          {analysis.recommendations?.map((rec, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
            >
              <span className="text-purple-500 mt-0.5">•</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Decision Badge */}
      <div
        className={`rounded-2xl p-4 text-center ${
          analysis.matchScore >= 80
            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            : analysis.matchScore >= 60
              ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {analysis.matchScore >= 80 ? (
            <>
              <ThumbsUp className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-700 dark:text-green-400">
                Strong Candidate - Highly Recommended
              </span>
            </>
          ) : analysis.matchScore >= 60 ? (
            <>
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-700 dark:text-yellow-400">
                Potential Candidate - Consider for Screening
              </span>
            </>
          ) : (
            <>
              <ThumbsDown className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-700 dark:text-red-400">
                Not Recommended for this Role
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function CandidateProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notes, setNotes] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [shouldFetchAnalysis, setShouldFetchAnalysis] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset image loading state when candidate changes
  useEffect(() => {
    setImageLoaded(false);
  }, [id]);

  const { data, isLoading, refetch } = useGetApplicationByIdQuery(id);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateApplicationStatusMutation();

  const {
    data: analysisData,
    isLoading: loadingAnalysis,
    refetch: refetchAnalysis,
  } = useGetCandidateMatchAnalysisQuery(id, {
    skip: !shouldFetchAnalysis,
  });

  const application = data?.data;
  const candidate = application?.userId;
  const job = application?.jobId;
  const analysis = analysisData?.data;

  const handleStatusClick = (newStatus) => {
    setPendingStatus(newStatus);
    setShowConfirmModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!pendingStatus) return;
    try {
      await updateStatus({ applicationId: id, status: pendingStatus }).unwrap();
      toast.success(`Application marked as ${pendingStatus}`);
      setShowConfirmModal(false);
      await refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to update status");
    } finally {
      setPendingStatus(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!notes) return;
    try {
      await updateStatus({
        applicationId: id,
        status: application?.status,
        notes,
      }).unwrap();
      toast.success("Notes saved successfully");
      setNotes("");
      await refetch();
    } catch (error) {
      toast.error("Failed to save notes");
    }
  };

  const handleRunAnalysis = () => {
    setShouldFetchAnalysis(true);
    refetchAnalysis();
  };

  if (isLoading) return <LoadingPage />;

  if (!application || !candidate) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Candidate not found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The candidate you're looking for doesn't exist
          </p>
          <Button onClick={() => navigate("/app/candidates")}>
            Back to Candidates
          </Button>
        </div>
      </div>
    );
  }

  const getInitials = () =>
    candidate.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2) || "?";
  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen">
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setPendingStatus(null);
        }}
        onConfirm={handleStatusUpdate}
        isLoading={isUpdating}
        title="Confirm Status Change"
        message={`Are you sure you want to mark this application as ${pendingStatus}?`}
        status={pendingStatus}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/app/candidates")}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-purple-500 transition-colors" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-purple-600 transition-colors">
            Back to Candidates
          </span>
        </button>

        {/* Hero Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-shrink-0">
              {candidate.avatar ? (
                <div className="relative w-28 h-28">
                  {!imageLoaded && (
                    <div className="absolute inset-0 w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse border-4 border-white dark:border-gray-700 shadow-lg" />
                  )}
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                    className={`w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg transition-opacity duration-300 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                  {getInitials()}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {candidate.name}
                  </h1>
                  <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
                    Applied for: {job?.title || "Position"}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />{" "}
                      {candidate.location || "Location not specified"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" /> {candidate.email}
                    </span>
                    {candidate.experience && (
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" /> {candidate.experience}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {application.resumeUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        window.open(application.resumeUrl, "_blank")
                      }
                    >
                      <Download className="w-4 h-4" /> Resume
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() =>
                      (window.location.href = `mailto:${candidate.email}`)
                    }
                  >
                    <Mail className="w-4 h-4" /> Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        {application.coverLetter && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cover Letter
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {application.coverLetter}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              Applied on {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Candidate Info */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Skills
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm dark:bg-purple-900/30 dark:text-purple-400"
                  >
                    {skill}
                  </span>
                ))}
                {(!candidate.skills || candidate.skills.length === 0) && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4 w-full">
                    No skills data available
                  </p>
                )}
              </div>
            </div>

            {/* Status Update */}
            <div
              className={`rounded-2xl p-5 border ${statusConfig.color} bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Current Status</p>
                  <p className="text-xs opacity-80 capitalize">
                    {application.status}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["reviewed", "shortlisted", "hired", "rejected"].map(
                  (status) => {
                    const isActive = application.status === status;
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusClick(status)}
                        disabled={isUpdating || isActive}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize flex-1 ${
                          isActive
                            ? "bg-purple-600 text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : (
                          status
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Private Notes
              </label>
              <div className="flex gap-3">
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this candidate..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white resize-none"
                />
                <Button
                  onClick={handleSaveNotes}
                  disabled={!notes || isUpdating}
                  className="bg-purple-600 hover:bg-purple-700 px-6"
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
              {application.notes && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Previous notes:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {application.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - AI Analysis */}
          <div className="space-y-6">
            <AIAnalysisCard
              analysis={analysis}
              isLoading={loadingAnalysis}
              onAnalyze={handleRunAnalysis}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
