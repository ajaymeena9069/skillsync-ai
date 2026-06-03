// client/src/pages/recruiter/CandidateProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Mail,
  Download,
  Sparkles,
  UserCheck,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  MessageSquare,
  Briefcase,
  Brain,
  Phone,
  Globe,
  User,
  ExternalLink,
  Code,
  CalendarDays,
  Award,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { toast } from "sonner";
import { BackButton } from "../../components/common/BackButton";
import { PageLoader } from "../../components/PageLoader";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import {
  useGetApplicationByIdQuery,
  useUpdateApplicationStatusMutation,
} from "../../services/applicationApi";
import { useRecordProfileViewMutation } from "../../services/recruiterApi";
import { OptimizedAvatar } from "../../components/common/OptimizedAvatar";
import { AIAnalysisModal } from "../../components/AIAnalysisModal";

const getStatusConfig = (status) => {
  const configs = {
    pending: {
      label: "Pending",
      icon: Clock,
      color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
    },
    reviewed: {
      label: "Reviewed",
      icon: Eye,
      color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
    },
    shortlisted: {
      label: "Shortlisted",
      icon: UserCheck,
      color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
    },
    hired: {
      label: "Hired",
      icon: CheckCircle,
      color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
  };
  return configs[status] || configs.pending;
};

export function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showFullCoverLetter, setShowFullCoverLetter] = useState(false);
  const [notes, setNotes] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const { data, isLoading, refetch } = useGetApplicationByIdQuery(id);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();
  const [recordView] = useRecordProfileViewMutation();

  const application = data?.data;
  const candidate = application?.userId;
  const job = application?.jobId;

  useEffect(() => {
    if (candidate?._id) {
      recordView(candidate._id).catch(console.error);
    }
  }, [candidate?._id, recordView]);

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
    setIsSavingNotes(true);
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
    } finally {
      setIsSavingNotes(false);
    }
  };

  if (isLoading) return <PageLoader />;

  if (!application || !candidate) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Candidate not found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">The candidate you're looking for doesn't exist</p>
          <BackButton text="Go Back" fallbackPath="/app/dashboard" />
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

  // Helper: format date for readability
  const formatDate = (date) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6">
          {/* Back Button */}
          <div className="flex justify-start">
            <BackButton text="Back to Candidates" fallbackPath="/app/candidates" />
          </div>

          {/* Hero Card */}
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex justify-center md:justify-start">
                  <div className="w-28 h-28 rounded-full shadow-lg">
                    <OptimizedAvatar
                      src={candidate.avatar}
                      alt={candidate.name}
                      fallbackText={getInitials()}
                      className="w-full h-full border-4 border-white dark:border-gray-700 text-3xl"
                      size={300}
                    />
                  </div>
                </div>

                {/* Main Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {candidate.name}
                      </h1>
                      <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
                        Applied for: <span className="font-medium text-gray-700 dark:text-gray-300">{job?.title || "Position"}</span>
                      </p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3 text-sm">
                        {candidate.location && (
                          <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4" /> {candidate.location}
                          </span>
                        )}
                        {candidate.experience && (
                          <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" /> {candidate.experience}
                          </span>
                        )}
                        {candidate.phone && (
                          <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <Phone className="w-4 h-4" /> {candidate.phone}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                          <Mail className="w-4 h-4" /> {candidate.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center md:justify-end gap-2">
                      {application.resumeUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => window.open(application.resumeUrl, "_blank")}
                        >
                          <Download className="w-4 h-4" /> Resume
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => (window.location.href = `mailto:${candidate.email}`)}
                      >
                        <Mail className="w-4 h-4" /> Email
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Layout (Desktop) / Single Column (Mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN – Candidate Details */}
            <div className="space-y-6">
              {/* Cover Letter (if exists) */}
              {application.coverLetter && (
                <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cover Letter</h2>
                  </div>
                  <p className={`text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap ${!showFullCoverLetter ? 'line-clamp-4' : ''}`}>
                    {application.coverLetter}
                  </p>
                  {application.coverLetter.length > 200 && (
                    <button
                      onClick={() => setShowFullCoverLetter(!showFullCoverLetter)}
                      className="mt-3 px-4 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900/70 dark:text-purple-300 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none shadow-sm inline-block"
                    >
                      {showFullCoverLetter ? "View Less" : "View More"}
                    </button>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                    Applied on {formatDate(application.createdAt)}
                  </p>
                </div>
              )}

              {/* Bio */}
              {candidate.bio && (
                <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-purple-500" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About</h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{candidate.bio}</p>
                </div>
              )}

              {/* Skills */}
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills?.length ? (
                    candidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm dark:bg-purple-900/30 dark:text-purple-400"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4 w-full">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Social Profiles */}
              {(candidate.socialLinks?.github || candidate.socialLinks?.linkedin || candidate.socialLinks?.portfolio) && (
                <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-purple-500" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Social Profiles</h2>
                  </div>
                  <div className="space-y-3">
                    {candidate.socialLinks.linkedin && (
                      <a
                        href={candidate.socialLinks.linkedin.startsWith("http") ? candidate.socialLinks.linkedin : `https://${candidate.socialLinks.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Globe className="w-5 h-5 text-blue-600" />
                        <span className="truncate">{candidate.socialLinks.linkedin}</span>
                      </a>
                    )}
                    {candidate.socialLinks.github && (
                      <a
                        href={candidate.socialLinks.github.startsWith("http") ? candidate.socialLinks.github : `https://${candidate.socialLinks.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Code className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                        <span className="truncate">{candidate.socialLinks.github}</span>
                      </a>
                    )}
                    {candidate.socialLinks.portfolio && (
                      <a
                        href={candidate.socialLinks.portfolio.startsWith("http") ? candidate.socialLinks.portfolio : `https://${candidate.socialLinks.portfolio}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 text-purple-500" />
                        <span className="truncate">{candidate.socialLinks.portfolio}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN – Status + Notes + AI */}
            <div className="space-y-6">
              {/* Status Management Card */}
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${statusConfig.color}`}>
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Pipeline Status</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Current: {application.status}</p>
                      </div>
                    </div>
                    <Badge variant="primary" className="text-[10px] bg-white/50 dark:bg-black/20">
                      Manage Status
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Update candidate status to trigger automated notifications.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {["reviewed", "shortlisted", "hired", "rejected"].map((status) => {
                      const isActive = application.status === status;
                      const isPendingThis = pendingStatus === status;
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusClick(status)}
                          disabled={isUpdating || isActive}
                          className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize flex items-center justify-center gap-2 border ${isActive
                            ? "bg-purple-600 border-purple-600 text-white shadow-md transform scale-[1.02]"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400"
                            }`}
                        >
                          {isUpdating && isPendingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : status}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Private Notes Card */}
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-5 shadow-sm">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Private Notes</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this candidate..."
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white resize-none"
                  />
                  <Button
                    onClick={handleSaveNotes}
                    disabled={!notes || isSavingNotes}
                    className="bg-purple-600 hover:bg-purple-700 px-6 whitespace-nowrap"
                  >
                    {isSavingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
                {application.notes && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Previous notes:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{application.notes}</p>
                  </div>
                )}
              </div>

              {/* AI Analysis Card (Call to Action) */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">AI Deep Analysis</h3>
                </div>
                <p className="text-purple-100 text-sm mb-4">
                  Get AI-powered analysis of this candidate's fit for the role, including skill matching and recommendations.
                </p>
                <Button
                  onClick={() => setShowAIModal(true)}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" /> Run Deep Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Modal */}
      <AIAnalysisModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        applicationId={id}
        candidateName={candidate?.name || "Candidate"}
        jobTitle={job?.title || "this position"}
      />
    </div>
  );
}