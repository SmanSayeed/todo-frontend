import { 
  authStart, 
  authSuccess, 
  authFailed, 
  logout as logoutAction,
  profileLoaded
} from '../slices/authSlice';
import { authService } from '../../api/authService';
import { getAuthToken, saveAuthToken, removeAuthToken } from '../../utils/auth';

// Register a new user
export const register = (userData) => async (dispatch) => {
  dispatch(authStart());
  
  try {
    const response = await authService.register(userData);
    
    // Save token to localStorage
    saveAuthToken(response.data.access_token);
    
    dispatch(authSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(authFailed({
      message: error.message,
      errors: error.errors
    }));
    
    throw error;
  }
};

// Login user
export const login = (credentials) => async (dispatch) => {
  dispatch(authStart());
  
  try {
    const response = await authService.login(credentials);
    
    // Save token to localStorage
    saveAuthToken(response.data.access_token);
    
    dispatch(authSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(authFailed({
      message: error.message,
      errors: error.errors
    }));
    
    throw error;
  }
};

// Get user profile
export const getProfile = () => async (dispatch) => {
  dispatch(authStart());
  
  try {
    const response = await authService.getProfile();
    
    dispatch(profileLoaded(response.data));
    return response.data;
  } catch (error) {
    // If unauthorized, clear auth state (should be handled by axios interceptor)
    
    dispatch(authFailed({
      message: error.message
    }));
    
    throw error;
  }
};

// Logout user
export const logout = () => async (dispatch) => {
  try {
    // Call logout API if needed
    await authService.logout();
    
    // Remove token from localStorage
    removeAuthToken();
    
    // Dispatch logout action to clear the Redux store
    dispatch(logoutAction());
    
    return true;
  } catch (error) {
    console.error('Logout API error:', error);
    
    // Even if API fails, we should still clear local state
    removeAuthToken();
    dispatch(logoutAction());
    
    // Re-throw for component to handle
    throw error;
  }
};

// Load token from localStorage
export const loadToken = () => (dispatch, getState) => {
  const token = getAuthToken();
  
  if (token) {
    // If user data is not in state, get profile
    const { user, isAuthenticated } = getState().auth;
    
    if (!user && !isAuthenticated) {
      // Dispatch authSuccess with just the token to set isAuthenticated
      dispatch(authSuccess({ user: null, access_token: token }));
      
      // Then fetch the user profile
      dispatch(getProfile()).catch(() => {
        // If getting profile fails, logout
        dispatch(logout());
      });
    }
  }
};