const configuredApiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL;

export const API_BASE_URL = configuredApiBaseUrl || "http://localhost:8000/api/v1";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  ADMIN_LOGIN: "/admin/login",
  DASHBOARD: "/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
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

export const ACTIVE_POLICIES = [
  { id: 1, name: "Home Insurance Premium", type: "Home", renews: "Jun 2026", amount: "$1,200/year", status: "Active" },
  { id: 2, name: "Auto Comprehensive", type: "Auto", renews: "Jan 2027", amount: "$850/year", status: "Active" },
];

export const RECENT_CLAIMS = [
  { id: "CLM-2026-001", type: "Auto", date: "2026-02-08", amount: "$3,500", status: "In Review" },
  { id: "CLM-2025-094", type: "Home", date: "2025-12-15", amount: "$1,200", status: "Resolved" },
];
