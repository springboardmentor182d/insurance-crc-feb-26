import { API_BASE_URL } from "../../../data/constants";

const login = async ({ email, password, remember_me = false }) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, remember_me }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data;
};

export default login;