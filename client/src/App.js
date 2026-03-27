import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";
import FlaggedClaims from "./pages/admin/FlaggedClaims";
import ActivePolicies from './pages/ActivePolicies';
//import Recommendations from "./pages/Recommendations";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Main Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
   
        {/* Sidebar routes */}
         { <Route path="/Activepolicies" element={<ActivePolicies />} /> }
        {/* <Route path="/recommendations" element={<Recommendations />} /> */}
        { <Route path="/claims" element={<FlaggedClaims />} /> }
        <Route path="/profile" element={<Profile />} />
        <Route path="/preferences" element={<Preferences />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;