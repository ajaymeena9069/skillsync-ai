// client/src/pages/MyApplicationsPage.jsx
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
  AlertCircle,
  Building2,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { StatsCard } from "../../components/common/StatsCard";
import {
  useGetMyApplicationsQuery,
  useWithdrawApplicationMutation,
} from "../../services/applicationApi";
import { toast } from "sonner";
import { PageLoader } from "../../components/PageLoader";


export function MyApplicationsPage() {
  const navigate = useNavigate();
  const [withdrawingId, setWithdrawingId] = useState(null);

  const { data, isLoading, refetch } = useGetMyApplicationsQuery();
  const [withdrawApplication] = useWithdrawApplicationMutation();
  const [expandedCoverLetters, setExpandedCoverLetters] = useState({});

  const toggleCoverLetter = (appId) => {
    setExpandedCoverLetters((prev) => ({
      ...prev,
      [appId]: !prev[appId],
    }));
  };

  const applications = data?.data || [];

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending Review",
        icon: ClockIcon,
        color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
        gradient: "from-amber-500 to-orange-500",
      },
      reviewed: {
        label: "Under Review",
        icon: Eye,
        color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
        gradient: "from-blue-500 to-cyan-500",
      },
      shortlisted: {
        label: "Shortlisted",
        icon: UserCheck,
        color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
        gradient: "from-purple-500 to-indigo-500",
      },
      rejected: {
        label: "Not Selected",
        icon: XCircle,
        color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
        gradient: "from-red-500 to-rose-500",
      },
      hired: {
        label: "Hired! 🎉",
        icon: CheckCircle,
        color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
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

  if (isLoading) return <PageLoader />;

  if (applications.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
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
        <div className="space-y-5">
          {applications.map((application, index) => {
            const job = application.jobId;
            const statusConfig = getStatusConfig(application.status);
            const StatusIcon = statusConfig.icon;
            const canWithdraw = application.status === "pending";

            return (
              <Card
                key={application._id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Company Avatar */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-all dark:from-purple-900/30 dark:to-indigo-900/30">
                          <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
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
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {job?.company || "Unknown Company"}
                          </p>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-full shadow-sm self-start dark:from-purple-900/20 dark:to-indigo-900/20">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                          Match Score: {application.matchScore}%
                        </span>
                      </div>
                    </div>

                    {/* Job Details Row */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {job?.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {job.location}
                        </span>
                      )}
                      {job?.employmentType && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {job.employmentType?.replace("-", " ")}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        {formatSalary(job)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                        Applied {formatDate(application.createdAt)}
                      </span>
                    </div>

                    {/* Cover Letter Preview */}
                    {application.coverLetter && (
                      <div className="mt-2 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-purple-500" />
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Cover Letter
                          </p>
                        </div>
                        <p className={`text-sm text-gray-600 dark:text-gray-300 leading-relaxed ${!expandedCoverLetters[application._id] ? 'line-clamp-3' : 'whitespace-pre-wrap'}`}>
                          {application.coverLetter}
                        </p>
                        {application.coverLetter.length > 150 && (
                          <button
                            onClick={() => toggleCoverLetter(application._id)}
                            className="mt-3 px-3.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900/70 dark:text-purple-300 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none shadow-sm inline-block"
                          >
                            {expandedCoverLetters[application._id] ? "View Less" : "View More"}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Application ID: {application._id.slice(-8)}</span>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/app/jobs/${job?._id}`)}
                          className="gap-2 border-gray-300 dark:border-gray-700 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
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
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}