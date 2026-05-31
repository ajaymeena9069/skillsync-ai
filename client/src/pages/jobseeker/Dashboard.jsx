// client/src/pages/Dashboard.jsx
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
  Target,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/Button";
import { ResumeUpload } from "../../components/resume-upload";
import { useGetResumeQuery } from "../../services/resumeApi";
import { useGetMyApplicationsQuery } from "../../services/applicationApi";
import { useGetJobsQuery } from "../../services/jobsApi";
import { useGetProfileQuery } from "../../services/jobseekerApi";
import { useSelector } from "react-redux";
import { PageLoader } from "../../components/PageLoader";
import { useJobMatch } from "../../hooks/useJobMatch";
import { StatsCard } from "../../components/common/StatsCard";
import { ProfileProgress } from "../../components/common/ProfileProgress";
import { EmptyState } from "../../components/common/EmptyState";
import { WelcomeCard } from "../../components/common/WelcomeCard";
import { JobCard } from "../../components/JobCard"; // ✅ Import JobCard component

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

  const { data: profileResponse, isLoading: profileLoading } = useGetProfileQuery(undefined, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const latestUser = profileResponse?.data || user;
  
  const hasResume = resumeData?.data && resumeData.data.skills?.length > 0;
  const extractedSkills = resumeData?.data?.skills || [];
  const applications = applicationsData?.data || [];
  const jobs = jobsData?.data || [];

  const appliedJobIds = useMemo(() => {
    return new Set(
      applications.map((app) => app.jobId?._id || app.jobId).filter(Boolean),
    );
  }, [applications]);

  const matchedJobs = useMemo(() => {
    if (!jobs.length) return [];

    return jobs
      .filter((job) => !appliedJobIds.has(job._id))
      .map((job) => {
        const match = getJobMatch(job);
        return {
          ...job,
          matchScore: match?.score || 0,
          matchColor: match?.color || "red",
          matchLabel: match?.label || "No Match",
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
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
      value: (latestUser?.profileViews || 0).toString(),
      icon: Eye,
      change: latestUser?.profileViews > 0 ? "+1" : "", // simplified since we don't track historical changes per day yet
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
        color:
          "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      });
    });

    if (hasResume) {
      activities.push({
        action: "Resume analyzed and skills extracted",
        time: getTimeAgo(resumeData?.data?.uploadedAt),
        icon: FileText,
        color:
          "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
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
        color:
          "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      });
    });

    return activities.slice(0, 4);
  }, [applications, hasResume, matchedJobs, resumeData]);

  if (resumeLoading || appsLoading || jobsLoading || profileLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <WelcomeCard user={latestUser} />

        {/* Profile Progress Component */}
        <ProfileProgress user={latestUser} />

        {/* Stats Cards */}
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
                message="Upload your resume from the sidebar to see personalized job matches."
                icon={Briefcase}
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
                {matchedJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    showActions={true}
                    variant="default"
                  />
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
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700/50 p-5 shadow-sm">
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
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700/50 p-5 shadow-sm">
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
