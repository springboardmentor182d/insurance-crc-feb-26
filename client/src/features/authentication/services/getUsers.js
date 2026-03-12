import { API_BASE_URL, TOKEN_KEYS } from "../../../data/constants";

export const loginAdmin = async ({ email, password, admin_secret }) => {
  const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, admin_secret }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Admin login failed");
  return data;
};

export const refreshTokens = async () => {
  const refresh_token = localStorage.getItem(TOKEN_KEYS.REFRESH);
  if (!refresh_token) throw new Error("No refresh token found");
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Token refresh failed");
  return data;
};

export const logoutUser = async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" });
  } finally {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
    localStorage.removeItem(TOKEN_KEYS.USER);
  }
};