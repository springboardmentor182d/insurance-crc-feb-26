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


