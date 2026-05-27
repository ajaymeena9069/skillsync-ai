// src/components/common/EmptyState.jsx
import PropTypes from "prop-types";
import { Users } from "lucide-react";

export function EmptyState({
  icon: Icon = Users,
  title = "No data found",
  message = "No items match your current filters",
  action,
  className = "",
}) {
  return (
    <div
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-12 text-center ${className}`}
    >
      <Icon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      <p className="text-gray-900 dark:text-white font-medium mb-1">{title}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
};
