// client/src/components/JobCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  DollarSign,
  CalendarDays,
  Globe,
  Building2,
  Sparkles,
  Users,
  Eye,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useJobMatch } from "../hooks/useJobMatch";
import { ApplyModal } from "../components/ApplyModal";
import { useApplyForJobMutation } from "../services/applicationApi";
import { toast } from "sonner";
import { OptimizedAvatar } from "./common/OptimizedAvatar";

export function JobCard({
  job,
  variant = "default",
  onApply,
  onSave,
  showActions = true,
}) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(job?.isSaved || false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const { getJobMatch, isJobSeeker, hasResume, userSkills } = useJobMatch();
  const [applyJob, { isLoading: isApplying }] = useApplyForJobMutation();

  const match =
    isJobSeeker && hasResume && userSkills?.length > 0
      ? getJobMatch(job)
      : null;

  const formatSalary = () => {
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
    const date = job.postedAt || job.createdAt;
    if (!date) return "Recently";
    const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  const getMatchScoreColor = (score) => {
    if (score >= 70) return "success";
    if (score >= 40) return "warning";
    return "secondary";
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(job);
  };

  const handleApplyClick = () => {
    if (onApply) {
      onApply(job);
    } else {
      setShowApplyModal(true);
    }
  };

  const handleViewJob = () => {
    navigate(`/app/jobs/${job._id}`);
  };

  const handleViewCompany = () => {
    let recruiterId = null;
    if (job.recruiterId) {
      recruiterId = typeof job.recruiterId === "object" ? job.recruiterId._id || job.recruiterId.id : job.recruiterId;
    } else if (job.recruiter) {
      recruiterId = typeof job.recruiter === "object" ? job.recruiter._id || job.recruiter.id : job.recruiter;
    } else if (job.companyId) {
      recruiterId = typeof job.companyId === "object" ? job.companyId._id || job.companyId.id : job.companyId;
    }
    if (recruiterId) {
      navigate(`/app/companies/${recruiterId}`);
    } else {
      toast.error("Company information not available");
    }
  };

  const handleApplySubmit = async (data) => {
    try {
      await applyJob({ jobId: job._id, coverLetter: data.coverLetter }).unwrap();
      toast.success("Application submitted successfully!");
      setShowApplyModal(false);
    } catch (error) {
      toast.error(error.data?.message || "Failed to submit application");
    }
  };

  // Compact variant
  if (variant === "compact") {
    return (
      <Card className="p-3 hover:shadow-md transition-all duration-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">{job.title}</h4>
            <button onClick={handleViewJob} className="text-xs text-gray-500 dark:text-gray-400 truncate hover:text-purple-600 transition-colors">
              {job.company}
            </button>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3" /> {job.location?.split(",")[0]}
              </span>
              {match && (
                <Badge variant={getMatchScoreColor(match.score)} className="text-xs px-1.5 py-0.5 rounded-full">
                  {match.score}%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Minimal variant
  if (variant === "minimal") {
    return (
      <Card className="p-4 hover:shadow-md transition-all rounded-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{job.title}</h3>
              <button onClick={handleViewJob} className="text-sm text-gray-500 hover:text-purple-600 transition-colors">
                {job.company}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {match && (
              <Badge variant={getMatchScoreColor(match.score)} className="font-medium rounded-full">
                {match.score}% Match
              </Badge>
            )}
            <Button size="sm" onClick={handleApplyClick} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Apply
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Default detailed view (improved)
  return (
    <>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200/50 dark:border-gray-800/50 rounded-2xl">
        <CardContent className="p-0">
          <div className="p-5 space-y-4">
            {/* Header row: circular avatar, title, match badge */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Circular Avatar (restored) */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center shrink-0 shadow-sm overflow-hidden ring-2 ring-white dark:ring-gray-800">
                  <OptimizedAvatar
                    src={job.recruiterId?.company?.logo}
                    alt={job.company}
                    fallbackText={job.company?.charAt(0)?.toUpperCase()}
                    className="w-full h-full object-cover"
                    size={150}
                  />
                </div>
                <div className="pt-0.5">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <button
                      onClick={handleViewJob}
                      className="font-bold text-gray-900 dark:text-white text-xl hover:text-purple-600 transition-colors text-left line-clamp-1"
                    >
                      {job.title}
                    </button>
                    {job.isUrgent && (
                      <Badge variant="danger" className="animate-pulse text-[10px] px-2 py-0.5 uppercase tracking-wider rounded-full">
                        Urgent
                      </Badge>
                    )}
                    {job.isFeatured && (
                      <Badge variant="primary" className="text-[10px] px-2 py-0.5 uppercase tracking-wider rounded-full">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <button
                      onClick={handleViewCompany}
                      className="font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors"
                    >
                      {job.company}
                    </button>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="capitalize hidden sm:inline">{job.employmentType?.replace("-", " ") || "Full-time"}</span>
                  </div>
                </div>
              </div>
              {/* Match badge - desktop */}
              {match && (
                <div className="shrink-0 hidden sm:block">
                  <Badge
                    variant={getMatchScoreColor(match.score)}
                    className="font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {match.score}% Match
                  </Badge>
                </div>
              )}
            </div>

            {/* Key info row with glass effect */}
            <div className="flex flex-wrap gap-4 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="font-medium">{formatSalary()}</span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 hidden sm:block" />
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="font-medium">
                  {job.locationType === "remote" ? "Remote" : job.locationType === "hybrid" ? "Hybrid" : "Onsite"}
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 hidden sm:block" />
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <CalendarDays className="w-4 h-4 text-orange-500" />
                <span className="font-medium">Posted {formatTime()}</span>
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                {job.description}
              </p>
            )}

            {/* Skills */}
            {job.requiredSkills?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.slice(0, 5).map((skill) => {
                  const isMatched = match?.matchedSkills?.some((ms) => ms.toLowerCase() === skill.toLowerCase());
                  return (
                    <span
                      key={skill}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${isMatched
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 ring-1 ring-purple-300 dark:ring-purple-700"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                    >
                      {skill}
                      {isMatched && <CheckCircle2 className="inline w-3 h-3 ml-1 text-purple-600" />}
                    </span>
                  );
                })}
                {job.requiredSkills.length > 5 && (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 font-medium">
                    +{job.requiredSkills.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* Missing skills warning */}
            {match?.missingSkills?.length > 0 && (
              <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-lg border border-amber-100 dark:border-amber-900/30">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Missing core skills: <span className="font-semibold">{match.missingSkills.slice(0, 3).join(", ")}</span>
                  {match.missingSkills.length > 3 && ` +${match.missingSkills.length - 3}`}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        {showActions && (
          <CardFooter className="px-5 py-4 bg-gray-50/80 dark:bg-gray-800/40 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between gap-3 rounded-b-2xl">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900"></div>
                <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-900"></div>
                <div className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-500 border-2 border-white dark:border-gray-900"></div>
              </div>
              <span>{job.applicationsCount || 0} applicants</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleViewJob}
                className="flex-1 sm:flex-none border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <Eye className="w-4 h-4 mr-1" /> Details
              </Button>
              <Button
                onClick={handleApplyClick}
                className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm transition-all"
              >
                Apply Now
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSubmit={handleApplySubmit}
        job={job}
        isLoading={isApplying}
      />
    </>
  );
}