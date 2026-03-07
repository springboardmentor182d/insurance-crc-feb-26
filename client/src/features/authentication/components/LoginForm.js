import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const baseURL = process.env.REACT_APP_BASE_URL;

  const handleLogin = async (e) => {
  e.preventDefault();

  const response = await fetch(`${baseURL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const data = await response.json();

  if (response.ok) {

    // ADMIN CHECK
    if (data.email === "admin@gmail.com") {
      window.location.href = "/admin-dashboard";
    } else {
      window.location.href = "/user-dashboard";
    }

  } else {
    alert("Login failed");
  }
};

  const handleGoogleLogin = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  return (

    <div className="auth-container">

      <div className="left-panel">

        <h1>InsureHub</h1>

        <h2>Protect What Matters Most</h2>

        <p>
          Compare policies, get personalized recommendations,
          and manage claims seamlessly.
        </p>

      </div>


      <div className="right-panel">

        <h2>Welcome Back</h2>

        <p>Sign in to access your account</p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button type="submit">
            Sign In
          </button>

        </form>

        <p style={{textAlign:"center"}}>or continue with</p>

        <button className="google-btn" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>

        <p className="signup-text">
          Don't have an account?
          <span onClick={()=>navigate("/signup")}>
            Sign up
          </span>
        </p>

      </div>

    </div>

  );

};

export default LoginForm;