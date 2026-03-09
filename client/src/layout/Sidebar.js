import React from 'react';
import './Sidebar.css';
import { LayoutDashboard, ShieldCheck, Repeat, Stars, FileText, UserCircle } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/> },
    { name: 'Policies', icon: <ShieldCheck size={20}/> },
    { name: 'Compare', icon: <Repeat size={20}/> },
    { name: 'Recommendations', icon: <Stars size={20}/>, active: true },
    { name: 'Claims', icon: <FileText size={20}/> },
    { name: 'Active Plans', icon: <ShieldCheck size={20}/> },
    { name: 'Profile', icon: <UserCircle size={20}/> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h2>InsureHub</h2>
        <p>Client Portal</p>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.name} className={`nav-item ${item.active ? 'active' : ''}`}>
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;