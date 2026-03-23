import { API_BASE_URL } from "../../../data/constants";
import { toBackendDate } from "../../../utils/formatDate";

const signup = async ({ name, email, password, dob }) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      date_of_birth: dob ? toBackendDate(dob) : null,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Registration failed");
  return data;
};

export default signup;