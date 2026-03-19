import React, { useState, useEffect, useCallback } from "react";
import { getUsers } from "../services/adminService";
import "../styles/AdminDashboard.css";

const ActivePolicies = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback prevents unnecessary re-renders of the fetch function
  const fetchUsers = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) setLoading(true);
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(true); // Initial load with spinner
    
    const interval = setInterval(() => fetchUsers(false), 5000); // Silent background refresh
    return () => clearInterval(interval);
  }, [fetchUsers]);

  const stats = {
    totalActive: users.filter((u) => u.status?.toLowerCase() === "active").length,
    totalUsers: users.length,
  };

  if (loading) return <div className="loading">Loading user policy data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="active-policies-container">
      {/* Overview Cards */}
      <div className="overview-cards" style={{ marginBottom: "36px" }}>
        <StatCard title="Total Active Users" value={stats.totalActive} icon="🛡️" />
        <StatCard title="Total Registered Users" value={stats.totalUsers} icon="👥" />
      </div>

      {/* Users Section */}
      <div className="users-section">
        <div className="section-header">
          <div>
            <h2>All Users</h2>
            <p className="section-subtitle">Registered users in the system</p>
          </div>
          <div className="header-actions">
            <span className="pill">Total: {users.length}</span>
          </div>
        </div>

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <div className="user-cell">
                        <span className="user-avatar">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status-badge ${user.status?.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sub-component for cleaner JSX
const StatCard = ({ title, value, icon }) => (
  <div className="overview-card">
    <div className="card-top">
      <div>
        <p className="card-title">{title}</p>
        <p className="card-value">{value}</p>
      </div>
      <div className="card-icon">
        <span style={{ fontSize: "20px" }}>{icon}</span>
      </div>
    </div>
  </div>
);

export default ActivePolicies;