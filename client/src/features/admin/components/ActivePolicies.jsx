import React, { useState, useEffect } from "react";
import { getUsers } from "../services/adminService";
import "../styles/AdminDashboard.css";

const ActivePolicies = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    // Refresh every 5 seconds to stay in sync with UsersTable
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalActive: users.filter((u) => u.status?.toLowerCase() === "active").length,
    usersWithPlans: users.length,
  };

  return (
    <div>
      {loading && <div className="loading">Loading users with active policies...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          {/* Overview Cards */}
          <div className="overview-cards" style={{ marginBottom: "36px" }}>
            <div className="overview-card">
              <div className="card-top">
                <div>
                  <p className="card-title">Total Active Users</p>
                  <p className="card-value">{stats.totalActive}</p>
                </div>
                <div className="card-icon">
                  <span style={{ fontSize: "20px" }}>🛡️</span>
                </div>
              </div>
            </div>

            <div className="overview-card">
              <div className="card-top">
                <div>
                  <p className="card-title">Total Registered Users</p>
                  <p className="card-value">{stats.usersWithPlans}</p>
                </div>
                <div className="card-icon">
                  <span style={{ fontSize: "20px" }}>👥</span>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
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
                      <td colSpan="4" className="no-data">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          <span className="user-cell">
                            <span className="user-avatar" aria-hidden="true">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                            <span className="user-name">{user.name}</span>
                          </span>
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
        </>
      )}
    </div>
  );
};

export default ActivePolicies;
