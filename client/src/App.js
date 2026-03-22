import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Preferences from './pages/Preferences';
import Settings from './pages/Settings';
import BrowsePolicies from './pages/BrowsePolicies';
import ActivePolicies from './pages/ActivePolicies';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/policies/browse" element={<BrowsePolicies />} />
        <Route path="/policies/active" element={<ActivePolicies />} />
      </Routes>
    </Router>
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ROLES, ROUTES, TOKEN_KEYS } from "./data/constants";

import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ManagePolicies from "./pages/ManagePolicies";
import Preferences from "./pages/Preferences";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import FraudRules from "./pages/admin/FraudRules";
import FlaggedClaims from "./pages/admin/FlaggedClaims";
import DashboardPage from "./pages/Dashboard";

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

  console.log("🛡️ ProtectedRoute:", window.location.pathname, {
    hasToken: !!token,
    role: user?.role,
    adminOnly
  });

  if (!token || !user) {
    console.log("❌ No token/user — redirecting to login");
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  if (adminOnly && user.role !== ROLES.ADMIN) {
    console.log("❌ Not admin — redirecting to dashboard");
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

const AdminLoginGuard = ({ children }) => {
  const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
  const user = getStoredUser();
  if (token && user && user.role === ROLES.ADMIN) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }
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
      <button
        onClick={handleLogout}
        style={{
          marginTop: 24,
          padding: "10px 24px",
          background: "#1a47d1",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Logout
      </button>

      <div style={{ marginTop: 40 }}>
        <DashboardPage />
      </div>
    </div>
  );
}

export default App;


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public Routes ── */}
        <Route path={ROUTES.HOME}    element={<Home />} />
        <Route path={ROUTES.LOGIN}   element={<Login />} />
        <Route path={ROUTES.SIGNUP}  element={<Signup />} />

        {/* Admin login redirects to dashboard if already logged in as admin */}
        <Route
          path={ROUTES.ADMIN_LOGIN}
          element={
            <AdminLoginGuard>
              <AdminLogin />
            </AdminLoginGuard>
          }
        />

        {/* ── User Protected Routes ── */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PREFERENCES}
          element={
            <ProtectedRoute>
              <Preferences />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ── Admin Protected Routes ── */}
        {/* ROUTES.ADMIN_DASHBOARD = "/admin/dashboard" */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-policies"
          element={
            <ProtectedRoute adminOnly>
              <ManagePolicies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fraud-rules"
          element={
            <ProtectedRoute adminOnly>
              <FraudRules />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/flagged-claims"
          element={
            <ProtectedRoute adminOnly>
              <FlaggedClaims />
            </ProtectedRoute>
          }
        />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
