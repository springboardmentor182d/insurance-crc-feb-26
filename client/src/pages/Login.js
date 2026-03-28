import React from "react";
import LoginForm from "../features/authentication/components/LoginForm";

const Login = () => (
  <div className="auth-root">
    <div className="auth-left">
      <div className="auth-brand"><span>BimaVerse</span></div>
      <div className="auth-left-content">
        <h1>Protect What Matters Most</h1>
        <p>Compare policies, get personalized recommendations, and manage claims seamlessly.</p>
        <div className="auth-features">
          {["Compare 500+ policies instantly", "AI-powered recommendations", "Track claims in real-time"].map((item) => (
            <div className="auth-feature-item" key={item}><span className="auth-feature-dot" />{item}</div>
          ))}
        </div>
      </div>
      <p className="auth-copyright">© 2026 BimaVerse. All rights reserved.</p>
    </div>
    <div className="auth-right">
      <div className="auth-card">
        <div className="auth-card-header"><h2>Welcome Back</h2><p>Sign in to access your account</p></div>
        <LoginForm />
      </div>
    </div>
  </div>
);

export default Login;
