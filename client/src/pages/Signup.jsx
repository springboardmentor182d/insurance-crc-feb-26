import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if(password !== confirmPassword){
      alert("Passwords do not match");
      return;
    }

    alert("Signup functionality connected to backend next.");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

      {/* Logo */}
      <div className="mb-6 flex flex-col items-center">

        <img
          src={logo}
          alt="InsureLogic"
          className="w-24 h-24 object-contain mb-3"
        />

        <h1 className="text-4xl font-bold text-gray-800 mb-1">
          InsureLogic
        </h1>

        <p className="text-gray-500 text-sm whitespace-nowrap">
          Smart Insurance Policy Comparison and Claim Management System
        </p>

      </div>

      {/* Card */}
      <div className="w-[420px] bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-5 text-white">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg">
              👤
            </div>

            <div>
              <h2 className="font-semibold text-lg">
                Customer Portal
              </h2>

              <p className="text-sm opacity-90">
                Access your policies and claims
              </p>

            </div>

          </div>

        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 m-4 rounded-lg p-1">

          <Link
            to="/"
            className="flex-1 text-center py-2 text-gray-500 font-semibold"
          >
            Login
          </Link>

          <button className="flex-1 bg-white rounded-md py-2 font-semibold shadow-sm">
            Sign Up
          </button>

        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="px-6 pb-6">

          {/* Name */}
          <div className="mb-4">

            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              required
            />

          </div>

          {/* Email */}
          <div className="mb-4">

            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>

            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              required
            />

          </div>

          {/* Password */}
          <div className="mb-4">

            <label className="block text-sm font-medium mb-1">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              required
            />

          </div>

          {/* Confirm Password */}
          <div className="mb-4">

            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              required
            />

          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Create Account
          </button>

        </form>

      </div>

    </div>
  );
}

export default Signup;
