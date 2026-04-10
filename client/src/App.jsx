import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";
import Users from "./Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/profile" />} />

        {/* Main pages */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/preferences" element={<Preferences />} />

        {/* Users page (API test) */}
        <Route path="/users" element={<Users />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;