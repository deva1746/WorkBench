import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const API_URL = import.meta.env.VITE_API_URL || "https://3hnfx6mc-8080.inc1.devtunnels.ms/api";

/** Axios instance with base URL and JWT interceptor. */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request if available.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401 responses.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
