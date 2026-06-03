import { baseApi } from "./baseApi";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiStatus: builder.query({
      query: () => "/ai/status",
      providesTags: ["AiStatus"],
    }),
  }),
});

export const { useGetAiStatusQuery } = aiApi;
