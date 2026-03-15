import { useState } from "react";
import { Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { setAuthToken } from "../utils/auth";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        email: email.trim(),
        password,
      };

      const res = await API.post("/auth/login", payload);
      setAuthToken(res.data.access_token);
      navigate("/admin", { replace: true });
    } catch (loginError) {
      const message = loginError?.response?.data?.detail
        || (loginError?.request
          ? "Unable to reach the server. Please try again."
          : "Unable to sign in. Please check your credentials and try again.");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-wrap">
        <article className="login-card">
          <div className="login-header">
            <div className="login-shield">
              <Shield className="shield-icon" aria-hidden="true" />
            </div>

            <h1 className="login-title">Admin Portal</h1>
            <p className="login-subtitle">
              Sign in to access your dashboard
            </p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="visually-hidden">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="visually-hidden">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
            </div>

            <div className="login-inline-row">
              <Link to="/forgot-password" className="login-inline-link">
                Forgot Password?
              </Link>
            </div>

            {error ? (
              <p className="login-error">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="login-submit"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <p className="login-signup-row">
              Don&apos;t have an account? {" "}
              <Link to="/signup" className="login-signup-link">
                Sign Up
              </Link>
            </p>
          </form>
        </article>
      </section>
    </main>
  );
}
