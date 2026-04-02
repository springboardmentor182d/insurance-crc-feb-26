import axios from "axios";
import { API_BASE_URL, TOKEN_KEYS, ROUTES } from "../data/constants";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("API_BASE_URL:", API_BASE_URL);

let refreshPromise = null;

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/admin/login",
  "/auth/register",
  "/auth/refresh",
];

const clearStoredAuth = () => {
  Object.values(TOKEN_KEYS).forEach((key) => localStorage.removeItem(key));
};

const getLoginRoute = () => {
  const storedUser = localStorage.getItem(TOKEN_KEYS.USER);

  if (!storedUser) {
    return ROUTES.LOGIN;
  }

  try {
    const user = JSON.parse(storedUser);
    return user?.role === "admin" ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN;
  } catch {
    return ROUTES.LOGIN;
  }
};

const redirectToLogin = () => {
  const loginRoute = getLoginRoute();
  clearStoredAuth();
  window.location.href = loginRoute;
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH);

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Token refresh failed");
  }

  localStorage.setItem(TOKEN_KEYS.ACCESS, data.access_token);
  localStorage.setItem(TOKEN_KEYS.REFRESH, data.refresh_token);
  localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user));

  return data.access_token;
};

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
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const isAuthRequest = AUTH_ROUTES.some((route) => requestUrl.includes(route));

    if (error.response?.status === 401 && !isAuthRequest && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
      if (!token || isAuthRequest) {
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
