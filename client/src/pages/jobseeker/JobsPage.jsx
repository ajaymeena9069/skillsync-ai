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
import { useGetJobsQuery } from "../../services/jobsApi";
import { useGetMyApplicationsQuery } from "../../services/applicationApi";
import { useJobMatch } from "../../hooks/useJobMatch";
import { useSelector } from "react-redux";
import { JobCard } from "../../components/JobCard";
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
import { Checkbox } from "../../components/ui/Checkbox";
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
    if (filters.experienceLevel) params.append("experienceLevel", filters.experienceLevel);
    if (filters.locationType) params.append("locationType", filters.locationType);
    if (filters.salaryMin) params.append("minSalary", filters.salaryMin);
    filters.employmentType.forEach((type) => params.append("employmentType", type));
    if (sortBy !== "match") params.append("sortBy", sortBy);
    params.append("page", currentPage);
    params.append("limit", itemsPerPage);
    return params.toString();
  };

  const { data: jobsData, isLoading, refetch } = useGetJobsQuery(buildQueryParams());
  const { data: applicationsData } = useGetMyApplicationsQuery(undefined, { skip: !isJobSeeker });

  let jobs = jobsData?.data || [];
  const pagination = jobsData?.pagination;

  const appliedJobIds = useMemo(() => {
    if (!isJobSeeker || !applicationsData?.data) return new Set();
    return new Set(
      applicationsData.data.map((app) =>
        typeof app.jobId === "object" ? app.jobId?._id : app.jobId
      )
    );
  }, [applicationsData, isJobSeeker]);

  const availableJobs = useMemo(() => {
    if (!isJobSeeker) return jobs;
    return jobs.filter((job) => !appliedJobIds.has(job._id));
  }, [jobs, appliedJobIds, isJobSeeker]);

  const processedJobs = useMemo(() => {
    if (sortBy === "match" && hasResume && availableJobs.length) {
      return sortJobsByMatch(availableJobs);
    }
    return availableJobs;
  }, [availableJobs, sortBy, hasResume, sortJobsByMatch]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value === "all" ? "" : value }));
    setCurrentPage(1);
  };

  const handleEmploymentTypeChange = (type, checked) => {
    setFilters((prev) => ({
      ...prev,
      employmentType: checked
        ? [...prev.employmentType, type]
        : prev.employmentType.filter((t) => t !== type),
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
    Object.values(filters).filter((v) => (Array.isArray(v) ? v.length > 0 : v)).length +
    (searchTerm ? 1 : 0);

  if (isLoading) return <PageLoader />;

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
            Discover personalized job opportunities tailored to your skills and career goals
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg p-5">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Search by job title, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 bg-gray-50/80 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl text-gray-900 dark:text-white"
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
              {filters.location && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                >
                  <MapPin className="w-3 h-3" />
                  <span>{filters.location}</span>
                  <button onClick={() => handleFilterChange("location", "")}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.experienceLevel && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                >
                  <Clock className="w-3 h-3" />
                  <span>{filters.experienceLevel}</span>
                  <button onClick={() => handleFilterChange("experienceLevel", "")}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.employmentType.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                >
                  <Briefcase className="w-3 h-3" />
                  <span>{type.replace("-", " ")}</span>
                  <button onClick={() => handleEmploymentTypeChange(type, false)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <button
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-purple-600 transition-colors ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Advanced Filters Panel (shadcn Select + Checkbox) */}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Location Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> Location
                  </label>
                  <Select
                    value={filters.location}
                    onValueChange={(val) => handleFilterChange("location", val)}
                  >
                    <SelectTrigger className="bg-gray-50/80 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 rounded-xl">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="San Francisco">San Francisco</SelectItem>
                      <SelectItem value="New York">New York</SelectItem>
                      <SelectItem value="Seattle">Seattle</SelectItem>
                      <SelectItem value="Austin">Austin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Level Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Experience
                  </label>
                  <Select
                    value={filters.experienceLevel}
                    onValueChange={(val) => handleFilterChange("experienceLevel", val)}
                  >
                    <SelectTrigger className="bg-gray-50/80 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 rounded-xl">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="junior">Junior (1-2 yrs)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 yrs)</SelectItem>
                      <SelectItem value="senior">Senior (5-8 yrs)</SelectItem>
                      <SelectItem value="lead">Lead (8+ yrs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Work Mode Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" /> Work Mode
                  </label>
                  <Select
                    value={filters.locationType}
                    onValueChange={(val) => handleFilterChange("locationType", val)}
                  >
                    <SelectTrigger className="bg-gray-50/80 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 rounded-xl">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Min Salary Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" /> Min Salary
                  </label>
                  <Select
                    value={filters.salaryMin}
                    onValueChange={(val) => handleFilterChange("salaryMin", val)}
                  >
                    <SelectTrigger className="bg-gray-50/80 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 rounded-xl">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                      <SelectItem value="all">Any</SelectItem>
                      <SelectItem value="80000">$80k+</SelectItem>
                      <SelectItem value="100000">$100k+</SelectItem>
                      <SelectItem value="120000">$120k+</SelectItem>
                      <SelectItem value="150000">$150k+</SelectItem>
                      <SelectItem value="200000">$200k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Employment Type Checkboxes (custom styled shadcn Checkbox) */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> Employment Type
                </label>
                <div className="flex flex-wrap gap-4">
                  {["full-time", "part-time", "contract", "internship", "freelance"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.employmentType.includes(type)}
                        onCheckedChange={(checked) =>
                          handleEmploymentTypeChange(type, checked === true)
                        }
                        className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="text-sm text-gray-600 dark:text-gray-300 capitalize cursor-pointer"
                      >
                        {type.replace("-", " ")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800/60">
                <Button
                  onClick={() => refetch()}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 shadow-sm hover:shadow-md"
                >
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  Reset All
                </Button>
              </div>
            </CardContent>
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
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[220px] bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 rounded-xl">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <SelectItem value="match">Best Match (Recommended)</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="salary-high">Highest Salary</SelectItem>
              <SelectItem value="salary-low">Lowest Salary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Match Info Banner */}
        {hasResume && sortBy === "match" && processedJobs.length > 0 && (
          <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl flex items-center gap-2 border border-purple-100 dark:border-purple-800/50">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Jobs sorted by match percentage based on your resume skills.
              <span className="text-xs ml-2 opacity-75">Higher match = better fit</span>
            </p>
          </div>
        )}

        {/* Job Cards Grid */}
        {processedJobs.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="border-purple-200 text-purple-600 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/30 hover:bg-purple-50"
              >
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5">
              {processedJobs.map((job) => (
                <JobCard key={job._id} job={job} showActions={true} />
              ))}
            </div>

            {/* Pagination (shadcn/ui Pagination) */}
            {pagination && pagination.pages > 1 && (
              <Pagination className="justify-center mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= pagination.pages - 2) pageNum = pagination.pages - 4 + i;
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
                      onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                      className={currentPage === pagination.pages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}