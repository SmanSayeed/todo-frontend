import config from "../config/apiConfig";

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(config.AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(config.AUTH_TOKEN_KEY);
  }
};

export const getAuthToken = () => {
  return localStorage.getItem(config.AUTH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};