import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../features/authentication/services/getUsers";
import { TOKEN_KEYS, ROUTES } from "../data/constants";


const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", admin_secret: "" });
  const [showSecret, setShowSecret] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginAdmin(form);
      localStorage.setItem(TOKEN_KEYS.ACCESS, data.access_token);
      localStorage.setItem(TOKEN_KEYS.REFRESH, data.refresh_token);
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user));
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">

      {/* ── Left Panel ── */}
      <div className="auth-left admin-left">
        <div className="auth-brand">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>BimaVerse</span>
        </div>

        <div className="auth-left-content">
          <div className="admin-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Admin Portal
          </div>

          <h1>Secure Admin Access</h1>
          <p>Restricted area. Authorized personnel only. All login attempts are logged and monitored.</p>

          <div className="admin-info-boxes">
            <div className="admin-info-box">
              <span>🔐</span>
              <div>
                <strong>Multi-factor verification</strong>
                <p>Admin secret key required in addition to your credentials</p>
              </div>
            </div>
            <div className="admin-info-box">
              <span>📋</span>
              <div>
                <strong>All actions are logged</strong>
                <p>Every admin action is recorded in the audit trail</p>
              </div>
            </div>
            <div className="admin-info-box">
              <span>⚠️</span>
              <div>
                <strong>Authorized use only</strong>
                <p>Unauthorized access attempts will be reported</p>
              </div>
            </div>
          </div>
        </div>
        <p className="auth-copyright">© 2026 BimaVerse. All rights reserved.</p>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-right">
        <div className="auth-card">

          <div className="auth-card-header" style={{ textAlign: "center" }}>
            <div className="admin-avatar">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h2>Admin Login</h2>
            <p>Enter your credentials and secret key</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {error && <div className="auth-error">{error}</div>}

            {/* Email */}
            <div className="auth-field">
              <label>Admin Email</label>
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
                  placeholder="admin@bimaverse.com"
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

            {/* Admin Secret */}
            <div className="auth-field">
              <label>Admin Secret Key</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                  </svg>
                </span>
                <input
                  type={showSecret ? "text" : "password"}
                  name="admin_secret"
                  placeholder="Enter admin secret key"
                  value={form.admin_secret}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowSecret((s) => !s)}>
                  {showSecret ? (
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
              <span style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                Contact your system administrator if you don't have this key
              </span>
            </div>

            <button type="submit" className="auth-btn-primary admin-btn-submit" disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Secure Admin Login
                </>
              )}
            </button>
          </form>

          <div className="admin-back-link">
            <Link to={ROUTES.LOGIN} className="auth-link">← Back to User Login</Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminLogin;