import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Render the Login page by default if a user types a random URL */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;