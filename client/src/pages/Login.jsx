import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

function Login() {
  return (
    <AuthLayout
      type="login"
      title="Login to your account"
      subtitle="Enter your credentials to continue"
    >
      <form className="auth-form">
        <label>Email</label>
        <input type="email" placeholder="Enter your email" />

        <label>Password</label>
        <input type="password" placeholder="Enter your password" />

        <div className="row-between">
          <label className="checkbox-wrap">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>

          <a href="#" className="link-text">
            Forgot password?
          </a>
        </div>

        <button type="button" className="primary-btn">
          Sign In
        </button>

        <p className="bottom-text">
          Don&apos;t have an account? <Link to="/signup">Create Account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;