export const selectCurrentUser = (state) => state.auth.user;

export const selectAccessToken = (state) => state.auth.accessToken;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectUserRole = (state) => state.auth.user?.role;
