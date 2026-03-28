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
    } catch (requestError) {
      setApiError(requestError.message);
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-standalone">
      <div className="auth-standalone-brand"><span>BimaVerse</span></div>
      <div className="auth-card auth-card-compact">
        {submitted ? (
          <div className="auth-success-state">
            <div className="auth-success-icon">@</div>
            <div className="auth-card-header auth-card-header-centered">
              <h2>Check Your Email</h2>
              <p>We've sent password reset instructions to <strong>{email}</strong></p>
            </div>
            <p className="auth-success-help">Didn't receive the email? Check your spam folder or <button type="button" className="auth-inline-button" onClick={() => setSubmitted(false)}>try again</button></p>
          </div>
        ) : (
          <>
            <div className="auth-card-header"><h2>Reset Password</h2><p>Enter your email and we'll send you instructions to reset your password.</p></div>
            <form onSubmit={handleSubmit} className="auth-form">
              {apiError && <div className="auth-error">{apiError}</div>}
              <div className="auth-field auth-field-spaced">
                <label>Email Address</label>
                <div className="auth-input-wrap"><input type="email" name="email" placeholder="you@example.com" value={email} onChange={(event) => { setEmail(event.target.value); if (apiError) setApiError(""); }} required autoComplete="email" /></div>
              </div>
              <button type="submit" className="auth-btn-primary" disabled={loading}>{loading ? <span className="auth-spinner" /> : "Send Reset Link"}</button>
            </form>
          </>
        )}
        <div className="auth-back-row"><Link to={ROUTES.LOGIN} className="auth-back-link-inline">Back to sign in</Link></div>
      </div>
    </div>
  );
};

export default ForgotPassword;
