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
} from "lucide-react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
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
    const diff = Math.floor(
      (new Date() - new Date(date)) / (1000 * 60 * 60 * 24),
    );
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  const getMatchScoreColor = (score) => {
    if (score >= 70) return "success";
    if (score >= 40) return "warning";
    return "default";
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

  // ✅ Get recruiterId dynamically from job object
  const handleViewCompany = () => {
    let recruiterId = null;
    
    // Check multiple possible locations for recruiterId
    if (job.recruiterId) {
      if (typeof job.recruiterId === 'object') {
        recruiterId = job.recruiterId._id || job.recruiterId.id;
      } else {
        recruiterId = job.recruiterId;
      }
    } else if (job.recruiter) {
      if (typeof job.recruiter === 'object') {
        recruiterId = job.recruiter._id || job.recruiter.id;
      } else {
        recruiterId = job.recruiter;
      }
    } else if (job.companyId) {
      if (typeof job.companyId === 'object') {
        recruiterId = job.companyId._id || job.companyId.id;
      } else {
        recruiterId = job.companyId;
      }
    }
    
    if (recruiterId) {
      navigate(`/app/companies/${recruiterId}`);
    } else {
      toast.error("Company information not available");
    }
  };

  // ✅ View job details
  const handleViewJob = () => {
    navigate(`/app/jobs/${job._id}`);
  };

  const handleApplySubmit = async (data) => {
    try {
      await applyJob({
        jobId: job._id,
        coverLetter: data.coverLetter,
      }).unwrap();

      toast.success("Application submitted successfully!");
      setShowApplyModal(false);
    } catch (error) {
      toast.error(error.data?.message || "Failed to submit application");
    }
  };

  // Compact variant
  if (variant === "compact") {
    return (
      <Card
        hover
        className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {job.title}
            </h4>
            <button
              onClick={handleViewJob}
              className="text-xs text-gray-500 dark:text-gray-400 truncate hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
              title="View job details"
            >
              {job.company}
            </button>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3" /> {job.location?.split(",")[0]}
              </span>
              {match && (
                <Badge
                  variant={getMatchScoreColor(match.score)}
                  className="text-xs px-1.5 py-0.5"
                >
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
      <Card
        hover
        className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {job.title}
              </h3>
              <button
                onClick={handleViewJob}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
              >
                {job.company}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {match && (
              <Badge
                variant={getMatchScoreColor(match.score)}
                className="font-medium"
              >
                {match.score}% Match
              </Badge>
            )}
            <Button size="sm" onClick={handleApplyClick}>
              Apply
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Default full view
  return (
    <>
      <Card
        hover
        className="p-5 group transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-full shadow-sm shrink-0">
                <OptimizedAvatar 
                  src={job.recruiterId?.company?.logo} 
                  alt={job.company} 
                  fallbackText={job.company?.charAt(0)?.toUpperCase()}
                  className="w-full h-full"
                  size={150}
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleViewJob}
                    className="font-semibold text-gray-900 dark:text-white text-lg hover:text-purple-600 transition-colors text-left"
                  >
                    {job.title}
                  </button>
                  {job.isUrgent && (
                    <Badge variant="danger" size="sm" className="animate-pulse">
                      Urgent
                    </Badge>
                  )}
                  {job.isFeatured && (
                    <Badge variant="primary" size="sm">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <button
                    onClick={handleViewCompany}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                    title="View company profile"
                  >
                    {job.company}
                  </button>
                  <span className="text-xs text-gray-300 dark:text-gray-600">
                    •
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {job.employmentType?.replace("-", " ") || "Full-time"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />{" "}
                    {job.locationType === "remote"
                      ? "Remote"
                      : job.locationType === "hybrid"
                        ? "Hybrid"
                        : "Onsite"}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> {formatSalary()}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> Posted{" "}
                    {formatTime()}
                  </span>
                  {(job.applicationCount !== undefined || job.applicationsCount !== undefined) && (
                    <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-900/30 px-2.5 py-0.5 rounded-md border border-purple-100 dark:border-purple-800/30">
                      <Users className="w-3.5 h-3.5" /> 
                      {job.applicationCount ?? job.applicationsCount} Applications
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center gap-3">
            {match && (
              <Badge
                variant={getMatchScoreColor(match.score)}
                className="font-semibold px-3 py-1.5 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                {match.score}% Match
              </Badge>
            )}
          </div>
        </div>

        {job.requiredSkills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {job.requiredSkills.slice(0, 6).map((skill) => {
              const isMatched = match?.matchedSkills?.some(
                (ms) => ms.toLowerCase() === skill.toLowerCase(),
              );
              return (
                <span
                  key={skill}
                  className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                    isMatched
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      : "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {skill}
                  {isMatched && (
                    <span className="ml-1 text-purple-500 dark:text-purple-400">
                      ✓
                    </span>
                  )}
                </span>
              );
            })}
            {job.requiredSkills.length > 6 && (
              <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                +{job.requiredSkills.length - 6} more
              </span>
            )}
          </div>
        )}

        {match?.missingSkills?.length > 0 && (
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span className="text-yellow-500 dark:text-yellow-400">⚠️</span>
            <span>
              Missing: {match.missingSkills.slice(0, 3).join(", ")}
              {match.missingSkills.length > 3 &&
                ` +${match.missingSkills.length - 3} more`}
            </span>
          </div>
        )}

        {job.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2">
            {job.description.substring(0, 200)}...
          </p>
        )}

        {showActions && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewJob}
                className="text-sm"
              >
                View Details
              </Button>
            </div>
            <Button
              size="sm"
              onClick={handleApplyClick}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Apply Now
            </Button>
          </div>
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