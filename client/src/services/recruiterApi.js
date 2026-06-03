// client/src/services/recruiterApi.js
import { baseApi } from "./baseApi";

export const recruiterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/recruiter/dashboard-stats",
      providesTags: ["DashboardStats"],
    }),
    getAnalytics: builder.query({
      query: (period = "month") => `/recruiter/analytics?period=${period}`,
      providesTags: ["Analytics"],
    }),
    getCandidates: builder.query({
      query: ({ jobId, page = 1, limit = 10, search = "", status = "" }) => ({
        url: `/recruiter/candidates/${jobId}`,
        params: { page, limit, search, status },
      }),
      providesTags: ["Candidates"],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ applicationId, status }) => ({
        url: `/applications/${applicationId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: [
        "DashboardStats", 
        "Candidates", 
        "Applications", 
        "JobApplications", 
        "Application", 
        "Analytics"
      ],
    }),
    recordProfileView: builder.mutation({
      query: (candidateId) => ({
        url: `/recruiter/candidate/${candidateId}/view`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAnalyticsQuery,
  useGetCandidatesQuery,
  useUpdateApplicationStatusMutation,
  useRecordProfileViewMutation,
} = recruiterApi;
