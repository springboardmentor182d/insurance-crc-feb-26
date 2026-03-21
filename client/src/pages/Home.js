import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../data/constants";
import Sidebar from "../layout/user/Sidebar";

const Home = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <Sidebar />

      <div style={{ marginLeft: 256, padding: "60px 40px", fontFamily: "Outfit, sans-serif", textAlign: "center" }}>
        <h1 style={{ fontSize: 40, color: "#1a47d1", marginBottom: 16 }}>BimaVerse</h1>
        <p style={{ fontSize: 18, color: "#6b7280", marginBottom: 32 }}>
          Insurance Comparison, Recommendation & Claim Assistant
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <Link to={ROUTES.LOGIN} style={{ padding: "12px 28px", background: "#1a47d1", color: "white", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
            Sign In
          </Link>
          <Link to={ROUTES.SIGNUP} style={{ padding: "12px 28px", border: "2px solid #1a47d1", color: "#1a47d1", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
