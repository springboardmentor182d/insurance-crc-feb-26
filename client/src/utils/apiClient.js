import axios from "axios";
import { TOKEN_KEYS, ROUTES } from "../data/constants";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Only redirect to login if we're on a protected page
      // and the token is actually missing/invalid — not just a
      // background API call failing on a dashboard widget
      const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
      if (!token  && currentPath !== "/login" && currentPath !== "/admin-login") {
        // Token is genuinely missing — redirect to login
        Object.values(TOKEN_KEYS).forEach((k) => localStorage.removeItem(k));
        window.location.href = ROUTES.ADMIN_LOGIN;
      }
      // If token exists but got 401, just reject — don't redirect
      // This prevents dashboard widget failures from logging the user out
    }
    return Promise.reject(error);
  }
);

export default apiClient;