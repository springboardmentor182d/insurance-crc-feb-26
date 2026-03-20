// 1. Imports
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";
import AdminDashboard from "./features/admin/pages/AdminDashboard";

// 2. App Component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect */}
        <Route path="/" element={<Navigate to="/profile" />} />

        {/* User Pages */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/preferences" element={<Preferences />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

// 3. Export
export default App;