import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful");
      } else {
        alert(data.detail || "Login Failed");
      }
    } catch {
      alert("Server Error");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/auth/google";
  };

  const handlePhoneLogin = async () => {
    const phone = prompt("Enter phone number:");
    if (!phone) return;

    await fetch("http://127.0.0.1:8000/auth/phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });

    alert("OTP Sent (check backend response)");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">

      <img src="/logo.png" className="w-24 mb-6" />

      <h1 className="text-5xl font-extrabold text-gray-900">
        InsureLogic
      </h1>

      <p className="text-gray-500 mt-2 mb-10 text-sm text-center">
        Smart Insurance Policy Comparison and Claim Management System
      </p>

      <div className="w-[430px] bg-white rounded-3xl shadow-md overflow-hidden">

        <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-6 text-white text-xl font-semibold">
          Customer Portal
        </div>

        <div className="flex text-center bg-gray-50">
          <div className="w-1/2 py-4 font-semibold text-gray-900">
            Login
          </div>
          <Link
            to="/signup"
            className="w-1/2 py-4 font-medium text-gray-400 hover:text-gray-700"
          >
            Sign Up
          </Link>
        </div>

        <form onSubmit={handleLogin} className="px-8 py-8 space-y-6">

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="text-purple-600 text-sm">
            Forgot password?
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-medium"
          >
            Login to Dashboard →
          </button>

          <div className="flex items-center my-3">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 py-3 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-100 transition"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>

          <button
            type="button"
            onClick={handlePhoneLogin}
            className="w-full border border-gray-300 py-3 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-100 transition"
          >
            <span className="text-lg">📱</span>
            <span className="text-gray-700 font-medium">
              Continue with Phone
            </span>
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;