import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignForm = () => {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const baseURL = process.env.REACT_APP_BASE_URL;

  const handleSignup = async (e) => {

    e.preventDefault();

    if(password !== confirmPassword){
      alert("Passwords do not match");
      return;
    }

    try {

      const response = await fetch(`${baseURL}/signup`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          name:name,
          email:email,
          password:password
        })
      });

      const data = await response.json();

      alert(data.message);

      navigate("/login");

    } catch(error){

      console.error(error);
      alert("Signup failed");

    }

  };

  return (

    <div className="auth-container">

      <div className="left-panel">

        <h1>InsureHub</h1>

        <h2>Create Your Account</h2>

        <p>
          Join InsureHub to compare policies,
          manage claims, and protect what matters most.
        </p>

      </div>


      <div className="right-panel">

        <h2>Sign Up</h2>

        <p>Create your new account</p>

        <form onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
          />

          <button type="submit">
            Sign Up
          </button>

        </form>

        <p className="signup-text">
          Already have an account?
          <span onClick={()=>navigate("/login")}>
            Sign in
          </span>
        </p>

      </div>

    </div>

  );

};

export default SignForm;