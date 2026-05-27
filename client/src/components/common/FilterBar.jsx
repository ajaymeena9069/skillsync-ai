// src/components/common/FilterBar.jsx
import { useState, useEffect, useRef } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
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
  showClearButton = true,
  showSearch = true,
  variant = "default", // 'default', 'minimal', 'compact'
  className = "",
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const filterPanelRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(event.target)
      ) {
        setShowFilters(false);
      }
    };
    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  const activeFilterCount =
    (filterValue && filterValue !== "all" ? 1 : 0) + (searchValue ? 1 : 0);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      if (onSearchChange) onSearchChange("");
      if (onFilterChange) onFilterChange("all");
    }
    setShowFilters(false);
  };

  // Get selected filter label
  const selectedFilterLabel =
    filterOptions.find((opt) => opt.value === filterValue)?.label ||
    filterLabel;

  // Compact variant styles
  const isCompact = variant === "compact";
  const isMinimal = variant === "minimal";

  const inputPadding = isCompact
    ? "pl-8 pr-3 py-1.5 text-sm"
    : "pl-10 pr-4 py-2.5 text-sm";
  const iconSize = isCompact ? "w-3.5 h-3.5" : "w-4 h-4";
  const buttonPadding = isCompact ? "px-2.5 py-1.5" : "px-3 py-2.5";
  const filterButtonPadding = isCompact ? "px-3 py-1.5" : "px-4 py-2.5";

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className={`flex flex-col sm:flex-row gap-2 ${isCompact ? "sm:gap-1.5" : "sm:gap-2"}`}
      >
        {/* Search Input */}
        {showSearch && (
          <div
            className={`relative flex-1 ${isMobile ? "w-full" : "min-w-[200px]"}`}
          >
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconSize} text-gray-400 dark:text-gray-500 transition-colors`}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`
                w-full ${inputPadding} 
                bg-white dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700 
                rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 
                dark:text-white dark:placeholder-gray-500
                transition-all duration-200
                ${isMinimal ? "border-transparent bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800" : ""}
                ${searchValue ? "border-purple-300 dark:border-purple-700" : ""}
              `}
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className={iconSize} />
              </button>
            )}
          </div>
        )}

        {/* Filter Button - Desktop Dropdown */}
        {filterOptions.length > 0 && !isMobile && (
          <div className="relative" ref={filterPanelRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center gap-2 ${filterButtonPadding} rounded-xl transition-all duration-200
                ${
                  showFilters || activeFilterCount > 0
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                     text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700`
                }
                ${isCompact ? "text-xs" : "text-sm"}
              `}
            >
              <Filter className={iconSize} />
              <span className={isCompact ? "hidden sm:inline" : ""}>
                {activeFilterCount > 0 && filterValue !== "all"
                  ? selectedFilterLabel
                  : filterLabel}
              </span>
              <ChevronDown
                className={`${iconSize} transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
              />
              {activeFilterCount > 0 && (
                <span
                  className={`
                  ml-1 w-5 h-5 rounded-full text-xs flex items-center justify-center
                  ${
                    showFilters || activeFilterCount > 0
                      ? "bg-white text-purple-600"
                      : "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                  }
                `}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Dropdown Filter Panel */}
            {showFilters && (
              <div className="absolute top-full right-0 mt-2 z-50 min-w-[200px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    Filter by {filterLabel.toLowerCase()}
                  </div>
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onFilterChange(option.value);
                        setShowFilters(false);
                      }}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150
                        ${
                          filterValue === option.value
                            ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }
                      `}
                    >
                      {option.label}
                      {filterValue === option.value && (
                        <CheckIcon className="float-right mt-0.5 w-4 h-4 text-purple-600" />
                      )}
                    </button>
                  ))}
                </div>
                {activeFilterCount > 0 && (
                  <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <button
                      onClick={handleClear}
                      className="w-full text-center text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Filter Button - Mobile Modal */}
        {filterOptions.length > 0 && isMobile && (
          <>
            <button
              onClick={() => setShowFilters(true)}
              className={`
                flex items-center justify-center gap-2 ${filterButtonPadding} rounded-xl transition-all duration-200
                ${
                  activeFilterCount > 0
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                }
                ${isCompact ? "text-xs" : "text-sm"}
                ${showSearch ? "flex-1 sm:flex-none" : "w-full"}
              `}
            >
              <Filter className={iconSize} />
              <span>{filterLabel}</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 bg-white text-purple-600 rounded-full text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Mobile Modal Filter Panel */}
            {showFilters && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
                  onClick={() => setShowFilters(false)}
                />
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl z-50 animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Filter by {filterLabel}
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                          w-full text-left px-4 py-3 rounded-xl transition-all duration-150
                          ${
                            filterValue === option.value
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                              : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
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
                        className="w-full text-center text-red-600 dark:text-red-400 font-medium py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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

        {/* Clear Button */}
        {showClearButton && activeFilterCount > 0 && !showSearch && (
          <button
            onClick={handleClear}
            className={`
              flex items-center gap-1 ${buttonPadding} rounded-xl 
              text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200
              ${isCompact ? "text-xs" : "text-sm"}
            `}
          >
            <X className={iconSize} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Selected Filters Tags (for better UX) */}
      {!isMobile && activeFilterCount > 0 && !showFilters && (
        <div className="flex flex-wrap gap-2">
          {searchValue && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg">
              Search: "{searchValue.substring(0, 20)}"
              <button
                onClick={() => onSearchChange("")}
                className="hover:text-purple-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterValue && filterValue !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg">
              {selectedFilterLabel}
              <button
                onClick={() => onFilterChange("all")}
                className="hover:text-purple-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(searchValue || (filterValue && filterValue !== "all")) && (
            <button
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Helper component for checkmark
const CheckIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

FilterBar.propTypes = {
  searchPlaceholder: PropTypes.string,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  filterValue: PropTypes.string,
  onFilterChange: PropTypes.func,
  filterLabel: PropTypes.string,
  onClear: PropTypes.func,
  showClearButton: PropTypes.bool,
  showSearch: PropTypes.bool,
  variant: PropTypes.oneOf(["default", "minimal", "compact"]),
  className: PropTypes.string,
};

FilterBar.defaultProps = {
  searchPlaceholder: "Search...",
  searchValue: "",
  filterValue: "all",
  filterLabel: "Filter",
  showClearButton: true,
  showSearch: true,
  variant: "default",
  className: "",
};
