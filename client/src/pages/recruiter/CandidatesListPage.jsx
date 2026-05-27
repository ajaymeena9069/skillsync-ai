// client/src/pages/recruiter/CandidatesListPage.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Award,
  Building2,
  CheckCircle,
  Loader2,
  Filter,
} from "lucide-react";
import { Button } from "../../components/Button";
import { useGetMyJobsQuery } from "../../services/jobsApi";
import { useGetJobApplicationsQuery } from "../../services/applicationApi";
import { PageHeader } from "../../components/common/PageHeader";
import { StatsCard } from "../../components/common/StatsCard";
import { EmptyState } from "../../components/common/EmptyState";
import { CandidateCard } from "../../components/common/CandidateCard";

const statusMap = {
  pending: {
    label: "New",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  reviewed: {
    label: "Reviewed",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  shortlisted: {
    label: "Shortlisted",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  hired: {
    label: "Hired",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
};

const statuses = ["All", "New", "Reviewed", "Shortlisted", "Rejected", "Hired"];

export function CandidatesListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isChangingJob, setIsChangingJob] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

  const { data: jobsData, isLoading: jobsLoading } = useGetMyJobsQuery();
  const myJobs = jobsData?.data || [];

  useEffect(() => {
    if (myJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(myJobs[0]._id);
    }
  }, [myJobs, selectedJobId]);

  const { data: applicationsData, isLoading: appsLoading } =
    useGetJobApplicationsQuery(selectedJobId, {
      skip: !selectedJobId,
    });

  const applications = applicationsData?.data || [];
  const selectedJob = myJobs.find((job) => job._id === selectedJobId);

  const candidatesData = useMemo(() => {
    if (!applications.length) return [];
    return applications.map((app) => {
      const candidate = app.userId;
      const statusInfo = statusMap[app.status] || statusMap.pending;
      return {
        id: app._id,
        name: candidate?.name || "Unknown User",
        email: candidate?.email || "",
        avatar: candidate?.avatar,
        matchScore: app.matchScore || 0,
        skills: candidate?.skills || [],
        status: statusInfo.label,
        location: candidate?.location || "Location not specified",
        appliedFor: selectedJob?.title || "Position",
        applicationId: app._id,
        createdAt: app.createdAt,
      };
    });
  }, [applications, selectedJob]);

  const filteredCandidates = useMemo(() => {
    return candidatesData.filter((candidate) => {
      const matchesSearch =
        searchTerm === "" ||
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || candidate.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, candidatesData]);

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const activeFilterCount =
    (statusFilter !== "All" ? 1 : 0) + (searchTerm ? 1 : 0);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const stats = [
    {
      label: "Total",
      value: candidatesData.length,
      icon: Users,
      color: "from-purple-500 to-indigo-500",
      change: "",
    },
    {
      label: "New",
      value: candidatesData.filter((c) => c.status === "New").length,
      icon: Sparkles,
      color: "from-blue-500 to-cyan-500",
      change: "",
    },
    {
      label: "Shortlisted",
      value: candidatesData.filter((c) => c.status === "Shortlisted").length,
      icon: Award,
      color: "from-amber-500 to-orange-500",
      change: "",
    },
    {
      label: "Hired",
      value: candidatesData.filter((c) => c.status === "Hired").length,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      change: "",
    },
  ];

  const handleJobChange = (e) => {
    const jobTitle = e.target.value;
    setIsChangingJob(true);
    const job = myJobs.find((j) => j.title === jobTitle);
    if (job) setSelectedJobId(job._id);
    setSearchTerm("");
    setStatusFilter("All");
    setCurrentPage(1);
    setTimeout(() => setIsChangingJob(false), 100);
  };

  if (jobsLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (isChangingJob || (appsLoading && selectedJobId)) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading applications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHeader
          badge="Talent Pool"
          title="Find"
          gradientText="Top Talent"
          description="Browse and manage candidates who applied to your job postings"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* No Jobs Posted */}
        {myJobs.length === 0 && (
          <EmptyState
            icon={Briefcase}
            title="No Jobs Posted Yet"
            message="Post a job to start receiving applications"
            action={
              <Button
                onClick={() => navigate("/app/jobs-posted")}
                className="bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                Post a Job
              </Button>
            }
          />
        )}

        {/* Search & Filter Section */}
        {myJobs.length > 0 && (
          <>
            {/* Header with Job Selector */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Job Selector */}
                <div className="relative min-w-[260px]">
                  <select
                    value={selectedJob?.title || ""}
                    onChange={handleJobChange}
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    {myJobs.map((job) => (
                      <option key={job._id} value={job.title}>
                        {job.title} ({job.applicationsCount || 0} applicants)
                      </option>
                    ))}
                  </select>
                  <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Search Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    showFilters || activeFilterCount > 0
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="ml-1 w-5 h-5 bg-white text-purple-600 rounded-full text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-4 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Clear
                  </button>
                )}
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top duration-200">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          statusFilter === status
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-600 to-indigo-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {filteredCandidates.length}
                </span>{" "}
                candidates
                {selectedJob && (
                  <span className="text-gray-400">
                    {" "}
                    for <span className="font-medium">{selectedJob.title}</span>
                  </span>
                )}
              </p>
            </div>

            {/* No Applications */}
            {applications.length === 0 && (
              <EmptyState
                icon={Users}
                title="No Applications Yet"
                message={`No one has applied for ${selectedJob?.title || "this job"} yet`}
              />
            )}

            {/* Candidates List */}
            {applications.length > 0 && candidatesData.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {paginatedCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      variant="detailed"
                      showActions={true}
                      onViewProfile={() =>
                        navigate(`/app/candidates/${candidate.applicationId}`)
                      }
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center pt-4">
                    <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-1">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
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
                        },
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
