import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Sparkles,
  Code,
  Eye,
  Award,
  Target,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/Button";
import { MatchBadge } from "../../components/ui/MatchBadge";
import { ResumeUpload } from "../../components/resume-upload";
import { useGetResumeQuery } from "../../services/resumeApi";
import { useGetMyApplicationsQuery } from "../../services/applicationApi";
import { useGetJobsQuery } from "../../services/jobsApi";
import { useSelector } from "react-redux";
import { PageLoader } from "../../components/PageLoader";
import { useJobMatch } from "../../hooks/useJobMatch";
import { PageHeader } from "../../components/common/PageHeader";
import { StatsCard } from "../../components/common/StatsCard";
import { ProfileProgress } from "../../components/common/ProfileProgress";
import { EmptyState } from "../../components/common/EmptyState";

// Helper function
const getTimeAgo = (date) => {
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

export function Dashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { getJobMatch } = useJobMatch();

  // Fetch real data
  const { data: resumeData, isLoading: resumeLoading } = useGetResumeQuery();
  const { data: applicationsData, isLoading: appsLoading } =
    useGetMyApplicationsQuery();
  const { data: jobsData, isLoading: jobsLoading } = useGetJobsQuery({
    limit: 10,
  });

  const hasResume = resumeData?.data && resumeData.data.skills?.length > 0;
  const extractedSkills = resumeData?.data?.skills || [];
  const applications = applicationsData?.data || [];
  const jobs = jobsData?.data || [];

  // Get matched jobs with real match scores using the shared hook
  // Build a set of applied job IDs to filter them out from recommendations
  const appliedJobIds = useMemo(() => {
    return new Set(
      applications
        .map((app) => app.jobId?._id || app.jobId)
        .filter(Boolean)
    );
  }, [applications]);

  const matchedJobs = useMemo(() => {
    if (!jobs.length) return [];

    return jobs
      .filter((job) => !appliedJobIds.has(job._id))
      .map((job) => {
        const match = getJobMatch(job);
        return {
          id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.employmentType?.replace("-", " ") || "Full-time",
          salary:
            job.salaryMin && job.salaryMax
              ? `${job.salaryCurrency === "INR" ? "₹" : "$"}${job.salaryMin.toLocaleString()} - ${job.salaryCurrency === "INR" ? "₹" : "$"}${job.salaryMax.toLocaleString()}`
              : "Salary not disclosed",
          matchScore: match?.score || 0,
          matchColor: match?.color || "red",
          matchLabel: match?.label || "No Match",
          skills: job.requiredSkills?.slice(0, 4) || [],
          postedTime: getTimeAgo(job.postedAt || job.createdAt),
          jobId: job._id,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);
  }, [jobs, getJobMatch, appliedJobIds]);

  // Stats for StatsCard components
  const highMatches = matchedJobs.filter((j) => j.matchScore >= 70).length;
  const goodMatches = matchedJobs.filter((j) => j.matchScore >= 50).length;
  const pendingApps = applications.filter((a) => a.status === "pending").length;

  const stats = [
    {
      label: "Job Matches",
      value: goodMatches.toString(),
      icon: Briefcase,
      change: highMatches > 0 ? `+${highMatches}` : "",
      color: "from-purple-500 to-indigo-600",
    },
    {
      label: "Skills Detected",
      value: extractedSkills.length.toString(),
      icon: Code,
      change: extractedSkills.length > 0 ? `+${extractedSkills.length}` : "",
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Applications",
      value: applications.length.toString(),
      icon: Target,
      change: pendingApps > 0 ? `+${pendingApps}` : "",
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Profile Views",
      value: "42",
      icon: Eye,
      change: "+12",
      color: "from-orange-500 to-amber-600",
    },
  ];

  // Recent activity from real data
  const recentActivities = useMemo(() => {
    const activities = [];

    applications.slice(0, 3).forEach((app) => {
      activities.push({
        action: `Applied for ${app.jobId?.title || "a position"}`,
        time: getTimeAgo(app.createdAt),
        icon: Briefcase,
        color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      });
    });

    if (hasResume) {
      activities.push({
        action: "Resume analyzed and skills extracted",
        time: getTimeAgo(resumeData?.data?.uploadedAt),
        icon: FileText,
        color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      });
    }

    const topMatches = matchedJobs
      .filter((j) => j.matchScore >= 70)
      .slice(0, 2);
    topMatches.forEach((match) => {
      activities.push({
        action: `New match found: ${match.title} at ${match.company}`,
        time: getTimeAgo(new Date()),
        icon: Sparkles,
        color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      });
    });

    return activities.slice(0, 4);
  }, [applications, hasResume, matchedJobs, resumeData]);

  if (resumeLoading || appsLoading || jobsLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <PageHeader
          badge={`Welcome back, ${user?.name?.split(" ")[0] || "User"}`}
          title="Your Career"
          gradientText="Dashboard"
          description={
            hasResume
              ? "Your career journey continues. Here are your personalized job matches."
              : "Upload your resume to unlock AI-powered job recommendations"
          }
        />

        {!hasResume && (
          <div className="flex justify-end">
            <Button
              onClick={() => navigate("/app/profile")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all px-6"
            >
              <Award className="w-4 h-4 mr-2" />
              Complete Profile
            </Button>
          </div>
        )}

        {/* Profile Progress Component */}
        <ProfileProgress user={user} userType="jobseeker" />

        {/* Stats Cards - Using Common Component */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jobs Section - Left 2/3 */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recommended for You
                </h2>
              </div>
              {hasResume && matchedJobs.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/app/jobs")}
                  className="text-purple-600 gap-1"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            {!hasResume && (
              <EmptyState
                title="No resume found"
                message="Upload your resume to see personalized job matches."
                icon={Briefcase}
                action={
                  <ResumeUpload />
                }
              />
            )}

            {hasResume && matchedJobs.length === 0 && (
              <EmptyState
                title="No job matches yet"
                message="Check back later for new job opportunities."
                icon={Briefcase}
                action={
                  <Button
                    onClick={() => navigate("/app/jobs")}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600"
                  >
                    Browse Jobs
                  </Button>
                }
              />
            )}

            {hasResume && matchedJobs.length > 0 && (
              <div className="space-y-4">
                {matchedJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {job.company}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {job.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" /> {job.salary}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MatchBadge score={job.matchScore} size="md" />
                        <Button
                          size="sm"
                          onClick={() => navigate(`/app/jobs/${job.id}`)}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-6">
            <ResumeUpload />

            {/* Pro Tips Card */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Pro Tips</h3>
                </div>
                <ul className="space-y-3 text-sm text-white/90">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Add relevant skills to improve matches
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Complete your profile for better visibility
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Apply within 48 hours of job posting
                  </li>
                </ul>
              </div>
            </div>

            {/* Your Skills Card */}
            {hasResume && extractedSkills.length > 0 && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Your Top Skills
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.slice(0, 10).map((skill, i) => (
                    <span
                      key={i}
                      className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {extractedSkills.length > 10 && (
                    <span className="text-sm text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/30 px-3 py-1.5 rounded-full">
                      +{extractedSkills.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 group cursor-pointer"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl ${activity.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}

                {recentActivities.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No recent activity
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/app/jobs")}
                      className="mt-3"
                    >
                      Browse Jobs
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
