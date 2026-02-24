import { Link } from "react-router-dom";

export default function SignupForm() {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>Create Account</h1>

        <label>Name</label>
        <input type="text" placeholder="Enter name" />

        <label>Email</label>
        <input type="email" placeholder="john.doe@example.com" />

        <label>Password</label>
        <input type="password" placeholder="******" />

        <button>Sign up</button>

        <p>
          Already have account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}