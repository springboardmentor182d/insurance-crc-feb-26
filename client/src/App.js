
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";
import PolicyCatalog from "./pages/PolicyCatalog";
import { Routes, Route } from "react-router-dom";
import Recommendation from "./pages/Recommendation";

function App() {
  return (
    <div>
      <h1>Internship Project</h1>
      <Signup />
      <Login />
    </div>
    <Routes>
      <Route path="/" element={<Recommendation />} />
      <Route path="/recommendation" element={<Recommendation />} />
    </Routes>
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Navbar />
          <Routes>
            <Route path="/policies" element={<PolicyCatalog />} />
            {/* Add more routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
  );
}

export default App;
export default App;export default App;export default App;
export default App;export default App;
