import React from "react";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">🛡️ InsureLogic</div>

      <ul>
        <li>Dashboard</li>
        <li>Browse Policies</li>
        <li>Compare Policies</li>
        <li className="active">✨ Recommendations</li>
        <li>My Policies</li>
        <li>Claims</li>
        <li>Add Policy Manually</li>
        <li>Profile</li>
        <li>Logout</li>
      </ul>
    </div>
  );
}

export default Sidebar;