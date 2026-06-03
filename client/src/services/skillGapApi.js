import { baseApi } from "./baseApi";

export const skillGapApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get overall skill gap analysis (on-demand, not auto-fetched)
    getSkillGapAnalysis: builder.mutation({
      query: () => ({
        url: "/ai/skill-gap",
        method: "GET",
      }),
      invalidatesTags: ["SkillGap", "AiStatus"],
    }),

    // Get skill gap analysis for a specific job
    getSkillGapForJob: builder.mutation({
      query: (jobId) => ({
        url: "/ai/skill-gap",
        method: "POST",
        body: { jobId },
      }),
      invalidatesTags: ["AiStatus"],
    }),
  }),
});

export const {
  useGetSkillGapAnalysisMutation,
  useGetSkillGapForJobMutation,
} = skillGapApi;
