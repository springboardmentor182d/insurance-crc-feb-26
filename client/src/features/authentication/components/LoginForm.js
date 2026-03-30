import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginService from "../services/login";
import { TOKEN_KEYS, ROUTES } from "../../../data/constants";
import GoogleAuthButton from "./GoogleAuthButton";

const LoginForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember_me: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginService(form);
      localStorage.setItem(TOKEN_KEYS.ACCESS, data.access_token);
      localStorage.setItem(TOKEN_KEYS.REFRESH, data.refresh_token);
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user));
      navigate(ROUTES.AUTH_STATUS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      {error && <div className="auth-error">{error}</div>}

      {/* Email */}
      <div className="auth-field">
        <label>Email Address</label>
        <div className="auth-input-wrap">
          <span className="auth-input-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </span>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div className="auth-field">
        <label>Password</label>
        <div className="auth-input-wrap">
          <span className="auth-input-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </span>
          <input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <button type="button" className="auth-eye-btn" onClick={() => setShowPass((s) => !s)}>
            {showPass ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Remember me + Forgot */}
      <div className="auth-row">
        <label className="auth-checkbox-label">
          <input
            type="checkbox"
            name="remember_me"
            checked={form.remember_me}
            onChange={handleChange}
          />
          <span>Remember me</span>
        </label>
        <Link to={ROUTES.FORGOT_PASSWORD} className="auth-link">Forgot password?</Link>
      </div>

      <button type="submit" className="auth-btn-primary" disabled={loading}>
        {loading ? <span className="auth-spinner" /> : "Sign In"}
      </button>

      <div className="auth-divider"><span>Or continue with</span></div>

      <GoogleAuthButton label="Sign in with Google" onError={setError} />

      <p className="auth-footer-text">
        Don't have an account?{" "}
        <Link to={ROUTES.SIGNUP} className="auth-link auth-link-bold">Sign up</Link>
      </p>

      <div className="auth-admin-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <Link to={ROUTES.ADMIN_LOGIN} className="auth-link">Login as Admin</Link>
      </div>
    </form>
  );
};

export default LoginForm;
