import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch("http://127.0.0.1:8000/login", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })

      });

      const data = await response.json();

      if(response.ok){

        alert("Login successful");

      }else{

        alert(data.detail);

      }

    } catch(error){

      alert("Login failed");

    }

  };

  const handleForgotPassword = async () => {

    const userEmail = prompt("Enter your registered email:");

    if(!userEmail) return;

    const newPassword = prompt("Enter your new password:");

    if(!newPassword) return;

    try{

      const response = await fetch("http://127.0.0.1:8000/forgot-password",{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body: JSON.stringify({
          email:userEmail,
          new_password:newPassword
        })

      });

      const data = await response.json();

      if(response.ok){

        alert("Password reset successful. You can now login.");

      }else{

        alert(data.detail);

      }

    }catch(error){

      alert("Error resetting password");

    }

  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

      <div className="mb-6 flex flex-col items-center">

        <img src={logo} alt="InsureLogic" className="w-24 h-24 mb-3"/>

        <h1 className="text-4xl font-bold text-gray-800 mb-1">
          InsureLogic
        </h1>

        <p className="text-gray-500 text-sm whitespace-nowrap">
          Smart Insurance Policy Comparison and Claim Management System
        </p>

      </div>

      <div className="w-[420px] bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-5 text-white">

          <h2 className="font-semibold text-lg">
            Customer Portal
          </h2>

        </div>

        <div className="flex bg-gray-100 m-4 rounded-lg p-1">

          <button className="flex-1 bg-white rounded-md py-2 font-semibold shadow-sm">
            Login
          </button>

          <Link to="/signup" className="flex-1 text-center py-2 text-gray-500 font-semibold">
            Sign Up
          </Link>

        </div>

        <form onSubmit={handleLogin} className="px-6 pb-6">

          <div className="mb-4">

            <label>Email Address</label>

            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />

          </div>

          <div className="mb-2">

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />

          </div>

          <div className="flex justify-between mb-4 text-sm">

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-purple-600"
            >
              Forgot password?
            </button>

          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg"
          >
            Login to Dashboard →
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;