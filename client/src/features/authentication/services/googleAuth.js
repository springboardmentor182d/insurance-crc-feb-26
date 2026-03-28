import { API_BASE_URL } from "../../../data/constants";

const googleAuth = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: accessToken }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Google sign-in failed");
  return data;
};

export default googleAuth;
