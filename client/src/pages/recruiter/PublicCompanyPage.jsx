// client/src/pages/recruiter/PublicCompanyPage.jsx
import { useParams, Link } from "react-router-dom";
import { useGetPublicCompanyProfileQuery } from "../../services/companyApi";
import { CompanyProfileView } from "../../components/CompanyProfileView";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../../components/Button";

export function PublicCompanyPage() {
  const { recruiterId } = useParams();
  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useGetPublicCompanyProfileQuery(recruiterId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading company profile...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Company Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {error?.data?.message ||
              "The company you're looking for doesn't exist or the recruiter hasn't set up their profile yet."}
          </p>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          to="/app/jobs"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
      </div>
      <CompanyProfileView
        company={profileData?.data?.company}
        recruiterName={profileData?.data?.recruiterName}
      />
    </div>
  );
}