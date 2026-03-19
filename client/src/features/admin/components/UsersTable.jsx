import React, { useEffect, useState, useCallback } from "react";
import { getUsers, createUser, deleteUser, toggleUserStatus } from "../services/adminService";
import "../styles/AdminDashboard.css";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal States
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'details' | null
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  // 1. Memoized Data Fetching
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load users management data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 2. Action Handlers
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) return alert("Please fill in all fields");

    try {
      await createUser(newUser);
      setNewUser({ name: "", email: "" });
      setActiveModal(null);
      fetchUsers();
    } catch (err) {
      alert("Failed to add user. Email might already exist.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await toggleUserStatus(userId);
      fetchUsers();
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  const openDetails = (user) => {
    setSelectedUser(user);
    setActiveModal("details");
  };

  if (loading && users.length === 0) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="users-section">
      <div className="section-header">
        <div>
          <h2>Users Management</h2>
          <p className="section-subtitle">Manage onboarding, access, and account status.</p>
        </div>
        <div className="header-actions">
          <span className="pill">Total: {users.length}</span>
          <button className="btn-primary" onClick={() => setActiveModal("add")}>
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
              <tr><td colSpan="5" className="no-data">No users found</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <ActionButton onClick={() => openDetails(user)} type="view" label="View" icon={<ViewIcon />} />
                    <ActionButton onClick={() => handleToggleStatus(user.id)} type="toggle" label={user.status === "Active" ? "Deactivate" : "Activate"} icon={<ToggleIcon />} />
                    <ActionButton onClick={() => handleDeleteUser(user.id)} type="delete" label="Delete" icon={<DeleteIcon />} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Unified Modal Logic */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {activeModal === "add" ? (
              <>
                <h3>Add New User</h3>
                <input type="text" placeholder="Name" className="input-field" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                <input type="email" placeholder="Email" className="input-field" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                <div className="modal-actions">
                  <button className="btn-primary" onClick={handleAddUser}>Add User</button>
                  <button className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3>User Details</h3>
                <div className="user-details">
                  <DetailRow label="ID" value={selectedUser.id} />
                  <DetailRow label="Name" value={selectedUser.name} />
                  <DetailRow label="Email" value={selectedUser.email} />
                  <DetailRow label="Status" value={selectedUser.status} isBadge />
                </div>
                <div className="modal-actions">
                  <button className="btn-primary" onClick={() => setActiveModal(null)}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-components for cleaner code ---

const DetailRow = ({ label, value, isBadge }) => (
  <div className="detail-row">
    <span className="detail-label">{label}:</span>
    <span className={isBadge ? `status-badge ${value.toLowerCase()}` : "detail-value"}>{value}</span>
  </div>
);

const ActionButton = ({ onClick, type, label, icon }) => (
  <button className={`btn-${type}`} onClick={onClick} title={label}>
    <span className="btn-icon">{icon}</span>
    {label}
  </button>
);

const ViewIcon = () => (
  <svg viewBox="0 0 24 24" width="16" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
);

const ToggleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" fill="currentColor"><path d="M12 5a7 7 0 1 1-6.4 4H3l3.5-3.5L10 9H7.6A5 5 0 1 0 12 7V5z" /></svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" width="16" fill="currentColor"><path d="M6 7h12l-1 13H7L6 7zm3-3h6l1 2H8l1-2z" /></svg>
);

export default UsersTable;