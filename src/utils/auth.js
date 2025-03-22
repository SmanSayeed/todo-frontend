// Default to 'token' if config is not yet available
const DEFAULT_TOKEN_KEY = 'token';

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  try {
    // Try to use the configured key first, fallback to default
    const tokenKey = window.config?.AUTH_TOKEN_KEY || DEFAULT_TOKEN_KEY;
    return localStorage.getItem(tokenKey);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Save the authentication token to localStorage
 * @param {string} token - The authentication token
 */
export const saveAuthToken = (token) => {
  try {
    const tokenKey = window.config?.AUTH_TOKEN_KEY || DEFAULT_TOKEN_KEY;
    localStorage.setItem(tokenKey, token);
  } catch (error) {
    console.error('Error saving auth token:', error);
  }
};

/**
 * Remove the authentication token from localStorage
 */
export const removeAuthToken = () => {
  try {
    const tokenKey = window.config?.AUTH_TOKEN_KEY || DEFAULT_TOKEN_KEY;
    localStorage.removeItem(tokenKey);
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};