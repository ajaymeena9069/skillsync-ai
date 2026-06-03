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
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/Pagination";
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
import { ConfirmationModal } from "../../components/common/ConfirmationModal";

export function PostedJobsPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: jobsData, isLoading, refetch } = useGetMyJobsQuery();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();
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

  const handleDeleteConfirm = async () => {
    if (jobToDelete) {
      await deleteJob(jobToDelete._id);
      refetch();
      setJobToDelete(null);
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

  if (isLoading) return <PageLoader />;

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
        <div className="text-center mb-8">
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

        {/* Search & Filter Bar (matching JobsPage) */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 bg-gray-50/80 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 relative border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center shadow-md">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800/60">
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                >
                  <Search className="w-3 h-3" />
                  <span>{searchTerm}</span>
                  <button onClick={() => setSearchTerm("")} className="hover:text-purple-900">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                >
                  <Filter className="w-3 h-3" />
                  <span className="capitalize">{statusFilter}</span>
                  <button onClick={() => setStatusFilter("all")}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-purple-600 transition-colors ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filter Panel (same as JobsPage – uses status pills) */}
        {showFilters && (
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-purple-500" />
                  Refine Your Search
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "active", "draft", "closed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${statusFilter === status
                        ? "bg-purple-600 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                    >
                      {status === "all" ? "All" : status}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs Grid */}
        {paginatedJobs.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by posting your first job</p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post a Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paginatedJobs.map((job, index) => (
                <div
                  key={job._id}
                  className="group bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center shadow-inner">
                        <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-purple-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{job.company}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(job.status)} className="capitalize">
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
                        <Clock className="w-3.5 h-3.5" /> {formatEmploymentType(job.employmentType)}
                      </span>
                      {job.salaryMin && job.salaryMax && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills?.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills?.length > 4 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                          +{job.requiredSkills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4" /> {job.applicationsCount || 0} applicants
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
                        onClick={() => setJobToDelete(job)}
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

            {/* Pagination (shadcn/ui) */}
            {totalPages > 1 && (
              <Pagination className="justify-center mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
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

      <ConfirmationModal
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Posting"
        message={`Are you sure you want to delete "${jobToDelete?.title}"? This action cannot be undone.`}
        status="rejected"
        isLoading={isDeleting}
      />
    </div>
  );
}