import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS } from "./authConstants";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: AUTH_STATUS.UNAUTHENTICATED,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = AUTH_STATUS.AUTHENTICATED;
    },

    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = AUTH_STATUS.UNAUTHENTICATED;
    },

    updateUserProfile: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
});

export const { setCredentials, logoutUser, updateUserProfile } =
  authSlice.actions;

export default authSlice.reducer;
