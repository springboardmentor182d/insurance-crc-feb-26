import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { TOKEN_KEYS, ROUTES } from "../data/constants";
import { logoutUser } from "../features/authentication/services/getUsers";

const Navbar = () => {
  const navigate = useNavigate();
  const userRaw = localStorage.getItem(TOKEN_KEYS.USER);
  const user = userRaw ? JSON.parse(userRaw) : null;

  const handleLogout = async () => {
    await logoutUser();
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <Link to={ROUTES.HOME} className="navbar-logo">BimaVerse</Link>
      </div>
      <div className="navbar-links">
        <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
        <Link to="/policies">Policies</Link>
        <Link to="/claims">Claims</Link>
      </div>
      <div className="navbar-user">
        {user ? (
          <>
            <span className="navbar-username">{user.name}</span>
            <button onClick={handleLogout} className="navbar-logout-btn">Logout</button>
          </>
        ) : (
          <Link to={ROUTES.LOGIN} className="auth-btn-primary">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;