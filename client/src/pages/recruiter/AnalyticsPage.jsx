// client/src/pages/AnalyticsPage.jsx
import { useState } from "react";
import {
  TrendingUp,
  Users,
  Briefcase,
  Eye,
  Download,
  ChevronRight,
  Clock,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  LineChart,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { StatsCard } from "../../components/common/StatsCard";
import { useGetMyJobsQuery } from "../../services/jobsApi";
import { PageLoader } from "../../components/PageLoader";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart as ReLineChart,
  Line,
} from "recharts";

export function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const { data: jobsData, isLoading } = useGetMyJobsQuery();
  const jobs = jobsData?.data || [];

  // Calculate metrics
  const totalJobs = jobs.length;
  const totalApplicants = jobs.reduce(
    (sum, j) => sum + (j.applicationsCount || 0),
    0,
  );
  const totalViews = jobs.reduce((sum, j) => sum + (j.viewsCount || 0), 0);
  const activeJobs = jobs.filter((j) => j.status === "active").length;

  const avgApplicantsPerJob =
    totalJobs > 0 ? Math.round(totalApplicants / totalJobs) : 0;
  const avgViewsPerJob = totalJobs > 0 ? Math.round(totalViews / totalJobs) : 0;
  const conversionRate =
    totalViews > 0 ? Math.round((totalApplicants / totalViews) * 100) : 0;

  // Top performing jobs
  const topJobs = [...jobs]
    .sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0))
    .slice(0, 5);

  // Status distribution data for pie chart
  const statusData = [
    {
      name: "Active",
      value: jobs.filter((j) => j.status === "active").length,
      color: "#10B981",
    },
    {
      name: "Draft",
      value: jobs.filter((j) => j.status === "draft").length,
      color: "#F59E0B",
    },
    {
      name: "Closed",
      value: jobs.filter((j) => j.status === "closed").length,
      color: "#EF4444",
    },
  ].filter((item) => item.value > 0);

  // Monthly applications data (mock - replace with real data)
  const monthlyData = [
    { month: "Jan", applications: 12, views: 45 },
    { month: "Feb", applications: 19, views: 62 },
    { month: "Mar", applications: 25, views: 78 },
    { month: "Apr", applications: 32, views: 95 },
    { month: "May", applications: 28, views: 88 },
    { month: "Jun", applications: 35, views: 110 },
  ];

  // Job performance data
  const jobPerformanceData = topJobs.map((job, index) => ({
    name:
      job.title.length > 15 ? job.title.substring(0, 15) + "..." : job.title,
    applicants: job.applicationsCount || 0,
    views: job.viewsCount || 0,
    conversion: Math.round(
      ((job.applicationsCount || 0) / (job.viewsCount || 1)) * 100,
    ),
  }));

  const stats = [
    {
      label: "Total Jobs",
      value: totalJobs,
      icon: Briefcase,
      change: "+12",
      color: "from-purple-500 to-indigo-600",
    },
    {
      label: "Total Applicants",
      value: totalApplicants,
      icon: Users,
      change: "+18",
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Total Views",
      value: totalViews,
      icon: Eye,
      change: "+15",
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      change: "+5",
      color: "from-orange-500 to-amber-600",
    },
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Recruitment Insights</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Recruitment{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Analytics
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Track your hiring performance, job metrics, and recruitment insights
          </p>
        </div>

        {/* Period Selector & Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-600 to-indigo-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="flex bg-white dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
              {["week", "month", "year"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPeriod === period
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              className="gap-2 border-gray-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends Chart */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Monthly Trends
                </h3>
              </div>
              <Badge
                variant="primary"
                className="text-xs bg-white/80 dark:bg-purple-900/50"
              >
                Last 6 months
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient
                    id="applicantsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="viewsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  strokeOpacity={0.3}
                />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ color: "#1f2937" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="applications"
                  name="Applications"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fill="url(#applicantsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Views"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fill="url(#viewsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Job Status Distribution */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Job Status Distribution
                </h3>
              </div>
              <Badge
                variant="primary"
                className="text-xs bg-white/80 dark:bg-purple-900/50"
              >
                Total: {totalJobs}
              </Badge>
            </div>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <RePieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                    }}
                    itemStyle={{ color: "#1f2937" }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-gray-400 dark:text-gray-500">
                No job data available
              </div>
            )}
            <div className="flex justify-center gap-4 mt-4">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Avg. Applicants per Job
              </h3>
            </div>
            <div className="text-center mb-3">
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {avgApplicantsPerJob}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                applicants per job posting
              </p>
            </div>
            <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"
                style={{ width: `${Math.min(100, avgApplicantsPerJob * 5)}%` }}
              />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Avg. Views per Job
              </h3>
            </div>
            <div className="text-center mb-3">
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {avgViewsPerJob}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                views per job posting
              </p>
            </div>
            <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-600"
                style={{ width: `${Math.min(100, avgViewsPerJob)}%` }}
              />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Conversion Rate
              </h3>
            </div>
            <div className="text-center mb-3">
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {conversionRate}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                applicants to views ratio
              </p>
            </div>
            <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Top Performing Jobs */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50/30 to-white/30 dark:from-gray-800/30 dark:to-gray-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Top Performing Jobs
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600 dark:text-purple-400 gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="p-5">
            {topJobs.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={jobPerformanceData}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    strokeOpacity={0.3}
                  />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#9CA3AF"
                    fontSize={12}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                    }}
                    itemStyle={{ color: "#1f2937" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="applicants"
                    name="Applicants"
                    fill="#8B5CF6"
                    radius={[0, 8, 8, 0]}
                  />
                  <Bar
                    dataKey="views"
                    name="Views"
                    fill="#6366F1"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400 dark:text-gray-500">
                No job performance data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div
                key={job._id}
                className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      New application for{" "}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {job.title}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      at {job.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {job.applicationsCount || 0}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      applicants
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
