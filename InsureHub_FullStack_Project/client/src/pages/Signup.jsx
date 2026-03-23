import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

function Signup() {
  return (
    <AuthLayout
      type="signup"
      title="Create your account"
      subtitle="Fill in the details below to get started"
    >
      <form className="auth-form">
        <label>Full Name</label>
        <input type="text" placeholder="Enter your full name" />

        <label>Email</label>
        <input type="email" placeholder="Enter your email" />

        <label>Password</label>
        <input type="password" placeholder="Create a password" />

        <label>Confirm Password</label>
        <input type="password" placeholder="Confirm your password" />

        <button type="button" className="primary-btn">
          Create Account
        </button>

        <p className="bottom-text">
          Already have an account? <Link to="/login">Welcome Back</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Signup;