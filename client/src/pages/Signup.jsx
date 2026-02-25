import { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup Successful");
      } else {
        alert(data.detail || "Signup Failed");
      }
    } catch (error) {
      alert("Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <img
        src="/logo.png"
        alt="InsureLogic"
        className="w-20 mb-4"
      />

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800">
        InsureLogic
      </h1>

      {/* Subtitle */}
      <p className="text-gray-500 mt-2 mb-8 text-center">
        Smart Insurance Policy Comparison and Claim Management System
      </p>

      {/* Card */}
      <div className="w-[420px] bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header with icon + subtitle */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">

          <div className="flex items-center space-x-3">
            <div className="bg-white/30 rounded-full p-2">
              👤
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Customer Portal
              </h2>
              <p className="text-sm text-white/90">
                Access your policies and claims
              </p>
            </div>
          </div>

        </div>

        {/* Tabs */}
        <div className="flex text-center border-b">
          <Link
            to="/login"
            className="w-1/2 py-3 font-medium text-gray-400 hover:text-gray-700"
          >
            Login
          </Link>
          <div className="w-1/2 py-3 font-medium text-gray-800 border-b-2 border-purple-500">
            Sign Up
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="p-6 space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Create Account
          </button>

        </form>
      </div>
    </div>
  );
}

export default Signup;