import { useState } from "react";
import { signupUser } from "../services/signup";

export default function useSignup() {
  const [loading, setLoading] = useState(false);

  const signup = async (payload) => {
    setLoading(true);
    try {
      return await signupUser(payload);
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
}
