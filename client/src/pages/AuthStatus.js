import React from "react";
import { Link } from "react-router-dom";

import { ROUTES, TOKEN_KEYS } from "../data/constants";

const AuthStatus = () => {
  const userRaw = localStorage.getItem(TOKEN_KEYS.USER);
  const user = userRaw ? JSON.parse(userRaw) : null;

  const handleSignOut = () => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
    localStorage.removeItem(TOKEN_KEYS.USER);
  };

  return (
    <div className="auth-standalone">
      <div className="auth-standalone-brand">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>BimaVerse</span>
      </div>

      <div className="auth-card auth-card-compact">
        <div className="auth-success-state">
          <div className="auth-success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <div className="auth-card-header auth-card-header-centered">
            <h2>Authentication Complete</h2>
            <p>
              {user?.email
                ? `You are authenticated as ${user.email}.`
                : "Your authentication flow completed successfully."}
            </p>
          </div>

          <div className="auth-form">
            <Link to={ROUTES.LOGIN} className="auth-btn-primary" onClick={handleSignOut}>
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthStatus;
