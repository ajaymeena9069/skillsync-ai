// src/components/common/FilterBar.jsx
import { useState, useEffect, useRef } from "react";
import { Search, Filter, X, ChevronDown, Check } from "lucide-react";
import PropTypes from "prop-types";

export function FilterBar({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  filterOptions = [],
  filterValue = "all",
  onFilterChange,
  filterLabel = "Filter",
  onClear,
  className = "",
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const filterPanelRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile && showFilters) {
      const handleClickOutside = (event) => {
        if (filterPanelRef.current && !filterPanelRef.current.contains(event.target)) {
          setShowFilters(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobile, showFilters]);

  const activeFilterCount = (filterValue && filterValue !== "all" ? 1 : 0) + (searchValue ? 1 : 0);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      if (onSearchChange) onSearchChange("");
      if (onFilterChange) onFilterChange("all");
    }
    setShowFilters(false);
  };

  const selectedFilterLabel = filterOptions.find((opt) => opt.value === filterValue)?.label || filterLabel;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white dark:placeholder-gray-500 transition-all duration-200"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop Filter Dropdown */}
        {filterOptions.length > 0 && !isMobile && (
          <div className="relative" ref={filterPanelRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm
                ${showFilters || activeFilterCount > 0
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }
              `}
            >
              <Filter className={`w-4 h-4 transition-transform duration-200 ${showFilters ? "rotate-12" : ""}`} />
              <span>{activeFilterCount > 0 && filterValue !== "all" ? selectedFilterLabel : filterLabel}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`} />
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 bg-white text-purple-600 rounded-full text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {showFilters && (
              <div className="absolute top-full right-0 mt-2 z-50 min-w-[200px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-1.5">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                    Filter by {filterLabel.toLowerCase()}
                  </div>
                  <div className="py-1">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onFilterChange(option.value);
                          setShowFilters(false);
                        }}
                        className={`
                          w-full text-left px-4 py-2.5 text-sm transition-all duration-150
                          ${filterValue === option.value
                            ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          }
                        `}
                      >
                        <span className="flex items-center justify-between">
                          {option.label}
                          {filterValue === option.value && <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                        </span>
                      </button>
                    ))}
                  </div>
                  {activeFilterCount > 0 && (
                    <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                      <button
                        onClick={handleClear}
                        className="w-full text-center text-sm text-red-600 dark:text-red-400 font-medium py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Filter Modal */}
        {filterOptions.length > 0 && isMobile && (
          <>
            <button
              onClick={() => setShowFilters(true)}
              className={`
                flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm
                ${activeFilterCount > 0
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                }
                flex-1 sm:flex-none
              `}
            >
              <Filter className="w-4 h-4" />
              <span>{filterLabel}</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 bg-white text-purple-600 rounded-full text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {showFilters && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
                  onClick={() => setShowFilters(false)}
                />
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl z-50 animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto shadow-2xl">
                  <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Filter by {filterLabel}
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onFilterChange(option.value);
                          setShowFilters(false);
                        }}
                        className={`
                          w-full text-left px-4 py-3 rounded-xl transition-all duration-150 text-sm
                          ${filterValue === option.value
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                            : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {activeFilterCount > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleClear}
                        className="w-full text-center text-red-600 dark:text-red-400 font-medium py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Active Filters Tags (desktop only, optional) */}
      {!isMobile && activeFilterCount > 0 && !showFilters && (
        <div className="flex flex-wrap gap-2">
          {searchValue && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
              Search: "{searchValue.slice(0, 20)}"
              <button onClick={() => onSearchChange("")} className="hover:text-purple-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterValue && filterValue !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
              {selectedFilterLabel}
              <button onClick={() => onFilterChange("all")} className="hover:text-purple-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button onClick={handleClear} className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

FilterBar.propTypes = {
  searchPlaceholder: PropTypes.string,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  filterValue: PropTypes.string,
  onFilterChange: PropTypes.func,
  filterLabel: PropTypes.string,
  onClear: PropTypes.func,
  className: PropTypes.string,
};

FilterBar.defaultProps = {
  searchPlaceholder: "Search...",
  searchValue: "",
  filterValue: "all",
  filterLabel: "Filter",
  className: "",
};