const configuredApiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL;

export const API_BASE_URL = configuredApiBaseUrl || "http://localhost:8001/api/v1";

export const ROUTES = {
  HOME:            "/",
  LOGIN:           "/login",
  SIGNUP:          "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  AUTH_STATUS:     "/auth/status",
  ADMIN_LOGIN:     "/admin/login",
  ADMIN_SIGNUP:    "/admin/signup",
};

export const TOKEN_KEYS = {
  ACCESS:  "bv_access_token",
  REFRESH: "bv_refresh_token",
  USER:    "bv_user",
};

export const ROLES = {
  USER: "user",
};
