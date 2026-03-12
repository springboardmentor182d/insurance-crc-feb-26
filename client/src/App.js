import React from "react";
import Policies from "./pages/Policies";
import "./assets/global.css";

function App() {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>InsureHub</h2>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li className="active">Policies</li>
            <li>Compare</li>
            <li>Recommendations</li>
            <li>Claims</li>
            <li>Profile</li>
            <li className="logout">Logout</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <Policies />
      </main>
    </div>
  );
}

export default App;
