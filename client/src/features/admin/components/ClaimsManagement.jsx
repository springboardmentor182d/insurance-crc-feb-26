import React, { useState, useEffect, useCallback } from "react";
import { getClaims, createClaim, deleteClaim } from "../services/adminService";
import "../styles/AdminDashboard.css";

const ClaimsManagement = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view"); // "view", "edit", "create"

  // 1. Style Mapping Objects (Removes switch statement duplication)
  const STATUS_MAP = {
    Approved: "status-approved",
    Pending: "status-pending",
    "Under Review": "status-review",
    Rejected: "status-rejected",
  };

  const PRIORITY_MAP = {
    High: "priority-high",
    Medium: "priority-medium",
    Low: "priority-low",
  };

  // 2. Data Fetching
  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getClaims();
      setClaims(data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load claims data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  // 3. Handlers
  const handleOpenModal = (type, claim = null) => {
    setModalType(type);
    setSelectedClaim(claim || {
      claim_id: "",
      claimant: "",
      amount: "",
      claim_type: "",
      status: "Pending",
      priority: "Low",
      date: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClaim(null);
  };

  const handleSave = async () => {
    try {
      if (modalType === "create") {
        await createClaim(selectedClaim);
      } else {
        console.log("Updating claim:", selectedClaim);
      }
      handleCloseModal();
      fetchClaims();
    } catch (err) {
      alert("Error processing claim");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirm deletion?")) {
      try {
        await deleteClaim(id);
        fetchClaims();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  if (loading) return <div className="loading">Loading claims...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="claims-management">
      <header className="section-header">
        <div>
          <h2>All Claims</h2>
          <p className="section-subtitle">Manage insurance claims in one place.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal("create")}>+ New Claim</button>
      </header>

      <div className="claims-table-container">
        <table className="claims-table">
          <thead>
            <tr>
              <th>ID</th><th>Claimant</th><th>Amount</th><th>Type</th><th>Status</th><th>Priority</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id} className="claim-row">
                <td><strong>{c.claim_id}</strong></td>
                <td>{c.claimant}</td>
                <td>{c.amount}</td>
                <td><span className="claim-type-badge">{c.claim_type}</span></td>
                <td><span className={`claim-status ${STATUS_MAP[c.status] || "status-pending"}`}>{c.status}</span></td>
                <td><span className={`claim-priority ${PRIORITY_MAP[c.priority] || "priority-low"}`}>{c.priority}</span></td>
                <td className="claim-actions-cell">
                  <button onClick={() => handleOpenModal("view", c)}>👁️</button>
                  <button onClick={() => handleOpenModal("edit", c)}>✏️</button>
                  <button onClick={() => handleDelete(c.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="claims-summary">
        {Object.entries(STATUS_MAP).map(([label, colorClass]) => (
          <div key={label} className="summary-stat">
            <div className="stat-value">{claims.filter(c => c.status === label).length}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalType.toUpperCase()} CLAIM</h3>
              <button onClick={handleCloseModal}>✕</button>
            </div>
            <div className="modal-body">
              {["claim_id", "claimant", "amount", "claim_type"].map(field => (
                <div key={field} className="modal-field">
                  <label>{field.replace("_", " ").toUpperCase()}</label>
                  {modalType === "view" ? (
                    <p className="modal-value">{selectedClaim[field]}</p>
                  ) : (
                    <input
                      className="modal-input"
                      value={selectedClaim[field]}
                      onChange={e => setSelectedClaim({...selectedClaim, [field]: e.target.value})}
                    />
                  )}
                </div>
              ))}
              <div className="modal-field">
                <label>STATUS</label>
                {modalType === "view" ? (
                   <p className="modal-value">{selectedClaim.status}</p>
                ) : (
                  <select className="modal-input" value={selectedClaim.status} onChange={e => setSelectedClaim({...selectedClaim, status: e.target.value})}>
                    {Object.keys(STATUS_MAP).map(s => <option key={s}>{s}</option>)}
                  </select>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>Close</button>
              {modalType !== "view" && <button className="btn-primary" onClick={handleSave}>Save</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimsManagement;