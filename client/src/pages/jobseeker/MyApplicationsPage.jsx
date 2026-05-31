import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  CalendarDays,
  DollarSign,
  Clock,
  Eye,
  XCircle,
  CheckCircle,
  Clock as ClockIcon,
  UserCheck,
  FileText,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/Button";
import { StatsCard } from "../../components/common/StatsCard";
import {
  useGetMyApplicationsQuery,
  useWithdrawApplicationMutation,
} from "../../services/applicationApi";
import { toast } from "sonner";
import { PageLoader } from "../../components/PageLoader";

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const [withdrawingId, setWithdrawingId] = useState(null);

  const { data, isLoading, refetch } = useGetMyApplicationsQuery();
  const [withdrawApplication] = useWithdrawApplicationMutation();

  const applications = data?.data || [];

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending Review",
        icon: ClockIcon,
        color:
          "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
        gradient: "from-amber-500 to-orange-500",
      },
      reviewed: {
        label: "Under Review",
        icon: Eye,
        color:
          "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
        gradient: "from-blue-500 to-cyan-500",
      },
      shortlisted: {
        label: "Shortlisted",
        icon: UserCheck,
        color:
          "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
        gradient: "from-purple-500 to-indigo-500",
      },
      rejected: {
        label: "Not Selected",
        icon: XCircle,
        color:
          "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        gradient: "from-red-500 to-rose-500",
      },
      hired: {
        label: "Hired! 🎉",
        icon: CheckCircle,
        color:
          "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
        gradient: "from-emerald-500 to-teal-500",
      },
    };
    return configs[status] || configs.pending;
  };

  const formatSalary = (job) => {
    if (!job) return "Not disclosed";
    const { salaryMin, salaryMax, salaryCurrency } = job;
    if (!salaryMin && !salaryMax) return "Not disclosed";
    const symbol =
      { INR: "₹", USD: "$", EUR: "€", GBP: "£" }[salaryCurrency] || "$";
    if (salaryMin && salaryMax)
      return `${symbol}${salaryMin.toLocaleString()} - ${symbol}${salaryMax.toLocaleString()}`;
    if (salaryMin) return `From ${symbol}${salaryMin.toLocaleString()}`;
    return `Up to ${symbol}${salaryMax.toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return "Recently";
    const diff = Math.floor(
      (new Date() - new Date(date)) / (1000 * 60 * 60 * 24),
    );
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  const handleWithdraw = async (applicationId) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;

    setWithdrawingId(applicationId);
    try {
      await withdrawApplication(applicationId).unwrap();
      toast.success("Application withdrawn successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to withdraw application");
    } finally {
      setWithdrawingId(null);
    }
  };

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: Briefcase,
      change: "",
      color: "from-purple-500 to-indigo-500",
    },
    {
      label: "Pending Review",
      value: applications.filter((a) => a.status === "pending").length,
      icon: ClockIcon,
      change: "",
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "In Progress",
      value: applications.filter(
        (a) => a.status === "shortlisted" || a.status === "reviewed",
      ).length,
      icon: TrendingUp,
      change: "",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Offers Received",
      value: applications.filter((a) => a.status === "hired").length,
      icon: Award,
      change: "",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:from-purple-900/30 dark:to-indigo-900/30">
              <Briefcase className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2 dark:text-white">
              No applications yet
            </h3>
            <p className="text-gray-500 mb-6 dark:text-gray-400">
              Start applying to jobs and they'll appear here
            </p>
            <Button
              onClick={() => navigate("/app/jobs")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              Browse Jobs
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>Application Tracker</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
            My{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Applications
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto dark:text-gray-400">
            Track and manage all your job applications in one place
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((application, index) => {
            const job = application.jobId;
            const statusConfig = getStatusConfig(application.status);
            const StatusIcon = statusConfig.icon;
            const canWithdraw = application.status === "pending";

            return (
              <div
                key={application._id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Company Logo */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-all dark:from-purple-900/30 dark:to-indigo-900/30">
                        <Briefcase className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                      </div>

                      <div className="flex-1">
                        {/* Title & Status */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-purple-600 transition-colors dark:text-white dark:group-hover:text-purple-400">
                            {job?.title || "Job not found"}
                          </h3>
                          <div
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            <span>{statusConfig.label}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 mb-3 dark:text-gray-400">
                          {job?.company || "Unknown Company"}
                        </p>

                        {/* Job Details */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          {job?.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              {job.location}
                            </span>
                          )}
                          {job?.employmentType && (
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              {job.employmentType?.replace("-", " ")}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            {formatSalary(job)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            Applied {formatDate(application.createdAt)}
                          </span>
                        </div>

                        {/* Match Score */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-full dark:from-purple-900/20 dark:to-indigo-900/20">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                              Match Score: {application.matchScore}%
                            </span>
                          </div>
                        </div>

                        {/* Cover Letter Preview */}
                        {application.coverLetter && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-200 dark:from-gray-900/50 dark:to-gray-900/30 dark:border-gray-800">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Cover Letter
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed dark:text-gray-400">
                              {application.coverLetter.length > 180
                                ? application.coverLetter.substring(0, 180) +
                                  "..."
                                : application.coverLetter}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/app/jobs/${job?._id}`)}
                      className="gap-2 border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all dark:border-gray-700 dark:hover:border-purple-700 dark:hover:bg-purple-900/20"
                    >
                      <Eye className="w-4 h-4" />
                      View Job
                    </Button>
                    {canWithdraw && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleWithdraw(application._id)}
                        isLoading={withdrawingId === application._id}
                        className="gap-2 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30"
                      >
                        <XCircle className="w-4 h-4" />
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
