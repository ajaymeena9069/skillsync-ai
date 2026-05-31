import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get profile
    getProfile: builder.query({
      query: () => "/jobseeker/profile",
      providesTags: ["User"],
    }),

    // Update profile
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/jobseeker/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Upload avatar
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: "/jobseeker/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    // Upload resume
    uploadResume: builder.mutation({
      query: (formData) => ({
        url: "/jobseeker/resume",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    // Get my applications
    getMyApplications: builder.query({
      query: () => "/jobseeker/applications",
      providesTags: ["Applications"],
    }),

    // Get application stats
    getApplicationStats: builder.query({
      query: () => "/jobseeker/applications/stats",
      providesTags: ["Applications"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUploadResumeMutation,
  useGetMyApplicationsQuery,
  useGetApplicationStatsQuery,
} = userApi;
