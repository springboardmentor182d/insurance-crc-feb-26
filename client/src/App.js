import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TOKEN_KEYS, ROUTES, ROLES } from "./data/constants";

import Home           from "./pages/Home";
import Login          from "./pages/Login";
import Signup         from "./pages/Signup";
import AdminLogin     from "./pages/AdminLogin";
import Profile        from "./pages/Profile";
import Preferences    from "./pages/Preferences";
import Settings       from "./pages/Settings";

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
  const user  = getStoredUser();

  if (!token || !user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (adminOnly && user.role !== ROLES.ADMIN) return <Navigate to={ROUTES.DASHBOARD} replace />;

  return children;
};

const Dashboard = () => {
  const user = getStoredUser();
  const handleLogout = () => {
    Object.values(TOKEN_KEYS).forEach((k) => localStorage.removeItem(k));
    window.location.href = ROUTES.LOGIN;
  };

  return (
    <div style={{ padding: 40, fontFamily: "Outfit, sans-serif" }}>
      <h1 style={{ color: "#1a47d1" }}>Welcome, {user?.name || "User"}!</h1>
      <p style={{ color: "#6b7280", marginTop: 8 }}>Role: {user?.role || "N/A"}</p>
      <button onClick={handleLogout} style={{ marginTop: 24, padding: "10px 24px", background: "#1a47d1", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
        Logout
      </button>
    </div>
  );
};

const AdminDashboard = () => {
  const user = getStoredUser();
  const handleLogout = () => {
    Object.values(TOKEN_KEYS).forEach((k) => localStorage.removeItem(k));
    window.location.href = ROUTES.LOGIN;
  };

  return (
    <div style={{ padding: 40, fontFamily: "Outfit, sans-serif" }}>
      <h1 style={{ color: "#1a47d1" }}>Admin Dashboard</h1>
      <p style={{ color: "#6b7280", marginTop: 8 }}>Logged in as: {user?.email || "Unknown"}</p>
      <button onClick={handleLogout} style={{ marginTop: 24, padding: "10px 24px", background: "#1a47d1", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
        Logout
      </button>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME}        element={<Home />} />
        <Route path={ROUTES.LOGIN}       element={<Login />} />
        <Route path={ROUTES.SIGNUP}      element={<Signup />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route path={ROUTES.DASHBOARD}       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path={ROUTES.PROFILE}         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path={ROUTES.PREFERENCES}     element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
        <Route path={ROUTES.SETTINGS}        element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}