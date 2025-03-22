import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectAuth, 
  selectUser, 
  selectIsAuthenticated, 
  selectIsLoading, 
  selectAuthError 
} from '../redux/slices/authSlice';
import { 
  register as registerAction, 
  login as loginAction, 
  logout as logoutAction, 
  getProfile as getProfileAction,
  loadToken as loadTokenAction
} from '../redux/actions/authActions';

export const useAuthRedux = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  
  // Memoized action dispatchers
  const register = useCallback((userData) => dispatch(registerAction(userData)), [dispatch]);
  const login = useCallback((credentials) => dispatch(loginAction(credentials)), [dispatch]);
  const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);
  const getProfile = useCallback(() => dispatch(getProfileAction()), [dispatch]);
  const loadToken = useCallback(() => dispatch(loadTokenAction()), [dispatch]);
  
  // Load token on component mount
  useEffect(() => {
    loadToken();
  }, [loadToken]);
  
  return {
    // State
    auth,
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    register,
    login,
    logout,
    getProfile,
    loadToken
  };
};