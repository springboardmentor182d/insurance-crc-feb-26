import React from "react";
import SignupForm from "../features/authentication/components/SignupForm";

const Signup = () => (
  <div className="auth-root">
    <div className="auth-left">
      <div className="auth-brand"><span>BimaVerse</span></div>
      <div className="auth-left-content">
        <h1>Your Insurance Journey Starts Here</h1>
        <p>Join thousands who trust BimaVerse to find the perfect policy and manage claims effortlessly.</p>
        <div className="auth-features">
          {["Free policy comparisons", "Personalized recommendations", "Guided claim filing", "Real-time claim tracking"].map((item) => (
            <div className="auth-feature-item" key={item}><span className="auth-feature-dot" />{item}</div>
          ))}
        </div>
      </div>
      <p className="auth-copyright">© 2026 BimaVerse. All rights reserved.</p>
    </div>
    <div className="auth-right">
      <div className="auth-card">
        <div className="auth-card-header"><h2>Create Account</h2><p>Start comparing policies today</p></div>
        <SignupForm />
      </div>
    </div>
  </div>
);

export default Signup;
