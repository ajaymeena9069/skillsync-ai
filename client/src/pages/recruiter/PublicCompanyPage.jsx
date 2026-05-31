// client/src/pages/recruiter/PublicCompanyPage.jsx
import { useParams } from "react-router-dom";
import { useGetPublicCompanyProfileQuery } from "../../services/companyApi";
import { CompanyProfileView } from "../../components/CompanyProfileView";
import { BackButton } from "../../components/common/BackButton";
import { PageLoader } from "../../components/PageLoader";

export function PublicCompanyPage() {
  const { recruiterId } = useParams();
  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useGetPublicCompanyProfileQuery(recruiterId);

  if (isLoading) {
    return <PageLoader />;
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
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <BackButton text="Back to Jobs" fallbackPath="/app/jobs" />
      </div>
      <CompanyProfileView
        company={profileData?.data?.company}
        recruiterName={profileData?.data?.recruiterName}
      />
    </div>
  );
}