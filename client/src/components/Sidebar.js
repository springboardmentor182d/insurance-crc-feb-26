import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-menu">
        <h3>Menu</h3>
        
        <ul>
          <li>
            <Link to="/" className="menu-link">
              🏠 Home
            </Link>
          </li>
          
          <li>
            <Link to="/compare" className="menu-link">
              ⚖️ Compare Plans
            </Link>
          </li>
          
          <li>
            <Link to="/recommendation" className="menu-link">
              💡 Get Recommendation
            </Link>
          </li>
          
          <li>
            <Link to="/claim" className="menu-link">
              📝 Submit Claim
            </Link>
          </li>
          
          <li>
            <Link to="/login" className="menu-link">
              🔑 Login
            </Link>
          </li>
          
          <li>
            <Link to="/signup" className="menu-link">
              📋 Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
