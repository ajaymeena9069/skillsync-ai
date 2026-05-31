import { baseApi } from "./baseApi";

export const commonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicStats: builder.query({
      query: () => "/common/stats",
      providesTags: ["PublicStats"],
    }),
  }),
});

export const { useGetPublicStatsQuery } = commonApi;
