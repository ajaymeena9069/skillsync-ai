// client/src/pages/JobDetailsPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  CalendarDays,
  Globe,
  Building2,
  Sparkles,
  Share2,
  CheckCircle,
  Zap,
  Award,
  BookmarkPlus,
  BookmarkCheck,
  Mail,
  Phone,
  Heart,
  TrendingUp,
  ExternalLink,
  XCircle,
  Eye,
  Clock as ClockIcon,
  UserCheck,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { PageLoader } from "../../components/PageLoader";
import { useGetJobByIdQuery } from "../../services/jobsApi";
import {
  useApplyForJobMutation,
  useCheckApplicationStatusQuery,
} from "../../services/applicationApi";
import { useJobMatch } from "../../hooks/useJobMatch";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { ApplyModal } from "../../components/ApplyModal";
import { OptimizedAvatar } from "../../components/common/OptimizedAvatar";
import { BackButton } from "../../components/common/BackButton";

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { data: jobData, isLoading } = useGetJobByIdQuery(jobId);
  const [applyJob, { isLoading: isApplying }] = useApplyForJobMutation();
  const { data: applicationStatus, refetch: refetchStatus } =
    useCheckApplicationStatusQuery(jobId, {
      skip: !user || user?.role !== "jobseeker",
    });
  const { getJobMatch, isJobSeeker, hasResume, userSkills } = useJobMatch();

  const job = jobData?.data;
  const hasApplied = applicationStatus?.data?.hasApplied || false;
  const application = applicationStatus?.data?.application;

  const match =
    isJobSeeker && hasResume && userSkills?.length > 0 && job
      ? getJobMatch(job)
      : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApplySuccess = () => {
    refetchStatus();
  };

  const formatSalary = () => {
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

  const formatTime = () => {
    if (!job) return "Recently";
    const date = job.postedAt || job.createdAt;
    const diff = Math.floor(
      (new Date() - new Date(date)) / (1000 * 60 * 60 * 24),
    );
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Saved for later");
  };

  const handleApplyClick = () => {
    if (hasApplied) {
      toast.info("You have already applied for this position");
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplySubmit = async (data) => {
    try {
      await applyJob({
        jobId: job._id,
        coverLetter: data.coverLetter,
      }).unwrap();
      toast.success("Application submitted successfully!");
      setShowApplyModal(false);
      handleApplySuccess();
    } catch (error) {
      toast.error(error.data?.message || "Failed to submit application");
    }
  };

  const getApplicationStatusUI = () => {
    if (!hasApplied || !application) return null;

    const statusConfig = {
      pending: {
        label: "Application Pending",
        icon: ClockIcon,
        bgClass: "bg-amber-50 dark:bg-amber-950/30",
        borderClass: "border-amber-200 dark:border-amber-800",
        textClass: "text-amber-700 dark:text-amber-400",
        iconBgClass: "bg-amber-500",
        message: "⏳ Your application is being reviewed by the recruiter.",
        messageBgClass: "bg-amber-50 dark:bg-amber-950/20",
        messageTextClass: "text-amber-600 dark:text-amber-400",
      },
      reviewed: {
        label: "Application Reviewed",
        icon: Eye,
        bgClass: "bg-blue-50 dark:bg-blue-950/30",
        borderClass: "border-blue-200 dark:border-blue-800",
        textClass: "text-blue-700 dark:text-blue-400",
        iconBgClass: "bg-blue-500",
        message: "👀 The recruiter has reviewed your application.",
        messageBgClass: "bg-blue-50 dark:bg-blue-950/20",
        messageTextClass: "text-blue-600 dark:text-blue-400",
      },
      shortlisted: {
        label: "Shortlisted! 🎉",
        icon: UserCheck,
        bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
        borderClass: "border-emerald-200 dark:border-emerald-800",
        textClass: "text-emerald-700 dark:text-emerald-400",
        iconBgClass: "bg-emerald-500",
        message: "✨ The recruiter will contact you soon for the next steps.",
        messageBgClass: "bg-emerald-50 dark:bg-emerald-950/20",
        messageTextClass: "text-emerald-600 dark:text-emerald-400",
      },
      rejected: {
        label: "Not Selected",
        icon: XCircle,
        bgClass: "bg-red-50 dark:bg-red-950/30",
        borderClass: "border-red-200 dark:border-red-800",
        textClass: "text-red-700 dark:text-red-400",
        iconBgClass: "bg-red-500",
        message: "💪 Don't worry! Keep applying to other opportunities.",
        messageBgClass: "bg-red-50 dark:bg-red-950/20",
        messageTextClass: "text-red-600 dark:text-red-400",
      },
      hired: {
        label: "Hired! Congratulations 🎉",
        icon: CheckCircle,
        bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
        borderClass: "border-emerald-200 dark:border-emerald-800",
        textClass: "text-emerald-700 dark:text-emerald-400",
        iconBgClass: "bg-emerald-500",
        message:
          "🎉 Congratulations! Check your email for further instructions.",
        messageBgClass: "bg-emerald-50 dark:bg-emerald-950/20",
        messageTextClass: "text-emerald-600 dark:text-emerald-400",
      },
    };

    const config = statusConfig[application.status] || statusConfig.pending;
    const StatusIcon = config.icon;

    return (
      <div
        className={`rounded-xl border ${config.borderClass} ${config.bgClass} p-5`}
      >
        <div className="flex items-start gap-4">
          {/* Left - Icon */}
          <div
            className={`w-12 h-12 rounded-full ${config.iconBgClass} flex items-center justify-center shrink-0 shadow-sm`}
          >
            <StatusIcon className="w-5 h-5 text-white" />
          </div>

          {/* Right - Content */}
          <div className="flex-1 text-left">
            <p className={`font-semibold ${config.textClass}`}>
              {config.label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Applied on {new Date(application.createdAt).toLocaleDateString()}
            </p>

            {application.matchScore && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 dark:bg-gray-800/80 mt-2">
                <Sparkles className="w-3 h-3 text-purple-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Match Score: {application.matchScore}%
                </span>
              </div>
            )}

            {/* Message Box */}
            <div className={`mt-3 p-2.5 rounded-lg ${config.messageBgClass}`}>
              <p className={`text-xs ${config.messageTextClass}`}>
                {config.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Job not found</p>
          <Button onClick={() => navigate("/app/jobs")} className="mt-4">
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const company = job.recruiterId?.company || {};

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back Button */}
        <div className="mb-6 flex justify-start">
          <BackButton text="Go Back" fallbackPath="/app/jobs" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header - Keep as is */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full shadow-md">
                      <OptimizedAvatar
                        src={company?.logo}
                        alt={job.company}
                        fallbackText={job.company?.charAt(0)?.toUpperCase()}
                        className="w-full h-full border-2 border-gray-200 dark:border-gray-700 text-xl"
                        size={150}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {job.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {job.company}
                        </p>
                      </div>
                      {match && (
                        <Badge
                          variant="success"
                          className="gap-1 px-3 py-1.5 text-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {match.score}% Match
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4" />
                        {job.locationType === "remote"
                          ? "Remote"
                          : job.locationType === "hybrid"
                            ? "Hybrid"
                            : "Onsite"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        {job.employmentType?.replace("-", " ") || "Full-time"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4" /> Posted{" "}
                        {formatTime()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">{formatSalary()}</span>
                      </div>
                      <button
                        onClick={handleSave}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-5 h-5 text-purple-600" />
                        ) : (
                          <BookmarkPlus className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          navigator.share?.({
                            title: job.title,
                            text: job.company,
                            url: window.location.href,
                          });
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Share2 className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description - Keep as is */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  Job Description
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Required Skills - Keep as is */}
            {job.requiredSkills?.length > 0 && (
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700/50">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Required Skills
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, idx) => {
                      const isMatched = match?.matchedSkills?.some(
                        (ms) => ms.toLowerCase() === skill.toLowerCase(),
                      );
                      return (
                        <span
                          key={idx}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${isMatched
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                        >
                          {skill}
                          {isMatched && (
                            <span className="ml-1 text-purple-500">✓</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  {match?.missingSkills?.length > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        💡 Missing skills:{" "}
                        {match.missingSkills.slice(0, 5).join(", ")}
                        {match.missingSkills.length > 5 &&
                          ` +${match.missingSkills.length - 5} more`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Benefits - Keep as is */}
            {job.benefits?.length > 0 && (
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700/50">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Benefits & Perks
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {job.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Apply Card - Updated with cleaner status */}
            <div className="">
              {isJobSeeker ? (
                hasApplied ? (
                  getApplicationStatusUI()
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-80" />
                      <p className="text-sm text-white/80">
                        Ready to take the next step?
                      </p>
                    </div>
                    <Button
                      onClick={handleApplyClick}
                      className="w-full py-3 text-base bg-white text-purple-600 hover:bg-gray-100"
                    >
                      Apply Now
                    </Button>
                  </>
                )
              ) : (
                <div className="text-center">
                  <p className="text-white/80 mb-4">
                    Please login as a job seeker to apply
                  </p>
                  <Button
                    onClick={() => navigate("/auth")}
                    className="w-full bg-white text-purple-600 hover:bg-gray-100"
                  >
                    Login to Apply
                  </Button>
                </div>
              )}
            </div>

            {/* Job Overview - Keep as is */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700/50">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Job Overview
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Experience
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium capitalize">
                    {job.experienceLevel || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Employment Type
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium capitalize">
                    {job.employmentType?.replace("-", " ") || "Full-time"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Work Mode
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium capitalize">
                    {job.locationType === "remote"
                      ? "Remote"
                      : job.locationType === "hybrid"
                        ? "Hybrid"
                        : "Onsite"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Vacancies
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">
                    {job.vacancies || "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Info Card - Keep as is */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full">
                    <OptimizedAvatar
                      src={company?.logo}
                      alt={job.company}
                      fallbackText={job.company?.charAt(0)?.toUpperCase()}
                      className="w-full h-full"
                      size={100}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {job.company}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Company Profile
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Founded
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {company?.founded || "N/A"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Size
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {company?.size || "N/A"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Industry
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {company?.industry || "N/A"}
                    </p>
                  </div>
                </div>

                {company?.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {company.description}
                  </p>
                )}

                {(company?.mission || company?.vision) && (
                  <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    {company?.mission && (
                      <div>
                        <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                          Mission
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {company.mission}
                        </p>
                      </div>
                    )}
                    {company?.vision && (
                      <div>
                        <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                          Vision
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {company.vision}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  {company?.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {company.email}
                      </span>
                    </div>
                  )}
                  {company?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {company.phone}
                      </span>
                    </div>
                  )}
                  {company?.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Visit Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {(company?.socialLinks?.linkedin ||
                  company?.socialLinks?.twitter ||
                  company?.socialLinks?.github) && (
                    <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                      {company.socialLinks.linkedin && (
                        <a
                          href={company.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-purple-600 transition-colors"
                        >
                          <span className="text-sm">🔗 LinkedIn</span>
                        </a>
                      )}
                      {company.socialLinks.twitter && (
                        <a
                          href={company.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-purple-600 transition-colors"
                        >
                          <span className="text-sm">🐦 Twitter</span>
                        </a>
                      )}
                      {company.socialLinks.github && (
                        <a
                          href={company.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-purple-600 transition-colors"
                        >
                          <span className="text-sm">💻 GitHub</span>
                        </a>
                      )}
                    </div>
                  )}
              </div>
            </div>

            {/* Culture Card - Keep as is */}
            {company?.culture && (
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 text-purple-600" />
                    Company Culture
                  </h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {company.culture}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSubmit={handleApplySubmit}
        job={job}
        isLoading={isApplying}
      />
    </div>
  );
}
