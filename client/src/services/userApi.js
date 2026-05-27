// client/src/services/userApi.js
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile (works for both candidate & recruiter)
    getProfile: builder.query({
      query: () => "/users/profile",
      providesTags: ["UserProfile"],
    }),

    // Update user profile (candidate or recruiter)
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    // Update skills only (candidate)
    updateSkills: builder.mutation({
      query: (skills) => ({
        url: "/users/skills",
        method: "PUT",
        body: { skills },
      }),
      invalidatesTags: ["UserProfile"],
    }),

    // Upload avatar (both roles)
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: "/users/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["UserProfile"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateSkillsMutation,
  useUploadAvatarMutation,
} = userApi;
