// client/src/pages/RecruiterDashboard.jsx (Simplified version)
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
} from "lucide-react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { JobFormModal } from "../../components/JobFormModal";
import {
  useCreateJobMutation,
  useGetMyJobsQuery,
} from "../../services/jobsApi";
import { useGetDashboardStatsQuery } from "../../services/recruiterApi";
import { PageHeader } from "../../components/common/PageHeader";
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

  const stats = [
    {
      label: "Active Jobs",
      value: statsData?.data?.stats?.activeJobs || 0,
      icon: Briefcase,
      change:
        (statsData?.data?.stats?.activeJobs || 0) > 0
          ? `+${statsData?.data?.stats?.activeJobs}`
          : "",
      color: "from-purple-500 to-indigo-600",
    },
    {
      label: "Total Applicants",
      value: statsData?.data?.stats?.totalApplicants || 0,
      icon: Users,
      change:
        (statsData?.data?.stats?.totalApplicants || 0) > 0
          ? `+${statsData?.data?.stats?.totalApplicants}`
          : "",
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Shortlisted",
      value: statsData?.data?.stats?.shortlisted || 0,
      icon: Star,
      change:
        (statsData?.data?.stats?.shortlisted || 0) > 0
          ? `+${statsData?.data?.stats?.shortlisted}`
          : "",
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Hired",
      value: statsData?.data?.stats?.hired || 0,
      icon: Award,
      change:
        (statsData?.data?.stats?.hired || 0) > 0
          ? `+${statsData?.data?.stats?.hired}`
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
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHeader
          badge={`Welcome back, ${user?.name?.split(" ")[0] || "Recruiter"}`}
          title="Find"
          gradientText="Top Talent"
          description="Manage candidates, track hiring, and find the perfect match for your team"
        />

        {/* Profile Progress Component */}
        <ProfileProgress user={user} />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex justify-end">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Chart */}
        {statsData?.data?.chartData?.length > 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Applications Trend
                </h3>
              </div>
              <Badge
                variant="primary"
                className="text-xs bg-white/80 dark:bg-purple-900/50"
              >
                Last 6 months
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={statsData.data.chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  strokeOpacity={0.3}
                />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip />
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
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Candidates */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Top Matched Candidates
                </h2>
              </div>
              <FilterBar
                searchPlaceholder="Search candidates..."
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                filterOptions={filterOptions}
                filterValue={statusFilter}
                onFilterChange={setStatusFilter}
                filterLabel="Status"
                onClear={clearFilters}
              />
            </div>

            <div className="space-y-4">
              {topCandidates.length === 0 ? (
                <EmptyState
                  title="No candidates found"
                  message="No applications received yet. Share your job postings to attract candidates."
                />
              ) : (
                <>
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
                        className="gap-2"
                      >
                        View All {filteredCandidates.length} Candidates
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Active Jobs Table */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Active Job Postings
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/app/jobs-posted")}
                  >
                    View All
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">
                        Job Title
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">
                        Applicants
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {myJobsData?.data?.slice(0, 3).map((job) => (
                      <tr
                        key={job._id}
                        className="border-b border-gray-50 dark:border-gray-800/50"
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
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity - Simplified */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-3">
                {statsData?.data?.recentActivity
                  ?.slice(0, 4)
                  .map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-purple-500" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {activity.candidate} • {activity.jobTitle}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Boost Card */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold">Boost Your Reach</h3>
              </div>
              <p className="text-sm text-white/90 mb-4">
                Promote your job postings to reach 3x more qualified candidates
              </p>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

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
