import React from "react";
import SignupForm from "../features/authentication/components/SignupForm";

const Signup = () => {
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
          <h1>Your Insurance Journey Starts Here</h1>
          <p>Join thousands who trust BimaVerse to find the perfect policy and manage claims effortlessly.</p>
          <div className="auth-features">
            {[
              "Free policy comparisons",
              "Personalized recommendations",
              "Guided claim filing",
              "Real-time claim tracking",
            ].map((f) => (
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
        <div className="auth-card auth-card-signup">
          <div className="auth-card-header">
            <h2>Create Account</h2>
            <p>Start comparing policies today</p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;