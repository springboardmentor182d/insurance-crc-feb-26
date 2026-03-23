import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Repeat,
  Stars,
  FileText,
  UserCircle,
  Shield,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  // Navigation items structure
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/dashboard' },
    { name: 'Policies', icon: <ShieldCheck size={20}/>, path: '/policies' },
    { name: 'Compare', icon: <Repeat size={20}/>, path: '/compare' },
    { name: 'Recommendations', icon: <Stars size={20}/>, path: '/recommendations' },
    { name: 'Claims', icon: <FileText size={20}/>, path: '/claims' },
    { name: 'Active Plan', icon: <Shield size={20}/>, path: '/active-plan' },
    { name: 'Profile', icon: <UserCircle size={20}/>, path: '/profile' },
  ];

  return (
    <aside className="sidebar-container">
      {/* Branding Section */}
      <div className="sidebar-brand">
        <h2 className="brand-logo">InsureHub</h2>
        <span className="brand-subtext">Client Portal</span>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-links">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <span className="nav-link-icon">{item.icon}</span>
            <span className="nav-link-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;