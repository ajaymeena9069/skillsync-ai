// client/src/pages/RecruiterDashboard.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  Star,
  Plus,
  Eye,
  Award,
  ChevronRight,
  Sparkles,
  Filter,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { JobFormModal } from "../../components/JobFormModal";
import {
  useCreateJobMutation,
  useGetMyJobsQuery,
} from "../../services/jobsApi";
import { useGetDashboardStatsQuery } from "../../services/recruiterApi";
import { WelcomeCard } from "../../components/common/WelcomeCard";
import { StatsCard } from "../../components/common/StatsCard";
import { FilterBar } from "../../components/common/FilterBar";
import { EmptyState } from "../../components/common/EmptyState";
import { CandidateCard } from "../../components/common/CandidateCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ProfileProgress } from "../../components/common/ProfileProgress";
import { useSelector } from "react-redux";
import { PageLoader } from "../../components/PageLoader";

export function RecruiterDashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const { data: myJobsData, refetch } = useGetMyJobsQuery();
  const { data: statsData, isLoading: statsLoading } =
    useGetDashboardStatsQuery();
  const user = useSelector((state) => state.auth.user);

  // Stats cards configuration
  const stats = [
    {
      label: "Active Jobs",
      value: statsData?.data?.stats?.activeJobs || 0,
      icon: Briefcase,
      change: statsData?.data?.stats?.activeJobs
        ? `+${statsData.data.stats.activeJobs}`
        : "",
      color: "from-purple-500 to-indigo-600",
    },
    {
      label: "Total Applicants",
      value: statsData?.data?.stats?.totalApplicants || 0,
      icon: Users,
      change: statsData?.data?.stats?.totalApplicants
        ? `+${statsData.data.stats.totalApplicants}`
        : "",
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Shortlisted",
      value: statsData?.data?.stats?.shortlisted || 0,
      icon: Star,
      change: statsData?.data?.stats?.shortlisted
        ? `+${statsData.data.stats.shortlisted}`
        : "",
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Hired",
      value: statsData?.data?.stats?.hired || 0,
      icon: Award,
      change: statsData?.data?.stats?.hired
        ? `+${statsData.data.stats.hired}`
        : "",
      color: "from-orange-500 to-amber-600",
    },
  ];

  const filterOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "New" },
    { value: "reviewed", label: "Reviewed" },
    { value: "shortlisted", label: "Shortlisted" },
  ];

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    const candidates = statsData?.data?.topCandidates || [];
    if (!searchTerm && statusFilter === "all") return candidates;
    return candidates.filter((candidate) => {
      const matchesSearch =
        searchTerm === "" ||
        candidate.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || candidate.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, statsData]);

  const topCandidates = filteredCandidates.slice(0, 3);

  const handleCreateJob = async (jobData) => {
    try {
      await createJob(jobData).unwrap();
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  if (statsLoading) {
    return (
      <PageLoader />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & Profile Section */}
        <WelcomeCard user={user} />
        <ProfileProgress user={user} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Applications Trend Chart */}
        {statsData?.data?.chartData?.length > 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-4 sm:p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Applications Trend
                </h3>
              </div>
              <Badge
                variant="primary"
                className="text-xs bg-white/80 dark:bg-purple-900/50 self-start sm:self-auto"
              >
                Last 6 months
              </Badge>
            </div>
            <div className="w-full h-[250px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={statsData.data.chartData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    strokeOpacity={0.3}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fill="#8B5CF6"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Candidates & Jobs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Matched Candidates Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Top Matched Candidates
                  </h2>
                </div>
                <FilterBar
                  searchPlaceholder="Search candidates by name..."
                  searchValue={searchTerm}
                  onSearchChange={setSearchTerm}
                  filterOptions={filterOptions}
                  filterValue={statusFilter}
                  onFilterChange={setStatusFilter}
                  filterLabel="Status"
                  onClear={clearFilters}
                  // Optional props:
                  // variant="default" | "compact" | "minimal"
                  // showClearButton={true}
                  // showSearch={true}
                  className="mb-4"
                />
              </div>

              {topCandidates.length === 0 ? (
                <EmptyState
                  title="No candidates found"
                  message={
                    searchTerm || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "No applications received yet. Share your job postings to attract candidates."
                  }
                  icon={Filter}
                />
              ) : (
                <div className="space-y-4">
                  {topCandidates.map((candidate, index) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={{ ...candidate, rank: index + 1 }}
                      variant="default"
                      showRank={true}
                      onViewProfile={() =>
                        navigate(`/app/candidates/${candidate.applicationId}`)
                      }
                    />
                  ))}
                  {filteredCandidates.length > 3 && (
                    <div className="text-center pt-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate("/app/candidates")}
                        className="gap-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 hover:text-purple-800 dark:hover:bg-purple-900/30 dark:hover:text-purple-200"
                      >
                        View All {filteredCandidates.length} Candidates
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Active Jobs Table */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Active Job Postings
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all gap-1.5"
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                      Post Job
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/app/jobs-posted")}
                      size="sm"
                      className="border-gray-200 dark:border-gray-700"
                    >
                      View All
                    </Button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Applicants
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {myJobsData?.data?.slice(0, 3).length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          No active jobs yet. Click "Post Job" to create one.
                        </td>
                      </tr>
                    ) : (
                      myJobsData?.data?.slice(0, 3).map((job) => (
                        <tr
                          key={job._id}
                          className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white text-sm">
                            {job.title}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {job.applicationsCount || 0}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="primary"
                              className="text-xs capitalize"
                            >
                              {job.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/app/jobs/${job._id}/applications`)
                              }
                              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-3">
                {statsData?.data?.recentActivity?.length > 0 ? (
                  statsData.data.recentActivity
                    .slice(0, 4)
                    .map((activity, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-purple-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {activity.candidate} • {activity.jobTitle}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </div>

            {/* Pro Tip Card */}
            <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-10 -mb-10" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 shrink-0 text-yellow-300" />
                  <h3 className="font-semibold">Pro Tip: AI Screening</h3>
                </div>
                <p className="text-sm text-white/90 mb-4">
                  Use our deep AI analysis on candidate profiles to save up to 40% of your screening time.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/app/candidates")}
                  className="bg-white text-purple-700 hover:bg-purple-50 hover:text-purple-800 w-full sm:w-auto justify-center font-semibold shadow-sm hover:shadow transition-all"
                >
                  Try AI Analysis <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Creation Modal */}
      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateJob}
        isLoading={isCreating}
        mode="create"
      />
    </div>
  );
}
