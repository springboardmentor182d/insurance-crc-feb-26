import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/getUsers";
import "./auth.css";

export default function LoginForm() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // LOGIN FUNCTION (MERGED)
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // BACKEND CALL
      const result = await loginUser(email, password);

      // CHECK CONNECTION
      console.log(result);

      // ROLE BASED NAVIGATION
      if (result.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }

    } catch (error) {
      console.log("Login error:", error);
    }
  };

  return (
    <div className="login-wrapper">

      <div className="logo-section">
        <div className="logo-box">I</div>
        <h2>InsureHub</h2>
      </div>

      <form className="login-card" onSubmit={handleLogin}>
        <h1>Welcome back</h1>
        <p>Sign in to your account to continue</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="john.doe@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign in</button>

        <p>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>

    </div>
  );
}