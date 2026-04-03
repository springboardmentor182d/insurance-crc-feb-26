import React from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="auth-card">
        {/* Left Side */}
        <div className="left-panel">
          <div className="brand">InsureHub</div>
          <h1>Create Account</h1>
          <p>
            Create your account and start managing your insurance in one place.
          </p>

          <div className="switch-box">
            <span>Already have an account?</span>
            <div className="switch-btn" onClick={() => navigate("/login")}>
              Welcome Back
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="right-panel" style={{ background: "#ffffff" }}>
          <div className="form-box">
            <h2 style={{ fontSize: "48px" }}>Create your account</h2>
            <p className="subtitle">Fill in the details below to get started</p>

            <form className="auth-form">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" />

              <label>Email</label>
              <input type="email" placeholder="Enter your email" />

              <label>Password</label>
              <input type="password" placeholder="Create a password" />

              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm your password" />

              <button type="submit" className="primary-btn">
                Create Account
              </button>
            </form>

            <p className="bottom-text">
              Already have an account?{" "}
              <span
                className="bottom-link"
                onClick={() => navigate("/login")}
              >
                Welcome Back
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;