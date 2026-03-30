import React from "react";
import LoginForm from "../../features/authentication/components/LoginForm";

const Login = () => {
  return (
    <div className="auth-root">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>BimaVerse</span>
        </div>
        <div className="auth-left-content">
          <h1>Protect What Matters Most</h1>
          <p>Compare policies, get personalized recommendations, and manage claims seamlessly.</p>
          <div className="auth-features">
            {["Compare 500+ policies instantly", "AI-powered recommendations", "Track claims in real-time"].map((f) => (
              <div className="auth-feature-item" key={f}>
                <span className="auth-feature-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="auth-copyright">© 2026 BimaVerse. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your account</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
export default Login;
