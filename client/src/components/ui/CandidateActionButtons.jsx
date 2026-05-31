import { Eye, FileText, Mail } from "lucide-react";
import { Button } from "../Button";

export function CandidateActionButtons({ candidate, onViewProfile }) {
  const handleEmail = (e) => {
    e.stopPropagation();
    if (candidate.email) {
      window.location.href = `mailto:${candidate.email}`;
    }
  };

  const handleResume = (e) => {
    e.stopPropagation();
    if (candidate.resumeUrl) {
      window.open(candidate.resumeUrl, "_blank");
    }
  };

  const handleProfile = (e) => {
    e.stopPropagation();
    if (onViewProfile) {
      onViewProfile(candidate);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 w-full">
      {candidate.email && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleEmail}
          className="gap-2 text-sm flex-1 sm:flex-none border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 hover:text-purple-800 dark:hover:bg-purple-900/30 dark:hover:text-purple-200"
        >
          <Mail className="w-4 h-4" />
          Email
        </Button>
      )}
      
      {candidate.resumeUrl && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleResume}
          className="gap-1.5 text-sm flex-1 sm:flex-none border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          <FileText className="w-4 h-4" />
          Resume
        </Button>
      )}

      <Button
        size="sm"
        onClick={handleProfile}
        className="gap-1.5 text-sm flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
      >
        <Eye className="w-4 h-4" />
        View Profile
      </Button>
    </div>
  );
}
