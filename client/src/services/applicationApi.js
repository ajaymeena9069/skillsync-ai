import { baseApi } from "./baseApi";

export const applicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ NEW: Get single application by ID
    getApplicationById: builder.query({
      query: (applicationId) => `/applications/${applicationId}`,
      providesTags: (result, error, id) => [{ type: "Application", id }],
    }),

    // Apply for a job
    applyForJob: builder.mutation({
      query: (data) => ({
        url: "/applications/apply",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        "Applications", 
        "Jobs", 
        "DashboardStats", 
        "Analytics", 
        "PublicStats", 
        "CompanyStats",
        { type: "ApplicationStatus", id: arg.jobId }
      ],
    }),

    // Get my applications (job seeker)
    getMyApplications: builder.query({
      query: () => "/applications/my-applications",
      providesTags: ["Applications"],
    }),

    // Get applications for a specific job (recruiter)
    getJobApplications: builder.query({
      query: (jobId) => `/applications/job/${jobId}`,
      providesTags: (result, error, jobId) => [
        { type: "JobApplications", id: jobId },
      ],
    }),

    // Update application status (recruiter)
    updateApplicationStatus: builder.mutation({
      query: ({ applicationId, status, notes }) => ({
        url: `/applications/${applicationId}/status`,
        method: "PUT",
        body: { status, notes },
      }),
      invalidatesTags: [
        "Applications", 
        "JobApplications", 
        "Application", 
        "DashboardStats", 
        "Candidates", 
        "Analytics"
      ],
    }),

    // Withdraw application (job seeker)
    withdrawApplication: builder.mutation({
      query: (applicationId) => ({
        url: `/applications/${applicationId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "Applications", 
        "Jobs", 
        "DashboardStats", 
        "Analytics", 
        "PublicStats", 
        "CompanyStats",
        "ApplicationStatus"
      ],
    }),

    // Check if current user has applied to a specific job
    checkApplicationStatus: builder.query({
      query: (jobId) => `/applications/check/${jobId}`,
      providesTags: (result, error, jobId) => [
        { type: "ApplicationStatus", id: jobId },
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetApplicationByIdQuery, // ✅ NEW export
  useApplyForJobMutation,
  useGetMyApplicationsQuery,
  useGetJobApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useWithdrawApplicationMutation,
  useCheckApplicationStatusQuery,
} = applicationApi;
