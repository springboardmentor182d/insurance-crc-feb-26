import React from "react";

function Header() {
  return (
    <div className="header">
      <h2>AI Recommendations</h2>
      <div className="user">
        <span>👤 John Doe</span>
        <button className="logout-btn">Logout</button>
      </div>
    </div>
  );
}

export default Header;