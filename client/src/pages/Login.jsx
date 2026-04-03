import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="auth-card">
        {/* Left Side */}
        <div className="left-panel">
          <div className="brand">InsureHub</div>
          <p>Your Trusted Insurance Partner</p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Compare policies from top providers</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Get AI-powered recommendations</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Manage claims seamlessly</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="right-panel">
          <div className="form-box">
            <h2>Welcome Back</h2>
            <p className="subtitle">
              Sign in to access your insurance dashboard
            </p>

            <form className="auth-form">
              <label>Email or Mobile</label>
              <input
                type="text"
                placeholder="Enter your email or mobile number"
              />

              <label>Password</label>
              <input type="password" placeholder="Enter your password" />

              <button type="submit" className="primary-btn">
                Sign In
              </button>
            </form>

            <p className="bottom-text">
              <span
                className="bottom-link"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;