import { API_BASE_URL } from "../../../data/constants";

export const loginAdmin = async ({ email, password, admin_secret }) => {
  const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, admin_secret }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Admin login failed");
  return data;
};
