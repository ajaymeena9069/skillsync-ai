import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function BackButton({ 
  text = "Go Back", 
  fallbackPath,
  className = ""
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else if (fallbackPath) {
      navigate(fallbackPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
        bg-gradient-to-r from-slate-50 to-gray-100 
        dark:from-gray-800 dark:to-gray-900 
        border border-slate-200 dark:border-gray-700 
        shadow-sm hover:shadow-md 
        hover:border-slate-300 dark:hover:border-gray-600 
        transition-all duration-200 ${className}`}
    >
      <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400 
        group-hover:text-indigo-500 dark:group-hover:text-indigo-400 
        group-hover:-translate-x-1 transition-all duration-200" />
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 
        group-hover:text-indigo-600 dark:group-hover:text-indigo-400 
        transition-colors duration-200">
        {text}
      </span>
    </button>
  );
}
