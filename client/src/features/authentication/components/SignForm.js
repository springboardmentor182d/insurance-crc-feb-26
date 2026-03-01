import { Link } from "react-router-dom";

function SignForm() {
  return (
    <div className="auth-container">
      <div className="login-card">
        <h1>Create Account</h1>

        <label>Name</label>
        <input type="text" placeholder="Enter name" />

        <label>Email</label>
        <input type="email" placeholder="john.doe@example.com" />

        <label>Password</label>
        <input type="password" placeholder="••••••••" />

        <button>Sign up</button>

        <p className="bottom-text">
          Already have account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignForm;