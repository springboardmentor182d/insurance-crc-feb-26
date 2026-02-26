import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/profile" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/preferences" element={<Preferences />} />
      </Routes>
    </Router>
  );
}

export default App;