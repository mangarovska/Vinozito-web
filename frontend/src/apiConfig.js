// API Configuration
// Uses relative URLs so Nginx can proxy to backend
export const API_BASE_URL = "/api";

// Helper function for API calls
export const apiFetch = (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  return fetch(url, options);
};
