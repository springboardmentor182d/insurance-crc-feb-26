import React from "react";
import "./Sidebar.css"; // optional styling

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>Dashboard</li>
        <li>Policies</li>
        <li>Compare</li>
        <li>Recommendations</li>
        <li>Claims</li>
        <li>Profile</li>
        <li>Logout</li>
      </ul>
    </div>
  );
}

export default Sidebar;