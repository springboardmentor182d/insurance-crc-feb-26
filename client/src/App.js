import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ROLES, ROUTES, TOKEN_KEYS } from "./data/constants";

// Theme
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/theme.css";

import ActivePolicies from "./pages/ActivePolicies";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import BrowsePolicies from "./pages/BrowsePolicies";
import DashboardPage from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ManagePolicies from "./pages/ManagePolicies";
import Preferences from "./pages/Preferences";
import Profile from "./pages/Profile";
import Recommendations from "./pages/Recommendations";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import FlaggedClaims from "./pages/admin/FlaggedClaims";
import FraudRules from "./pages/admin/FraudRules";
import ManageClaims from './pages/admin/ManageClaims';
import Claims from "./pages/claims";
import NewClaim from "./pages/NewClaim";
import ClaimDetails from "./pages/ClaimDetails";
import PolicyApprovals from "./pages/admin/PolicyApprovals";



// Helpers
const getStoredUser = () => {
  const userRaw = localStorage.getItem(TOKEN_KEYS.USER);
  if (!userRaw || userRaw === "undefined") return null;
  try { return JSON.parse(userRaw); } catch { return null; }
};

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
  const user = getStoredUser();
  if (!token || !user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (adminOnly && user.role !== ROLES.ADMIN)
    return <Navigate to={ROUTES.DASHBOARD} replace />;

  return children;
};

// Admin Login Guard
const AdminLoginGuard = ({ children }) => {
  const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
  const user = getStoredUser();
  if (token && user && user.role === ROLES.ADMIN) return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  return children;
};

// App Component
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public ── */}
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginGuard><AdminLogin /></AdminLoginGuard>} />

          {/* ── User protected ── */}
          <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path={ROUTES.PROFILE} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path={ROUTES.PREFERENCES} element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
          <Route path={ROUTES.SETTINGS} element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path={ROUTES.BROWSE_POLICIES} element={<ProtectedRoute><BrowsePolicies /></ProtectedRoute>} />
          <Route path={ROUTES.ACTIVE_POLICIES} element={<ProtectedRoute><ActivePolicies /></ProtectedRoute>} />
          <Route path={ROUTES.RECOMMENDATIONS} element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
          {/* ✅ CLAIM ROUTES (FIXED) */}
          <Route path="/claims" element={<ProtectedRoute><Claims /></ProtectedRoute>} />
          <Route path="/claims/new" element={<ProtectedRoute><NewClaim /></ProtectedRoute>} />
          <Route path="/claims/:id" element={<ProtectedRoute><ClaimDetails /></ProtectedRoute>} />
          {/* ── Admin protected ── */}
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/manage-policies" element={<ProtectedRoute adminOnly><ManagePolicies /></ProtectedRoute>} />
          <Route path="/admin/fraud-rules" element={<ProtectedRoute adminOnly><FraudRules /></ProtectedRoute>} />
          <Route path="/admin/flagged-claims" element={<ProtectedRoute adminOnly><FlaggedClaims /></ProtectedRoute>} />
          <Route path="/admin/policy-approvals" element={<ProtectedRoute adminOnly><PolicyApprovals /></ProtectedRoute>} />

          <Route path="/admin/manage-claims" element={<ProtectedRoute adminOnly><ManageClaims /></ProtectedRoute>} />


          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider >
  );
}