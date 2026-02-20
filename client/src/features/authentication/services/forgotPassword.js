import { API_BASE_URL } from "../../../data/constants";

const forgotPassword = async (email) => {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Unable to process password reset request");
  return data;
};

export default forgotPassword;
