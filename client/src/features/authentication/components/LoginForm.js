import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }
  };

  return (
    <div className="auth-container">

      {/* LOGO */}
      <div className="logo">
        <span className="logo-box">I</span>
        <h2>InsureHub</h2>
      </div>

      {/* CARD */}
      <div className="login-card">
        <h1>Welcome back</h1>
        <p>Sign in to your account to continue</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="john.doe@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Sign in</button>

        <p>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;