// client/src/services/jobsApi.js
import { baseApi } from "./baseApi";

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all jobs with filters
    getJobs: builder.query({
      query: (params) => ({
        url: "/jobs",
        params,
      }),
      providesTags: ["Jobs"],
    }),

    // Get single job
    getJobById: builder.query({
      query: (id) => `/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: "Job", id }],
    }),

    // Get recruiter's jobs
    getMyJobs: builder.query({
      query: () => "/jobs/recruiter/my-jobs",
      providesTags: ["MyJobs"],
    }),

    // Create job
    createJob: builder.mutation({
      query: (jobData) => ({
        url: "/jobs",
        method: "POST",
        body: jobData,
      }),
      invalidatesTags: ["Jobs", "MyJobs", "CompanyStats", "DashboardStats", "Analytics", "PublicStats"], // Invalidate UI stats to update job count
    }),

    // Update job
    updateJob: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/jobs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Jobs",
        "MyJobs",
        { type: "Job", id },
      ],
    }),

    // Delete job
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs", "MyJobs", "CompanyStats", "DashboardStats", "Analytics", "PublicStats"], // Invalidate UI stats to update job count
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useGetMyJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobsApi;
