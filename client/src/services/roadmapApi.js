import { baseApi } from "./baseApi";

export const roadmapApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Generate learning roadmap (on-demand, POST)
    generateRoadmap: builder.mutation({
      query: (options = {}) => ({
        url: "/ai/roadmap",
        method: "POST",
        body: options,
      }),
      invalidatesTags: ["Roadmap"],
    }),
  }),
});

export const { useGenerateRoadmapMutation } = roadmapApi;
