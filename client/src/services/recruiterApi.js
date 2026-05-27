// client/src/services/recruiterApi.js
import { baseApi } from "./baseApi";

export const recruiterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/recruiter/dashboard-stats",
      providesTags: ["DashboardStats"],
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
      invalidatesTags: ["DashboardStats", "Candidates"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetCandidatesQuery,
  useUpdateApplicationStatusMutation,
} = recruiterApi;
