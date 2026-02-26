import React from "react";

function Sidebar({ isOpen, closeSidebar }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${isOpen ? "show" : ""}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>BimaVerse</h2>
          <span className="close-btn" onClick={closeSidebar}>
            ✕
          </span>
        </div>

        <div className="sidebar-menu">
          <div className="sidebar-item active">🏠 Dashboard</div>
          <div className="sidebar-item">📊 Recommendations</div>
          <div className="sidebar-item">💰 Savings</div>
          <div className="sidebar-item">🛡️ Policies</div>
          <div className="sidebar-item">⚙️ Settings</div>
          <div className="sidebar-item logout">🚪 Logout</div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;