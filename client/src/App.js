import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import FraudDetection from "./pages/FraudDetection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="fraud-detection" element={<FraudDetection />} />
          <Route path="/admin-dashboard/fraud-detection" element={<FraudDetection />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;