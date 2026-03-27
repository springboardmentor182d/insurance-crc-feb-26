const configuredApiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL;

export const API_BASE_URL = configuredApiBaseUrl || "http://localhost:8000/api/v1";

export const ROUTES = {
  HOME:            "/",
  LOGIN:           "/login",
  SIGNUP:          "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  ADMIN_LOGIN:     "/admin/login",
  DASHBOARD:       "/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
  SETTINGS:        "/settings",
  PROFILE:         "/profile",
  PREFERENCES:     "/preferences",
  BROWSE_POLICIES: "/policies/browse",
  ACTIVE_POLICIES: "/policies/active",
  RECOMMENDATIONS: "/policies/recommendations",
};

export const TOKEN_KEYS = {
  ACCESS:  "bv_access_token",
  REFRESH: "bv_refresh_token",
  USER:    "bv_user",
};

export const ROLES = {
  USER:  "user",
  ADMIN: "admin",
};