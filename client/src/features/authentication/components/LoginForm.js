import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES, TOKEN_KEYS } from "../../../data/constants";
import GoogleAuthButton from "./GoogleAuthButton";
import loginService from "../services/login";

const LoginForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember_me: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginService(form);
      localStorage.setItem(TOKEN_KEYS.ACCESS, data.access_token);
      localStorage.setItem(TOKEN_KEYS.REFRESH, data.refresh_token);
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user));
      navigate(data.user.role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.DASHBOARD);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="auth-error">{error}</div>}
      <div className="auth-field">
        <label>Email Address</label>
        <div className="auth-input-wrap">
          <span className="auth-input-icon">@</span>
          <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" />
        </div>
      </div>
      <div className="auth-field">
        <label>Password</label>
        <div className="auth-input-wrap">
          <span className="auth-input-icon">#</span>
          <input type={showPass ? "text" : "password"} name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required autoComplete="current-password" />
          <button type="button" className="auth-eye-btn" onClick={() => setShowPass((value) => !value)}>{showPass ? "Hide" : "Show"}</button>
        </div>
      </div>
      <div className="auth-row">
        <label className="auth-checkbox-label">
          <input type="checkbox" name="remember_me" checked={form.remember_me} onChange={handleChange} />
          <span>Remember me</span>
        </label>
        <Link to={ROUTES.FORGOT_PASSWORD} className="auth-link">Forgot password?</Link>
      </div>
      <button type="submit" className="auth-btn-primary" disabled={loading}>{loading ? <span className="auth-spinner" /> : "Sign In"}</button>
      <div className="auth-divider"><span>Or continue with</span></div>
      <GoogleAuthButton label="Sign in with Google" onError={setError} />
      <p className="auth-footer-text">Don't have an account? <Link to={ROUTES.SIGNUP} className="auth-link auth-link-bold">Sign up</Link></p>
      <div className="auth-admin-link"><Link to={ROUTES.ADMIN_LOGIN} className="auth-link">Login as Admin</Link></div>
    </form>
  );
};

export default LoginForm;
