import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupService from "../services/signup";
import { TOKEN_KEYS, ROUTES } from "../../../data/constants";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const signup = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await signupService(formData);
      localStorage.setItem(TOKEN_KEYS.ACCESS, data.access_token);
      localStorage.setItem(TOKEN_KEYS.REFRESH, data.refresh_token);
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user));
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // 👈 This was missing
  return { signup, loading, error };
};

export default useSignup;
