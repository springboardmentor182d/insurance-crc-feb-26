import React, { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser, toggleUserStatus } from "../services/adminService";
import "../styles/AdminDashboard.css";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchUsers();
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

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await createUser(newUser);
      setNewUser({ name: "", email: "" });
      setShowAddModal(false);
      fetchUsers();
    } catch (err) {
      alert("Failed to add user. Email might already exist.");
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user");
        console.error(err);
      }
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await toggleUserStatus(userId);
      fetchUsers();
    } catch (err) {
      alert("Failed to update user status");
      console.error(err);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="users-section">
      <div className="section-header">
        <div>
          <h2>Users Management</h2>
          <p className="section-subtitle">Manage onboarding, access, and account status.</p>
        </div>
        <div className="header-actions">
          <span className="pill">Total: {users.length}</span>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Add User
          </button>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
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
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(user)}
                      title="View Details"
                    >
                      <span className="btn-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path
                            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      View
                    </button>
                    <button
                      className="btn-toggle"
                      onClick={() => handleToggleStatus(user.id)}
                      title="Toggle Status"
                    >
                      <span className="btn-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path
                            d="M12 5a7 7 0 1 1-6.4 4H3l3.5-3.5L10 9H7.6A5 5 0 1 0 12 7V5z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      {user.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete User"
                    >
                      <span className="btn-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path
                            d="M6 7h12l-1 13H7L6 7zm3-3h6l1 2H8l1-2z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Add New User</h3>
            <input
              type="text"
              placeholder="Name"
              className="input-field"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleAddUser}>
                Add User
              </button>
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>User Details</h3>
            <div className="user-details">
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{selectedUser.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedUser.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedUser.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${selectedUser.status.toLowerCase()}`}>
                  {selectedUser.status}
                </span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
