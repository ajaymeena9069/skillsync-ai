import { baseApi } from "./baseApi";

export const matchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get AI analysis for a candidate
    getCandidateMatchAnalysis: builder.query({
      query: (arg) => {
        const id = typeof arg === 'object' ? arg.applicationId : arg;
        const force = typeof arg === 'object' ? arg.force : false;
        return {
          url: `/matches/application/${id}/analysis${force ? '?force=true' : ''}`
        };
      },
      providesTags: (result, error, arg) => [
        { type: "Match", id: typeof arg === 'object' ? arg.applicationId : arg }
      ],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // If this is a forced regeneration, update the cache for the normal (non-forced) query
        // so that subsequent normal visits show the fresh data
        if (typeof arg === 'object' && arg.force) {
          try {
            const { data } = await queryFulfilled;
            dispatch(
              matchApi.util.updateQueryData(
                'getCandidateMatchAnalysis',
                { applicationId: arg.applicationId },
                (draft) => {
                  Object.assign(draft, data);
                }
              )
            );
          } catch (err) {
            // Ignore errors here, they are handled by the component
          }
        }
      }
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
