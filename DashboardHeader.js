import React from 'react';

const DashboardHeader = () => {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Dashboard Overview</h1>
          <p className="header-subtitle">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        
        <div className="header-right">
          <div className="profile-avatar">
            <span>👤</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
