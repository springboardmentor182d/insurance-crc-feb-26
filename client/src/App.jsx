import { Routes, Route, Navigate } from "react-router-dom";

// Existing pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

// Fraud pages
import FraudDashboard from "./pages/FraudDashboard";
import FraudRules from "./pages/FraudRules";

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Login />} />

      {/* Existing */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />

      {/* Fraud Module */}
      <Route path="/fraud-dashboard" element={<FraudDashboard />} />
      <Route path="/fraud-rules" element={<FraudRules />} />

      {/* Default fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;