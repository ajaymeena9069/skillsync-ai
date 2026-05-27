import { baseApi } from "./baseApi";

export const matchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get AI analysis for a candidate
    getCandidateMatchAnalysis: builder.query({
      query: (applicationId) =>
        `/matches/application/${applicationId}/analysis`,
      providesTags: (result, error, id) => [{ type: "Match", id }],
    }),

    // Get all candidates with matches for a job
    getJobCandidatesWithMatches: builder.query({
      query: (jobId) => `/matches/job/${jobId}/candidates`,
      providesTags: (result, error, jobId) => [
        { type: "JobMatches", id: jobId },
      ],
    }),

    // Get detailed match for candidate and job
    getDetailedMatch: builder.query({
      query: ({ candidateId, jobId }) =>
        `/matches/candidate/${candidateId}/job/${jobId}`,
      providesTags: (result, error, { candidateId, jobId }) => [
        { type: "DetailedMatch", id: `${candidateId}-${jobId}` },
      ],
    }),
  }),
});

export const {
  useGetCandidateMatchAnalysisQuery,
  useGetJobCandidatesWithMatchesQuery,
  useGetDetailedMatchQuery,
} = matchApi;
