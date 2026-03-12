import { useState } from "react";

const useVerifyPassword = () => {
  const [passwordError, setPasswordError] = useState("");

  const verify = (password, confirmPassword) => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const clearError = () => setPasswordError("");

  return { passwordError, verify, clearError };
};

export default useVerifyPassword;