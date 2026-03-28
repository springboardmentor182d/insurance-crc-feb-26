import { API_BASE_URL } from "../../../data/constants";

const signup = async ({ name, email, password, date_of_birth }) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, date_of_birth: date_of_birth || null }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Signup failed");
  return data;
};

export default signup;
