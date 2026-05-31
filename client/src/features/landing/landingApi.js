import { baseApi } from "../../services/baseApi";

export const landingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicStats: builder.query({
      query: () => "/common/stats",
      providesTags: ["PublicStats"],
    }),
  }),
});

export const { useGetPublicStatsQuery } = landingApi;
