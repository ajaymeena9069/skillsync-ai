// client/src/pages/JobsPage.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Briefcase,
  Filter,
  X,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useGetJobsQuery } from "../../services/jobsApi";
import { useGetMyApplicationsQuery } from "../../services/applicationApi";
import { useJobMatch } from "../../hooks/useJobMatch";
import { useSelector } from "react-redux";
import { JobCard } from "../../components/JobCard";
import { PageLoader } from "../../components/PageLoader";

export function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("match");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [filters, setFilters] = useState({
    location: "",
    experienceLevel: "",
    employmentType: [],
    locationType: "",
    salaryMin: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const { user } = useSelector((state) => state.auth);
  const { sortJobsByMatch, hasResume, isJobSeeker } = useJobMatch();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);
    if (filters.location) params.append("location", filters.location);
    if (filters.experienceLevel)
      params.append("experienceLevel", filters.experienceLevel);
    if (filters.locationType)
      params.append("locationType", filters.locationType);
    if (filters.salaryMin) params.append("minSalary", filters.salaryMin);
    filters.employmentType.forEach((type) =>
      params.append("employmentType", type),
    );
    if (sortBy !== "match") {
      params.append("sortBy", sortBy);
    }
    params.append("page", currentPage);
    params.append("limit", itemsPerPage);
    return params.toString();
  };

  const {
    data: jobsData,
    isLoading,
    refetch,
  } = useGetJobsQuery(buildQueryParams());

  // Fetch user's applications to hide already-applied jobs
  const { data: applicationsData } = useGetMyApplicationsQuery(undefined, {
    skip: !isJobSeeker,
  });

  let jobs = jobsData?.data || [];
  const pagination = jobsData?.pagination;

  // Get applied job IDs
  const appliedJobIds = useMemo(() => {
    if (!isJobSeeker || !applicationsData?.data) return new Set();
    return new Set(
      applicationsData.data.map((app) => {
        const jobId =
          typeof app.jobId === "object" ? app.jobId?._id : app.jobId;
        return jobId;
      }),
    );
  }, [applicationsData, isJobSeeker]);

  // Filter out applied jobs
  const availableJobs = useMemo(() => {
    if (!isJobSeeker) return jobs;
    const filtered = jobs.filter((job) => !appliedJobIds.has(job._id));
    return filtered;
  }, [jobs, appliedJobIds, isJobSeeker]);

  // Apply match sorting
  const processedJobs = useMemo(() => {
    if (sortBy === "match" && hasResume && availableJobs.length) {
      return sortJobsByMatch(availableJobs);
    }
    return availableJobs;
  }, [availableJobs, sortBy, hasResume, sortJobsByMatch]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleEmploymentTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      employmentType: prev.employmentType.includes(type)
        ? prev.employmentType.filter((t) => t !== type)
        : [...prev.employmentType, type],
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      experienceLevel: "",
      employmentType: [],
      locationType: "",
      salaryMin: "",
    });
    setSearchTerm("");
    setSortBy("match");
    setCurrentPage(1);
  };

  const activeFilterCount =
    Object.values(filters).filter((v) => (Array.isArray(v) ? v.length > 0 : v))
      .length + (searchTerm ? 1 : 0);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Matches</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
            Find Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Dream Job
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto dark:text-gray-400">
            Discover personalized job opportunities tailored to your skills and
            career goals
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 shadow-sm p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by job title, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => refetch()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8 shadow-md hover:shadow-lg transition-all"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
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
            </div>
          </div>

          {/* Active Filters Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800/60">
              {searchTerm && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                  <span>🔍 {searchTerm}</span>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-purple-900 dark:hover:text-purple-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {filters.location && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                  <span>📍 {filters.location}</span>
                  <button onClick={() => handleFilterChange("location", "")}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {filters.experienceLevel && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                  <span>💼 {filters.experienceLevel}</span>
                  <button
                    onClick={() => handleFilterChange("experienceLevel", "")}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {filters.employmentType.map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                >
                  <span>📋 {type.replace("-", " ")}</span>
                  <button onClick={() => handleEmploymentTypeChange(type)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={resetFilters}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="p-6 shadow-lg rounded-2xl animate-in fade-in slide-in-from-top duration-300 bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-800/60">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Refine Your Search
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  📍 Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-gray-900 dark:text-white"
                >
                  <option value="">All Locations</option>
                  <option value="Remote">Remote</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="New York">New York</option>
                  <option value="Seattle">Seattle</option>
                  <option value="Austin">Austin</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  📊 Experience
                </label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) =>
                    handleFilterChange("experienceLevel", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-gray-900 dark:text-white"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior (1-2 yrs)</option>
                  <option value="mid">Mid Level (3-5 yrs)</option>
                  <option value="senior">Senior (5-8 yrs)</option>
                  <option value="lead">Lead (8+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  🏢 Work Mode
                </label>
                <select
                  value={filters.locationType}
                  onChange={(e) =>
                    handleFilterChange("locationType", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-gray-900 dark:text-white"
                >
                  <option value="">All</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  💰 Min Salary
                </label>
                <select
                  value={filters.salaryMin}
                  onChange={(e) =>
                    handleFilterChange("salaryMin", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-gray-900 dark:text-white"
                >
                  <option value="">Any</option>
                  <option value="80000">$80k+</option>
                  <option value="100000">$100k+</option>
                  <option value="120000">$120k+</option>
                  <option value="150000">$150k+</option>
                  <option value="200000">$200k+</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                📋 Employment Type
              </label>
              <div className="flex flex-wrap gap-4">
                {[
                  "full-time",
                  "part-time",
                  "contract",
                  "internship",
                  "freelance",
                ].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.employmentType.includes(type)}
                      onChange={() => handleEmploymentTypeChange(type)}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white capitalize">
                      {type.replace("-", " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800/60">
              <Button
                onClick={() => refetch()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8"
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Reset All
              </Button>
            </div>
          </Card>
        )}

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-white">
                {processedJobs.length}
              </span>{" "}
              opportunities found
            </p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer text-gray-900 dark:text-white"
          >
            <option value="match">🎯 Best Match (Recommended)</option>
            <option value="newest">✨ Newest First</option>
            <option value="oldest">📅 Oldest First</option>
            <option value="salary-high">💰 Highest Salary</option>
            <option value="salary-low">💵 Lowest Salary</option>
          </select>
        </div>

        {/* Match Info Banner */}
        {hasResume && sortBy === "match" && processedJobs.length > 0 && (
          <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl flex items-center gap-2 border border-purple-100 dark:border-purple-800/50">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Jobs sorted by match percentage based on your resume skills.
              <span className="text-xs ml-2 opacity-75">
                Higher match = better fit
              </span>
            </p>
          </div>
        )}

        {/* Job Cards Grid */}
        {processedJobs.length === 0 ? (
          <div className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="border-purple-200 text-purple-600 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/30 hover:bg-purple-50"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5">
              {processedJobs.map((job) => (
                <JobCard key={job._id} job={job} showActions={true} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800/80 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 p-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(pagination.pages, p + 1))
                    }
                    disabled={currentPage === pagination.pages}
                    className="p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
