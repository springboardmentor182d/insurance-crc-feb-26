import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardSidebar from './components/DashboardSidebar';

// Import pages
import Home from './pages/Home';
import CompareInsurance from './pages/CompareInsurance';
import Recommendation from './pages/Recommendation';
import ClaimAssistant from './pages/ClaimAssistant';
import Login from './pages/Login';
import Signup from './pages/Signup';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="main-container">
          <DashboardSidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/compare" element={<CompareInsurance />} />
              <Route path="/recommendation" element={<Recommendation />} />
              <Route path="/claim" element={<ClaimAssistant />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
