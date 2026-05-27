// client/src/components/LoadingSpinner.jsx
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2
        className={`${sizes[size]} animate-spin text-purple-600 dark:text-purple-400`}
      />
    </div>
  );
}
