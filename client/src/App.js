import { RiDashboardLine, RiFileList3Line, RiStarLine, RiFileWarningLine, RiUserLine, RiSettings4Line } from 'react-icons/ri';
import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Profile from "./pages/Profile";
import "./index.css";
import Preferences from "./pages/Preferences";

const Dashboard = () => <div style={{ padding: 32 }}><h1>Dashboard</h1></div>;
const Policies = () => <div style={{ padding: 32 }}><h1>Policies</h1></div>;
const Recommendations = () => <div style={{ padding: 32 }}><h1>Recommendations</h1></div>;
const Claims = () => <div style={{ padding: 32 }}><h1>Claims</h1></div>;


function App() {
  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
        <aside style={{
          width: 220, background: "#fff", borderRight: "1px solid #e5e7eb",
          display: "flex", flexDirection: "column", padding: "24px 0",
          position: "fixed", top: 0, bottom: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px 32px" }}>
            <div style={{
              width: 36, height: 36, background: "#4F46E5", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700
            }}>A</div>
            <span style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>InsureAI</span>
          </div>
          {[
 { to: "/", label: "Dashboard", icon: <RiDashboardLine size={18}/> },
{ to: "/policies", label: "Policies", icon: <RiFileList3Line size={18}/> },
{ to: "/recommendations", label: "Recommendations", icon: <RiStarLine size={18}/> },
{ to: "/claims", label: "Claims", icon: <RiFileWarningLine size={18}/> },
{ to: "/profile", label: "Profile", icon: <RiUserLine size={18}/> },
{ to: "/preferences", label: "Preferences", icon: <RiSettings4Line size={18}/> },
].map(({ to, label, icon }) => (
  <NavLink key={to} to={to} end={to === "/"}
    style={({ isActive }) => ({
      display: "flex", alignItems: "center", gap: "10px",
      padding: "10px 20px", fontSize: 14, fontWeight: 500,
      color: isActive ? "#4F46E5" : "#374151",
      background: isActive ? "#EEF2FF" : "transparent",
      textDecoration: "none",
      borderLeft: isActive ? "3px solid #4F46E5" : "3px solid transparent",
    })}>
   {icon}
    {label}
  </NavLink>
))}
          <div style={{ marginTop: "auto", padding: "0 20px" }}>
            <button style={{ background: "none", border: "none", color: "#6b7280", fontSize: 14, cursor: "pointer", padding: "10px 0" }}>
              ← Logout
            </button>
          </div>
        </aside>
        <main style={{ marginLeft: 220, flex: 1, background: "#f9fafb" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/preferences" element={<Preferences />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;