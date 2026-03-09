import React from "react";
import "../styles/AdminDashboard.css";

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 11.5c0-3.6 2.9-6.5 6.5-6.5h3c3.6 0 6.5 2.9 6.5 6.5v1c0 3.6-2.9 6.5-6.5 6.5h-3C6.9 19 4 16.1 4 12.5v-1z"
            fill="currentColor"
            opacity="0.25"
          />
          <path d="M7 13h4v4H7v-4zm6-6h4v10h-4V7z" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "users",
      label: "Users",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 18.5c0-3 2.5-5.5 5.5-5.5h3c3 0 5.5 2.5 5.5 5.5V20H5v-1.5z"
            fill="currentColor"
            opacity="0.25"
          />
          <path d="M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "policies",
      label: "Policies",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
            fill="currentColor"
            opacity="0.25"
          />
          <path d="M8 7h8v2H8V7zm0 4h6v2H8v-2zm0 4h8v2H8v-2z" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "claims",
      label: "Claims Management",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
            fill="currentColor"
            opacity="0.25"
          />
          <path d="M8 7h8v2H8V7zm0 4h6v2H8v-2zm0 4h8v2H8v-2z" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "fraudRules",
      label: "Fraud Rules",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6.5 5h11a2.5 2.5 0 0 1 2.5 2.5V18l-3-2H6.5A2.5 2.5 0 0 1 4 13.5v-6A2.5 2.5 0 0 1 6.5 5z"
            fill="currentColor"
            opacity="0.25"
          />
          <path d="M8 9h8v2H8V9zm0 4h5v2H8v-2z" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "activePolicies",
      label: "Active Policies",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            fill="currentColor"
            opacity="0.25"
          />
          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 19h16v2H4v-2z"
            fill="currentColor"
            opacity="0.3"
          />
          <path d="M6 11h3v6H6v-6zm5-4h3v10h-3V7zm5 2h3v8h-3V9z" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div>
          <h2 className="sidebar-title">InsureHub</h2>
          <p className="sidebar-subtitle">Admin Portal</p>
        </div>
        <span className="sidebar-badge">Live</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${activeSection === item.id ? "active" : ""}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="sidebar-item-content">
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </span>
            <span className="sidebar-dot" />
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
