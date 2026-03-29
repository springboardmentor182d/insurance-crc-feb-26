import React from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "../data/constants";

const AdminLogin = () => {
  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>BimaVerse</span>
        </div>
        <div className="auth-left-content">
          <h1>Admin Access</h1>
          <p>This screen is kept for UI continuity in the auth-only submission.</p>
        </div>
        <p className="auth-copyright">© 2026 BimaVerse. All rights reserved.</p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Admin Login</h2>
            <p>This admin flow is intentionally not active in the auth-only version.</p>
          </div>

          <div className="auth-form">
            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input type="email" placeholder="admin@example.com" disabled />
              </div>
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <input type="password" placeholder="••••••••" disabled />
              </div>
            </div>

            <button type="button" className="auth-btn-primary" disabled>
              Admin Login Disabled
            </button>

            <p className="auth-footer-text">
              <Link to={ROUTES.LOGIN} className="auth-link auth-link-bold">
                Back to user sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
