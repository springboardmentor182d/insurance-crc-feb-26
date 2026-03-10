import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/policies', label: 'Policy Management', icon: '📋' },
    { path: '/claims', label: 'Claims Management', icon: '📝' },
    { path: '/fraud', label: 'Fraud Detection', icon: '⚠️' },
    { path: '/users', label: 'User Management', icon: '👥' },
    { path: '/reports', label: 'Reports & Analytics', icon: '📈' }
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">
        <h1>InsureAdmin</h1>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
