
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  ADMIN_LOGIN: "/admin/login",
  DASHBOARD: "/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
  SETTINGS: "/settings",
};

export const TOKEN_KEYS = {
  ACCESS: "bv_access_token",
  REFRESH: "bv_refresh_token",
  USER: "bv_user",
};

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
};