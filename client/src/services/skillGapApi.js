import { baseApi } from "./baseApi";

export const skillGapApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get overall skill gap analysis (on-demand, not auto-fetched)
    getSkillGapAnalysis: builder.query({
      query: () => "/ai/skill-gap",
      providesTags: ["SkillGap"],
    }),

    // Get skill gap analysis for a specific job
    getSkillGapForJob: builder.mutation({
      query: (jobId) => ({
        url: "/ai/skill-gap",
        method: "POST",
        body: { jobId },
      }),
    }),
  }),
});

export const {
  useLazyGetSkillGapAnalysisQuery,
  useGetSkillGapForJobMutation,
} = skillGapApi;
