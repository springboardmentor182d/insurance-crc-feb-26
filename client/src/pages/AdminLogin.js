import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../features/authentication/services/getUsers";
import { ROUTES, TOKEN_KEYS } from "../data/constants";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", admin_secret: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginAdmin(form);
      localStorage.setItem(TOKEN_KEYS.ACCESS, data.access_token);
      localStorage.setItem(TOKEN_KEYS.REFRESH, data.refresh_token);
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user));
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-left admin-left">
        <div className="auth-brand"><span>BimaVerse</span></div>
        <div className="auth-left-content"><h1>Secure Admin Access</h1><p>Restricted area. Authorized personnel only.</p></div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header"><h2>Admin Login</h2><p>Enter your credentials and secret key</p></div>
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-field"><label>Admin Email</label><div className="auth-input-wrap"><input type="email" name="email" value={form.email} onChange={handleChange} required /></div></div>
            <div className="auth-field"><label>Password</label><div className="auth-input-wrap"><input type="password" name="password" value={form.password} onChange={handleChange} required /></div></div>
            <div className="auth-field"><label>Admin Secret Key</label><div className="auth-input-wrap"><input type="password" name="admin_secret" value={form.admin_secret} onChange={handleChange} required /></div></div>
            <button type="submit" className="auth-btn-primary" disabled={loading}>{loading ? <span className="auth-spinner" /> : "Secure Admin Login"}</button>
          </form>
          <div className="auth-back-row"><Link to={ROUTES.LOGIN} className="auth-back-link-inline">Back to User Login</Link></div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
