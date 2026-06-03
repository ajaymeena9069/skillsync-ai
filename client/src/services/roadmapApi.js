import { baseApi } from "./baseApi";

export const roadmapApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Generate learning roadmap (on-demand, POST)
    generateRoadmap: builder.mutation({
      query: (body) => ({
        url: "/ai/roadmap",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Roadmap", "AiStatus"],
    }),
  }),
});

export const { useGenerateRoadmapMutation } = roadmapApi;
