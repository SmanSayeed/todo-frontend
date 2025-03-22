import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Start loading
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // Login/register success
    authSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      state.error = null;
    },

    // Profile loaded
    profileLoaded: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    },

    // Auth failed
    authFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    // Clear errors
    clearErrors: (state) => {
      state.error = null;
    }
  }
});

// Export actions
export const { 
  authStart, 
  authSuccess, 
  profileLoaded, 
  authFailed, 
  logout, 
  clearErrors 
} = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;