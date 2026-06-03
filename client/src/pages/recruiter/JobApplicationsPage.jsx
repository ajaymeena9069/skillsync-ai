// client/src/pages/recruiter/JobApplicationsPage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Star,
  CalendarDays,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Briefcase,
  MapPin,
  DollarSign,
  Sparkles,
  TrendingUp,
  Award,
  Users,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import { Button } from "../../components/Button";
import { PageLoader } from "../../components/PageLoader";
import { StatsCard } from "../../components/common/StatsCard";
import { BackButton } from "../../components/common/BackButton";
import {
  useGetJobApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from "../../services/applicationApi";
import { toast } from "sonner";

export function JobApplicationsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const { data, isLoading, refetch } = useGetJobApplicationsQuery(jobId);
  const [updateStatus] = useUpdateApplicationStatusMutation();
  const [expandedCoverLetters, setExpandedCoverLetters] = useState({});

  const toggleCoverLetter = (appId) => {
    setExpandedCoverLetters((prev) => ({
      ...prev,
      [appId]: !prev[appId],
    }));
  };

  const applications = data?.data || [];
  const job = data?.job;

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        icon: Clock,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        borderColor: "border-amber-200 dark:border-amber-800",
      },
      reviewed: {
        label: "Reviewed",
        icon: Eye,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        borderColor: "border-blue-200 dark:border-blue-800",
      },
      shortlisted: {
        label: "Shortlisted",
        icon: UserCheck,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        borderColor: "border-purple-200 dark:border-purple-800",
      },
      rejected: {
        label: "Rejected",
        icon: XCircle,
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        borderColor: "border-red-200 dark:border-red-800",
      },
      hired: {
        label: "Hired",
        icon: CheckCircle,
        color:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        borderColor: "border-emerald-200 dark:border-emerald-800",
      },
    };
    return configs[status] || configs.pending;
  };

  const handleStatusChange = async (applicationId, newStatus, notes = "") => {
    setUpdatingId(applicationId);
    try {
      await updateStatus({ applicationId, status: newStatus, notes }).unwrap();
      toast.success(`Application marked as ${newStatus}`);
      refetch();
      setSelectedApp(null);
    } catch (error) {
      toast.error(error.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: Users,
      change: "",
      color: "from-purple-500 to-indigo-500",
    },
    {
      label: "Pending Review",
      value: applications.filter((a) => a.status === "pending").length,
      icon: Clock,
      change: "",
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Shortlisted",
      value: applications.filter((a) => a.status === "shortlisted").length,
      icon: UserCheck,
      change: "",
      color: "from-purple-500 to-indigo-500",
    },
    {
      label: "Hired",
      value: applications.filter((a) => a.status === "hired").length,
      icon: CheckCircle,
      change: "",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-0" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-0" />

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>Candidate Management</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
              Applications for{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {job?.title}
              </span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto dark:text-gray-400">
              {job?.company} • {job?.location}
            </p>

            <div className="flex justify-center mt-6">
              <BackButton text="Back to Jobs" fallbackPath="/app/jobs-posted" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-12 text-center shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:from-purple-900/30 dark:to-indigo-900/30">
              <Users className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2 dark:text-white">
              No applications yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Applicants will appear here when they apply
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application, index) => {
              const candidate = application.userId;
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={application._id}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom duration-500 dark:bg-gray-800/80 dark:border-gray-700/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Candidate Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full blur-sm opacity-60" />
                          <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
                            <span className="text-lg font-semibold text-white">
                              {candidate?.name?.charAt(0) || "?"}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                              {candidate?.name || "Unknown User"}
                            </h3>
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color} ${statusConfig.borderColor}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5" />{" "}
                              {candidate?.email}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <CalendarDays className="w-3.5 h-3.5" />
                              Applied {formatDate(application.createdAt)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 text-purple-500" />
                              Match Score:{" "}
                              <span className="font-semibold text-purple-600 dark:text-purple-400">
                                {application.matchScore}%
                              </span>
                            </span>
                          </div>

                          {/* Skills */}
                          {candidate?.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {candidate.skills.slice(0, 5).map((skill) => (
                                <span
                                  key={skill}
                                  className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                >
                                  {skill}
                                </span>
                              ))}
                              {candidate.skills.length > 5 && (
                                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500">
                                  +{candidate.skills.length - 5}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Experience */}
                          {candidate?.experience && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Briefcase className="w-3.5 h-3.5" />
                              <span>{candidate.experience} experience</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/app/candidates/${application._id}`)
                        }
                        className="gap-2 rounded-xl border border-purple-200 bg-white text-purple-700 shadow-sm transition-all duration-200 hover:border-purple-300 hover:bg-purple-600 hover:text-white dark:border-purple-700 dark:bg-white/5 dark:text-purple-200 dark:hover:bg-purple-500 dark:hover:text-white"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Candidate
                      </Button>
                      {application.resumeUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(application.resumeUrl, "_blank")
                          }
                          className="gap-2 rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:border-purple-300 hover:bg-purple-600 hover:text-white dark:border-gray-700 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-purple-500 dark:hover:text-white"
                        >
                          <Download className="w-4 h-4" />
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Cover Letter Preview */}
                  {application.coverLetter && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 rounded-xl border border-purple-100 dark:from-purple-900/20 dark:to-indigo-900/20 dark:border-purple-800/30">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-3.5 h-3.5 text-purple-500" />
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Cover Letter
                        </p>
                      </div>
                      <p className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${!expandedCoverLetters[application._id] ? 'line-clamp-2' : 'whitespace-pre-wrap'}`}>
                        {application.coverLetter}
                      </p>
                      {application.coverLetter.length > 100 && (
                        <button
                          onClick={() => toggleCoverLetter(application._id)}
                          className="mt-3 px-3.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900/70 dark:text-purple-300 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none shadow-sm inline-block"
                        >
                          {expandedCoverLetters[application._id] ? "View Less" : "View More"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Status Update Section */}
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-wrap gap-2">
                      {["reviewed", "shortlisted", "rejected", "hired"].map(
                        (status) => {
                          const isActive = application.status === status;
                          return (
                            <button
                              key={status}
                              onClick={() =>
                                handleStatusChange(application._id, status)
                              }
                              disabled={updatingId === application._id}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                                isActive
                                  ? status === "rejected"
                                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md"
                                    : status === "hired"
                                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                                      : status === "shortlisted"
                                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                                        : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                              }`}
                            >
                              {updatingId === application._id ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                status
                              )}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
