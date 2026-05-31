// client/src/pages/recruiter/CandidatesListPage.jsx
import { useState, useMemo, useEffect, useRef } from "react";
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
  ChevronDown,
  X,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/Button";
import { useGetMyJobsQuery } from "../../services/jobsApi";
import { useGetJobApplicationsQuery } from "../../services/applicationApi";
import { PageHeader } from "../../components/common/PageHeader";
import { StatsCard } from "../../components/common/StatsCard";
import { EmptyState } from "../../components/common/EmptyState";
import { CandidateCard } from "../../components/common/CandidateCard";
import { PageLoader } from "../../components/PageLoader";

const statusMap = {
  pending: { label: "New", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  reviewed: { label: "Reviewed", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  shortlisted: { label: "Shortlisted", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  hired: { label: "Hired", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

const statusOptions = [
  { value: "All", label: "All Statuses" },
  { value: "New", label: "New" },
  { value: "Reviewed", label: "Reviewed" },
  { value: "Shortlisted", label: "Shortlisted" },
  { value: "Rejected", label: "Rejected" },
  { value: "Hired", label: "Hired" },
];

export function CandidatesListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isChangingJob, setIsChangingJob] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const statusDropdownRef = useRef(null);
  const jobDropdownRef = useRef(null);
  const itemsPerPage = 10;

  const { data: jobsData, isLoading: jobsLoading } = useGetMyJobsQuery();
  const myJobs = jobsData?.data || [];

  useEffect(() => {
    if (myJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(myJobs[0]._id);
    }
  }, [myJobs, selectedJobId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
      if (jobDropdownRef.current && !jobDropdownRef.current.contains(event.target)) {
        setIsJobDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: applicationsData, isLoading: appsLoading } = useGetJobApplicationsQuery(selectedJobId, {
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
      const matchesStatus = statusFilter === "All" || candidate.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, candidatesData]);

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeFilterCount = (statusFilter !== "All" ? 1 : 0) + (searchTerm ? 1 : 0);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const stats = [
    { label: "Total", value: candidatesData.length, icon: Users, color: "from-purple-500 to-indigo-500", change: "" },
    { label: "New", value: candidatesData.filter((c) => c.status === "New").length, icon: Sparkles, color: "from-blue-500 to-cyan-500", change: "" },
    { label: "Shortlisted", value: candidatesData.filter((c) => c.status === "Shortlisted").length, icon: Award, color: "from-amber-500 to-orange-500", change: "" },
    { label: "Hired", value: candidatesData.filter((c) => c.status === "Hired").length, icon: CheckCircle, color: "from-emerald-500 to-teal-500", change: "" },
  ];

  const handleJobChange = (jobId) => {
    setIsChangingJob(true);
    setSelectedJobId(jobId);
    setSearchTerm("");
    setStatusFilter("All");
    setCurrentPage(1);
    setIsJobDropdownOpen(false);
    setTimeout(() => setIsChangingJob(false), 100);
  };

  const selectedStatusLabel = statusOptions.find((opt) => opt.value === statusFilter)?.label || "Filter by status";

  if (jobsLoading || (myJobs.length > 0 && !selectedJobId)) return <PageLoader />;
  if (isChangingJob || (appsLoading && selectedJobId)) return <PageLoader />;

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

        {/* No Jobs State */}
        {myJobs.length === 0 && (
          <EmptyState
            icon={Briefcase}
            title="No Jobs Posted Yet"
            message="Post a job to start receiving applications"
            action={
              <Button onClick={() => navigate("/app/jobs-posted")} className="bg-gradient-to-r from-purple-600 to-indigo-600">
                Post a Job
              </Button>
            }
          />
        )}

        {/* ========== MODERN FILTER BAR ========== */}
        {myJobs.length > 0 && (
          <div className="relative z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl p-5 transition-all duration-300">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Job Selector - Custom Styled Dropdown */}
              <div className="relative lg:w-80" ref={jobDropdownRef}>
                <button
                  onClick={() => setIsJobDropdownOpen(!isJobDropdownOpen)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Building2 className={`w-4 h-4 shrink-0 ${selectedJobId ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`} />
                    <span className="truncate">
                      {selectedJobId 
                        ? `${selectedJob?.title} (${selectedJob?.applicationsCount || 0})` 
                        : "Select a job..."
                      }
                    </span>
                  </span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${selectedJobId ? "text-purple-600 dark:text-purple-400" : "text-gray-400"} ${isJobDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isJobDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-full min-w-[280px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                    >
                      <div className="py-2 max-h-80 overflow-y-auto">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                          Select Job Post
                        </div>
                        <div className="py-1">
                          {myJobs.map((job) => (
                            <button
                              key={job._id}
                              onClick={() => handleJobChange(job._id)}
                              className={`
                                w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex items-center justify-between
                                ${selectedJobId === job._id
                                  ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                }
                              `}
                            >
                              <div className="truncate pr-4">
                                <div className="truncate">{job.title}</div>
                                <div className={`text-xs mt-0.5 ${selectedJobId === job._id ? "text-purple-500/80 dark:text-purple-400/80" : "text-gray-400 dark:text-gray-500"}`}>
                                  {job.applicationsCount || 0} applicants
                                </div>
                              </div>
                              {selectedJobId === job._id && (
                                <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Input */}
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filter Dropdown - Premium Design */}
              <div className="relative lg:w-56" ref={statusDropdownRef}>
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className={`
                    w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${activeFilterCount > 0
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    {statusFilter !== "All" ? selectedStatusLabel : "Filter status"}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isStatusDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                    >
                      <div className="py-2">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                          Application Status
                        </div>
                        <div className="py-1">
                          {statusOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setStatusFilter(option.value);
                                setIsStatusDropdownOpen(false);
                                setCurrentPage(1);
                              }}
                              className={`
                                w-full text-left px-4 py-2.5 text-sm transition-colors duration-150
                                ${statusFilter === option.value
                                  ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                }
                              `}
                            >
                              {option.label}
                              {statusFilter === option.value && (
                                <span className="float-right">
                                  <CheckCircle className="w-4 h-4 text-purple-600" />
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      {activeFilterCount > 0 && (
                        <div className="border-t border-gray-100 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800/50">
                          <button
                            onClick={() => {
                              clearFilters();
                              setIsStatusDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400 font-medium py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <X className="w-4 h-4" /> Clear all filters
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Active filters indicator (compact) */}
            {activeFilterCount > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                    Search: "{searchTerm.slice(0, 20)}"
                    <button onClick={() => setSearchTerm("")} className="hover:text-purple-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {statusFilter !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                    Status: {selectedStatusLabel}
                    <button onClick={() => setStatusFilter("All")} className="hover:text-purple-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 underline ml-auto">
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results & Candidates */}
        {myJobs.length > 0 && (
          <>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-600 to-indigo-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredCandidates.length}</span> candidates
                  {selectedJob && (
                    <span className="text-gray-400"> for <span className="font-medium">{selectedJob.title}</span></span>
                  )}
                </p>
              </div>
            </div>

            {applications.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No Applications Yet"
                message={`No one has applied for ${selectedJob?.title || "this job"} yet`}
              />
            ) : filteredCandidates.length === 0 ? (
              <EmptyState
                icon={Filter}
                title="No matching candidates"
                message="Try adjusting your search or filter criteria"
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {paginatedCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      variant="detailed"
                      showActions={true}
                      onViewProfile={() => navigate(`/app/candidates/${candidate.applicationId}`)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center pt-4">
                    <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-1 shadow-sm">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) pageNum = i + 1;
                        else if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === pageNum
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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