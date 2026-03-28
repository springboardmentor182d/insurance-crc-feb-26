import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES, TOKEN_KEYS } from "../../../data/constants";
import GoogleAuthButton from "./GoogleAuthButton";
import signupService from "../services/signup";

const SignupForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", date_of_birth: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const data = await signupService(form);
      localStorage.setItem(TOKEN_KEYS.ACCESS, data.access_token);
      localStorage.setItem(TOKEN_KEYS.REFRESH, data.refresh_token);
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user));
      navigate(ROUTES.DASHBOARD);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="auth-error">{error}</div>}
      <div className="auth-field"><label>Full Name</label><div className="auth-input-wrap"><span className="auth-input-icon">#</span><input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required /></div></div>
      <div className="auth-field"><label>Email Address</label><div className="auth-input-wrap"><span className="auth-input-icon">@</span><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required /></div></div>
      <div className="auth-field"><label>Date of Birth</label><div className="auth-input-wrap"><span className="auth-input-icon">*</span><input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} /></div></div>
      <div className="auth-field"><label>Password</label><div className="auth-input-wrap"><span className="auth-input-icon">#</span><input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" required /></div></div>
      <div className="auth-field"><label>Confirm Password</label><div className="auth-input-wrap"><span className="auth-input-icon">#</span><input type="password" value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); if (error) setError(""); }} placeholder="Repeat password" required /></div></div>
      <button type="submit" className="auth-btn-primary" disabled={loading}>{loading ? <span className="auth-spinner" /> : "Create Account"}</button>
      <div className="auth-divider"><span>Or sign up with</span></div>
      <GoogleAuthButton label="Sign up with Google" onError={setError} />
      <p className="auth-footer-text">Already have an account? <Link to={ROUTES.LOGIN} className="auth-link auth-link-bold">Sign in</Link></p>
    </form>
  );
};

export default SignupForm;
