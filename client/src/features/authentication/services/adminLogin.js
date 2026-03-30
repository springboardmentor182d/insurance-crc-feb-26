import { API_BASE_URL } from "../../../data/constants";

const adminLogin = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      admin_secret: "bimaverse-admin-2026",
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Admin login failed");
  return data;
};

export default adminLogin;
