import "../App.css";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaPhoneAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/authentication/services/login";
import { signupUser } from "../features/authentication/services/signup";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalStep, setModalStep] = useState("input");
  const [modalType, setModalType] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [otp, setOtp] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const switchTab = (value) => {
    setIsLogin(value);
    resetForm();
  };

  const openModal = (type, title) => {
    setModalType(type);
    setModalTitle(title);
    setModalStep("input");
    setModalValue("");
    setOtp("");
    setModalMessage("");
    setModalOpen(true);
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);

      localStorage.setItem("token", res.access_token);
      navigate("/dashboard");

    } catch {
      setModalTitle("Login Status");
      setModalMessage("Invalid Credentials");
      setModalStep("message");
      setModalOpen(true);
    }
  };

  // ================= SIGNUP =================
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setModalTitle("Signup Error");
      setModalMessage("Passwords do not match");
      setModalStep("message");
      setModalOpen(true);
      return;
    }

    try {
      await signupUser(name, email, password);

      setModalTitle("Signup Status");
      setModalMessage("Account Created Successfully!");
      setModalStep("message");
      setModalOpen(true);

      resetForm();
      setIsLogin(true);

    } catch (err) {
      setModalTitle("Signup Error");

      if (err.response?.data?.detail === "Email already registered") {
        setModalMessage("Email already exists");
      } else {
        setModalMessage("Signup failed. Try again.");
      }

      setModalStep("message");
      setModalOpen(true);
    }
  };

  const handleModalContinue = () => {
    if (modalStep === "input") {
      if (!modalValue) return;

      if (modalType === "forgot") {
        setModalTitle("Reset Password");
        setModalMessage("Password reset link sent successfully!");
        setModalStep("message");
      } else {
        setModalStep("otp");
      }
    }

    else if (modalStep === "otp") {
      if (otp === "123456") {
        setModalOpen(false);
        navigate("/dashboard");
      } else {
        setModalTitle("OTP Error");
        setModalMessage("Invalid OTP (Demo OTP is 123456)");
      }
      setModalStep("message");
    }

    else {
      setModalOpen(false);
    }
  };

  return (
    <div className="page">

      <div className="branding">
        <img src="/src/assets/logo.png" alt="logo" className="logo-image" />
        <h1 className="main-title">InsureLogic</h1>
        <p className="tagline">
          Smart Insurance Policy Comparison and Claim Management System
        </p>
      </div>

      <div className="auth-card">
        <div className="card-header">Customer Portal</div>

        <div className="card-body">

          <div className="tabs">
            <div
              className={`tab ${isLogin ? "active" : ""}`}
              onClick={() => switchTab(true)}
            >
              Login
            </div>
            <div
              className={`tab ${!isLogin ? "active" : ""}`}
              onClick={() => switchTab(false)}
            >
              Sign Up
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                placeholder="Enter Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          {isLogin && (
            <div
              className="forgot"
              onClick={() => openModal("forgot", "Reset Password")}
            >
              Forgot password?
            </div>
          )}

          <button
            className="primary-btn"
            onClick={isLogin ? handleLogin : handleSignup}
          >
            {isLogin ? "Login" : "Create Account"}
          </button>

          {isLogin && (
            <>
              <button
                className="google-btn"
                onClick={() => openModal("google", "Login with Google")}
              >
                <FcGoogle size={18} />
                Continue with Google
              </button>

              <button
                className="phone-btn"
                onClick={() => openModal("phone", "Login with Phone")}
              >
                <FaPhoneAlt size={16} />
                Continue with Phone
              </button>
            </>
          )}

        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{modalTitle}</h2>

            {modalStep === "input" && (
              <input
                className="modal-input"
                placeholder={
                  modalType === "phone"
                    ? "Enter Phone Number"
                    : "Enter Email"
                }
                value={modalValue}
                onChange={(e) => setModalValue(e.target.value)}
              />
            )}

            {modalStep === "otp" && (
              <input
                className="modal-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            )}

            {modalStep === "message" && (
              <div className="success-message">
                {modalMessage}
              </div>
            )}

            <div className="modal-buttons">

              {modalStep !== "message" && (
                <button
                  className="modal-cancel"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              )}

              <button
                className="modal-continue"
                onClick={handleModalContinue}
              >
                Continue
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}