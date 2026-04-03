// src/features/authentication/components/SignupForm.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "../hooks/usesignup";
import useVerifyPassword from "../hooks/userverifyPassword";
import { ROUTES } from "../../../data/constants";
import GoogleAuthButton from "./GoogleAuthButton";

const SignupForm = () => {
  const { signup, loading, error } = useSignup();
  const { passwordError, verify, clearError } = useVerifyPassword();
  const [googleError, setGoogleError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (e.target.name === "password") clearError();
    if (googleError) setGoogleError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGoogleError("");
    if (!verify(form.password, confirmPassword)) return;

    // Map frontend keys to backend schema
    signup({
      name: form.name,
      email: form.email,
      password: form.password,
      dob: form.dob || null,
    });
  };

  const displayError = error || passwordError || googleError;

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      {displayError && <div className="auth-error">{displayError}</div>}

      {/* Name */}
      <div className="auth-field">
        <label>Full Name</label>
        <div className="auth-input-wrap">
          <span className="auth-input-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="auth-field">
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
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
      </div>

      {/* DOB */}
      <div className="auth-field">
        <label>Date of Birth</label>
        <div className="auth-input-wrap">
          <span className="auth-input-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </span>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      {/* Password row */}
      <div className="auth-row auth-row-halves">
        <div className="auth-field">
          <label>Password</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </span>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label>Confirm Password</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </span>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearError();
                if (googleError) setGoogleError("");
              }}
              required
            />
          </div>
        </div>
      </div>

      {/* Show password toggle */}
      <label className="auth-checkbox-label">
        <input
          type="checkbox"
          checked={showPass}
          onChange={() => setShowPass((s) => !s)}
        />
        <span>Show passwords</span>
      </label>

      <button type="submit" className="auth-btn-primary" disabled={loading}>
        {loading ? <span className="auth-spinner" /> : "Create Account"}
      </button>

      <div className="auth-divider"><span>Or sign up with</span></div>

      <GoogleAuthButton label="Sign up with Google" onError={setGoogleError} />

      <p className="auth-footer-text">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="auth-link auth-link-bold">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
