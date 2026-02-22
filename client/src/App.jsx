import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import logo from "./assets/logo.png";

function App() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">

      {/* Logo */}
      <img src={logo} alt="logo" className="w-24 mb-4" />

      <h1 className="text-4xl font-bold text-gray-800">InsureLogic</h1>
      <p className="text-gray-500 mb-8 text-center">
        Smart Insurance Policy Comparison and Claim Management System
      </p>

      <div className="bg-white rounded-2xl shadow-lg w-[420px] overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 text-lg font-semibold">
          Customer Portal
        </div>

        {/* Toggle Buttons */}
        <div className="flex bg-gray-100 m-4 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 rounded-lg font-medium ${
              activeTab === "login"
                ? "bg-white shadow text-gray-800"
                : "text-gray-500"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2 rounded-lg font-medium ${
              activeTab === "signup"
                ? "bg-white shadow text-gray-800"
                : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {activeTab === "login" ? <Login /> : <Signup />}
        </div>
      </div>
    </div>
  );
}

export default App;