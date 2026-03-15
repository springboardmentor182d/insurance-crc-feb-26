import { Link } from "react-router-dom";
import "./Login.css";

export default function ForgotPassword() {
  return (
    <main className="login-page">
      <section className="login-wrap">
        <article className="login-card">
          <h1 className="login-title">Forgot Password</h1>
          <p className="login-subtitle">
            Please contact the administrator to reset your password.
          </p>
          <p className="login-signup-row">
            <Link to="/login" className="login-signup-link">
              Back to Login
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}
