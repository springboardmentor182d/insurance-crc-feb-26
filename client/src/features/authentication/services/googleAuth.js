import { API_BASE_URL } from "../../../data/constants";

const googleAuth = async (accessToken) => {
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: accessToken }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Google sign-in failed");
  return data;
};

export default googleAuth;
