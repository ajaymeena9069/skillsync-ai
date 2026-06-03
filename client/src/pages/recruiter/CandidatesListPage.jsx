// client/src/pages/recruiter/CandidatesListPage.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  Sparkles,
  Award,
  Building2,
  CheckCircle,
  Filter,
  X,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMyJobsQuery } from "../../services/jobsApi";
import { useGetJobApplicationsQuery } from "../../services/applicationApi";
import { PageHeader } from "../../components/common/PageHeader";
import { StatsCard } from "../../components/common/StatsCard";
import { EmptyState } from "../../components/common/EmptyState";
import { CandidateCard } from "../../components/common/CandidateCard";
import { PageLoader } from "../../components/PageLoader";

// shadcn/ui components
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: jobsData, isLoading: jobsLoading } = useGetMyJobsQuery();
  const myJobs = jobsData?.data || [];

  useEffect(() => {
    if (myJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(myJobs[0]._id);
    }
  }, [myJobs, selectedJobId]);

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
    setSelectedJobId(jobId);
    setSearchTerm("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const selectedStatusLabel = statusOptions.find((opt) => opt.value === statusFilter)?.label || "Filter by status";

  if (jobsLoading || (myJobs.length > 0 && !selectedJobId)) return <PageLoader />;
  if (appsLoading && selectedJobId) return <PageLoader />;

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

        {/* Premium Filter Bar */}
        {myJobs.length > 0 && (
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
            <CardContent className="p-5 space-y-5">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Job Selector (shadcn Select) */}
                <div className="lg:w-80">
                  <Select value={selectedJobId} onValueChange={handleJobChange}>
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                      <SelectValue placeholder="Select a job...">
                        {selectedJobId ? (
                          <span className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="truncate">
                              {selectedJob?.title} ({selectedJob?.applicationsCount || 0} applicants)
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            Select a job...
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                      {myJobs.map((job) => (
                        <SelectItem key={job._id} value={job._id}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{job.title}</span>
                            <span className="text-xs text-gray-500">{job.applicationsCount || 0} applicants</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Input */}
                <div className="flex-1 relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  <Input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-purple-500/20"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Status Filter (shadcn Select) */}
                <div className="lg:w-56">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger
                      className={`w-full rounded-xl shadow-sm ${activeFilterCount > 0
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        }`}
                    >
                      <SelectValue>
                        <span className="flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4" />
                          {statusFilter !== "All" ? selectedStatusLabel : "Filter status"}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters Indicator */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
                  {searchTerm && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full"
                    >
                      <Search className="w-3 h-3" />
                      Search: "{searchTerm.slice(0, 20)}"
                      <button onClick={() => setSearchTerm("")} className="hover:text-purple-900">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {statusFilter !== "All" && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      Status: {selectedStatusLabel}
                      <button onClick={() => setStatusFilter("All")} className="hover:text-purple-900">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-xs text-red-500 hover:text-red-600 underline ml-auto"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
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

                {/* shadcn Pagination */}
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
          </>
        )}
      </div>
    </div>
  );
}