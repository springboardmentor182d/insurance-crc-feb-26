import React from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ROLES, ROUTES, TOKEN_KEYS } from "./data/constants";


const getStoredUser = () => {
  const userRaw = localStorage.getItem(TOKEN_KEYS.USER);
  if (!userRaw || userRaw === "undefined") return null;
  try {
    return JSON.parse(userRaw);
  } catch {
    return null;
  }
};


const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
  const user = getStoredUser();

  if (!token || !user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (adminOnly && user.role !== ROLES.ADMIN) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
};


const UserDashboard = () => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    Object.values(TOKEN_KEYS).forEach((key) => localStorage.removeItem(key));
    navigate(ROUTES.LOGIN);
  };

  return (
    <div style={dashboardShellStyle}>
      <div style={dashboardCardStyle}>
        <h1 style={{ margin: 0, fontSize: "2rem" }}>Welcome, {user?.name || "User"}</h1>
        <p style={{ margin: "12px 0 0", color: "#64748b" }}>
          You are signed in to BimaVerse. The protected dashboard route is active and your auth flow is working.
        </p>
        <div style={linkRowStyle}>
          <Link to={ROUTES.FORGOT_PASSWORD} style={secondaryLinkStyle}>Forgot Password</Link>
          <button type="button" onClick={handleLogout} style={primaryButtonStyle}>Logout</button>
        </div>
      </div>
    </div>
  );
};


const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    Object.values(TOKEN_KEYS).forEach((key) => localStorage.removeItem(key));
    navigate(ROUTES.ADMIN_LOGIN);
  };

  return (
    <div style={dashboardShellStyle}>
      <div style={dashboardCardStyle}>
        <h1 style={{ margin: 0, fontSize: "2rem" }}>Admin Dashboard</h1>
        <p style={{ margin: "12px 0 0", color: "#64748b" }}>
          Signed in as {user?.email || "admin"} with protected admin access.
        </p>
        <div style={linkRowStyle}>
          <Link to={ROUTES.LOGIN} style={secondaryLinkStyle}>Back to user login</Link>
          <button type="button" onClick={handleLogout} style={primaryButtonStyle}>Logout</button>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
        <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}


const dashboardShellStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "24px",
  background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
};

const dashboardCardStyle = {
  width: "min(100%, 720px)",
  background: "#ffffff",
  border: "1px solid #dbe4ff",
  borderRadius: "24px",
  padding: "32px",
  boxShadow: "0 18px 40px rgba(37, 99, 235, 0.12)",
};

const linkRowStyle = {
  marginTop: "24px",
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const primaryButtonStyle = {
  border: 0,
  borderRadius: "12px",
  padding: "12px 18px",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryLinkStyle = {
  color: "#1d4ed8",
  fontWeight: 600,
  textDecoration: "none",
};
