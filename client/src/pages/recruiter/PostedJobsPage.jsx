// client/src/pages/PostedJobsPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { StatsCard } from "../../components/common/StatsCard";
import {
  useGetMyJobsQuery,
  useDeleteJobMutation,
  useUpdateJobMutation,
  useCreateJobMutation,
} from "../../services/jobsApi";
import { JobFormModal } from "../../components/JobFormModal";
import { formatSalary, formatEmploymentType } from "../../utils/helpers";
import { PageLoader } from "../../components/PageLoader";

export function PostedJobsPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: jobsData, isLoading, refetch } = useGetMyJobsQuery();
  const [deleteJob] = useDeleteJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();

  const jobs = jobsData?.data || [];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) + (searchTerm ? 1 : 0);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      await deleteJob(id);
      refetch();
    }
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleUpdateJob = async (data) => {
    try {
      await updateJob({ id: selectedJob._id, ...data }).unwrap();
      setIsEditModalOpen(false);
      setSelectedJob(null);
      refetch();
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "closed":
        return "danger";
      case "draft":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "closed":
        return "Closed";
      case "draft":
        return "Draft";
      default:
        return status;
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const totalApplicants = jobs.reduce(
    (sum, j) => sum + (j.applicationsCount || 0),
    0,
  );
  const totalViews = jobs.reduce((sum, j) => sum + (j.viewsCount || 0), 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Job Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Job Postings
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Manage, track, and optimize all your job listings in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <StatsCard
            label="Total Jobs"
            value={totalJobs}
            icon={Briefcase}
            change=""
            color="from-purple-500 to-indigo-600"
          />
          <StatsCard
            label="Total Applicants"
            value={totalApplicants}
            icon={Users}
            change=""
            color="from-emerald-500 to-teal-600"
          />
          <StatsCard
            label="Total Views"
            value={totalViews}
            icon={Eye}
            change=""
            color="from-blue-500 to-cyan-600"
          />
          <StatsCard
            label="Active Jobs"
            value={activeJobs}
            icon={Clock}
            change=""
            color="from-amber-500 to-orange-600"
          />
        </div>

        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-600 to-indigo-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {filteredJobs.length}
              </span>{" "}
              of {totalJobs} jobs
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-900 transition-all dark:text-white"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  showFilters || activeFilterCount > 0
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 w-5 h-5 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-full text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top duration-200">
              <div className="flex flex-wrap gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Jobs Grid */}
        {paginatedJobs.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by posting your first job
            </p>
            <Button onClick={() => setIsModalOpen(true)}>Post a Job</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {paginatedJobs.map((job, index) => (
              <div
                key={job._id}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-purple-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {job.company}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={getStatusColor(job.status)}
                    className="capitalize"
                  >
                    {getStatusText(job.status)}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />{" "}
                      {formatEmploymentType(job.employmentType)}
                    </span>
                    {job.salaryMin && job.salaryMax && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {formatSalary(
                          job.salaryMin,
                          job.salaryMax,
                          job.salaryCurrency,
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills?.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills?.length > 4 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                        +{job.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" /> {job.applicationsCount || 0}{" "}
                      applicants
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Eye className="w-4 h-4" /> {job.viewsCount || 0} views
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/app/jobs/${job._id}`)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      title="Edit Job"
                    >
                      <Edit className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-4">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2)
                  pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          await createJob(data).unwrap();
          setIsModalOpen(false);
          refetch();
        }}
        isLoading={isCreating}
        mode="create"
      />

      <JobFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedJob(null);
        }}
        onSubmit={handleUpdateJob}
        isLoading={isUpdating}
        mode="edit"
        initialData={selectedJob}
      />
    </div>
  );
}
