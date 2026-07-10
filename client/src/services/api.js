import axios from 'axios';

// Single Axios instance used across the whole app. Every service module
// (authService, visitorService, etc.) imports this instead of calling
// axios directly, so auth headers and error handling stay consistent.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, // sends the httpOnly JWT cookie set by the backend
});

// Attach the JWT (kept as a fallback in localStorage for non-cookie clients)
// as a Bearer token on every outgoing request, if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalizes error responses so every page can do: catch(err) => err.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';

    // On an expired/invalid token, clear local state so the UI reflects logged-out status.
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject({ ...error, message });
  }
);

export default api;
