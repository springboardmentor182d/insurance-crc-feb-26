import React, { useState } from "react";
import { Link } from "react-router-dom";
import forgotPassword from "../features/authentication/services/forgotPassword";
import { ROUTES } from "../data/constants";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const trimmedEmail = email.trim();
    setLoading(true);
    setApiError("");

    try {
      const response = await forgotPassword(trimmedEmail);
      setEmail(response.email || trimmedEmail);
      setSubmitted(true);
    } catch (error) {
      setApiError(error.message);
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
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
        {submitted ? (
          <div className="auth-success-state">
            <div className="auth-success-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <div className="auth-card-header auth-card-header-centered">
              <h2>Check Your Email</h2>
              <p>
                We've sent password reset instructions to{" "}
                <strong>{email}</strong>
              </p>
            </div>

            <p className="auth-success-help">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                type="button"
                className="auth-inline-button"
                onClick={() => {
                  setSubmitted(false);
                  setApiError("");
                }}
              >
                try again
              </button>
            </p>
          </div>
        ) : (
          <>
            <div className="auth-card-header">
              <h2>Reset Password</h2>
              <p>Enter your email and we'll send you instructions to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {apiError && <div className="auth-error">{apiError}</div>}

              <div className="auth-field auth-field-spaced">
                <label>Email Address</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (apiError) setApiError("");
                    }}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : "Send Reset Link"}
              </button>
            </form>
          </>
        )}

        <div className="auth-back-row">
          <Link to={ROUTES.LOGIN} className="auth-back-link-inline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
