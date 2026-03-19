import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PolicyCatalog from "./pages/PolicyCatalog";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/policy-catalog" element={<PolicyCatalog />} />
      {/* Render the Login page by default if a user types a random URL */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;