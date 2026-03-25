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