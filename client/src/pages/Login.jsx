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
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");

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

  const handleSignup = async () => {

    // ✅ Required fields validation
    if (!name || !email || !password || !confirmPassword || !phone || !address || !dob) {
      setModalTitle("Signup Error");
      setModalMessage("Please fill all fields");
      setModalStep("message");
      setModalOpen(true);
      return;
    }

    // ✅ Password match
    if (password !== confirmPassword) {
      setModalTitle("Signup Error");
      setModalMessage("Passwords do not match");
      setModalStep("message");
      setModalOpen(true);
      return;
    }

    // ✅ Age validation (better version)
    const today = new Date();
    const birthDate = new Date(dob);

    const age =
      today.getFullYear() -
      birthDate.getFullYear() -
      (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);

    if (age < 18) {
      setModalTitle("Signup Error");
      setModalMessage("You must be at least 18 years old");
      setModalStep("message");
      setModalOpen(true);
      return;
    }

    try {
      await signupUser(name, email, password, phone, address, dob);

      setModalTitle("Signup Status");
      setModalMessage("Account Created Successfully!");
      setModalStep("message");
      setModalOpen(true);

      resetForm();
      setIsLogin(true);

    } catch (err) {
      setModalTitle("Signup Error");

      const errorData = err.response?.data?.detail;

      // ✅ FIX: handle FastAPI validation errors
      if (Array.isArray(errorData)) {
        const messages = errorData.map(e => e.msg).join(", ");
        setModalMessage(messages);
      } else {
        setModalMessage(errorData || "Signup failed. Try again.");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-200 to-purple-300 px-4">

      <div className="text-center mb-6">
        <img src="/src/assets/logo.png" alt="logo" className="w-14 h-14 mx-auto mb-2" />
        <h1 className="text-2xl md:text-3xl font-bold">InsureLogic</h1>
        <p className="text-sm text-gray-600 px-2">
          Smart Insurance Policy Comparison and Claim Management System
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-3 font-semibold">
          Customer Portal
        </div>

        <div className="p-6 space-y-4">

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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}{!isLogin && (
            <>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  type="date"

                  max={new Date().toISOString().split("T")[0]}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </>
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
            type="button"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
