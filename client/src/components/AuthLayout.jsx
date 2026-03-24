import { Link, useLocation } from "react-router-dom";

function AuthLayout({ type = "login", title, subtitle, children }) {
  const location = useLocation();

  return (
    <div className="page">
      <div className="auth-card">
        <div className="left-panel">
          <div className="brand">InsureHub</div>
          <h1>{type === "login" ? "Welcome Back" : "Create Account"}</h1>
          <p>
            {type === "login"
              ? "Sign in to continue managing your insurance dashboard easily."
              : "Create your account and start managing your insurance in one place."}
          </p>

          <div className="switch-box">
            {location.pathname === "/login" ? (
              <>
                <span>New here?</span>
                <Link to="/signup" className="switch-btn">
                  Create Account
                </Link>
              </>
            ) : (
              <>
                <span>Already have an account?</span>
                <Link to="/login" className="switch-btn">
                  Welcome Back
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="right-panel">
          <div className="form-box">
            <h2>{title}</h2>
            <p className="subtitle">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;