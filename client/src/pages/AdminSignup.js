import React from "react";

import SignupForm from "../features/authentication/components/SignupForm";

const AdminSignup = () => {
  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>BimaVerse</span>
        </div>
        <div className="auth-left-content">
          <h1>Create Admin Access</h1>
          <p>Use the same auth onboarding UI for the admin flow as well.</p>
        </div>
        <p className="auth-copyright">© 2026 BimaVerse. All rights reserved.</p>
      </div>

      <div className="auth-right">
        <div className="auth-card auth-card-signup">
          <div className="auth-card-header">
            <h2>Admin Sign Up</h2>
            <p>Continue with email or Google</p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
