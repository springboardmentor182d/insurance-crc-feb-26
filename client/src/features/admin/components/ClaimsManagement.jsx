import React, { useState, useEffect } from "react";
import { getClaims, createClaim, deleteClaim } from "../services/adminService";
import "../styles/AdminDashboard.css";

const ClaimsManagement = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view"); // "view", "edit", or "create"

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const data = await getClaims();
      setClaims(data);
      setError(null);
    } catch (err) {
      setError("Failed to load claims data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "status-approved";
      case "Pending":
        return "status-pending";
      case "Under Review":
        return "status-review";
      case "Rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "priority-high";
      case "Medium":
        return "priority-medium";
      case "Low":
        return "priority-low";
      default:
        return "priority-low";
    }
  };

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setModalType("view");
    setShowModal(true);
  };

  const handleEdit = (claim) => {
    setSelectedClaim(claim);
    setModalType("edit");
    setShowModal(true);
  };

  const handleAddNewClaim = () => {
    // Create empty claim template for new entry
    const emptyClaim = {
      claim_id: "",
      claimant: "",
      amount: "",
      claim_type: "",
      status: "Pending",
      priority: "Low",
      date: new Date().toISOString().split('T')[0]
    };
    setSelectedClaim(emptyClaim);
    setModalType("create");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClaim(null);
  };

  const handleDeleteClaim = async (claimId) => {
    if (window.confirm("Are you sure you want to delete this claim?")) {
      try {
        await deleteClaim(claimId);
        fetchClaims();
      } catch (err) {
        alert("Failed to delete claim");
        console.error(err);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      if (modalType === "create") {
        // Create new claim
        await createClaim(selectedClaim);
        alert("New claim created successfully!");
      } else if (modalType === "edit") {
        // Update existing claim - in real app, you'd send to backend
        console.log("Updating claim:", selectedClaim);
        alert("Claim updated successfully!");
      }
      handleCloseModal();
      fetchClaims(); // Refresh the claims list
    } catch (error) {
      console.error("Error saving claim:", error);
      alert("Failed to save claim. Please try again.");
    }
  };

  return (
    <div className="claims-management">
      <div className="section-header">
        <div>
          <h2>All Claims</h2>
          <p className="section-subtitle">View and manage all insurance claims in one place.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleAddNewClaim}>+ New Claim</button>
        </div>
      </div>

      {loading && <div className="loading">Loading claims...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && claims.length > 0 && (
        <>
          {/* Claims Table */}
          <div className="claims-table-container">
            <table className="claims-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Claimant</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id} className="claim-row">
                    <td className="claim-id-cell">
                      <strong>{claim.claim_id}</strong>
                    </td>
                    <td>{claim.claimant}</td>
                    <td className="claim-amount-cell">{claim.amount}</td>
                    <td>
                      <span className="claim-type-badge">{claim.claim_type}</span>
                    </td>
                    <td>
                      <span className={`claim-status ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td>
                      <span className={`claim-priority ${getPriorityColor(claim.priority)}`}>
                        {claim.priority}
                      </span>
                    </td>
                    <td className="claim-date-cell">{claim.date}</td>
                    <td className="claim-actions-cell">
                      <button
                        className="btn-action-view"
                        onClick={() => handleViewDetails(claim)}
                        title="View details"
                      >
                        👁️ View
                      </button>
                      <button
                        className="btn-action-edit"
                        onClick={() => handleEdit(claim)}
                        title="Edit claim"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-action-delete"
                        onClick={() => handleDeleteClaim(claim.id)}
                        title="Delete claim"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Claims Summary Stats */}
          <div className="claims-summary">
            <div className="summary-stat">
              <div className="stat-value">{claims.length}</div>
              <div className="stat-label">Total Claims</div>
            </div>
            <div className="summary-stat">
              <div className="stat-value">{claims.filter(c => c.status === "Approved").length}</div>
              <div className="stat-label">Approved</div>
            </div>
            <div className="summary-stat">
              <div className="stat-value">{claims.filter(c => c.status === "Pending").length}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="summary-stat">
              <div className="stat-value">{claims.filter(c => c.status === "Under Review").length}</div>
              <div className="stat-label">Under Review</div>
            </div>
          </div>
        </>
      )}

      {/* Modal for View/Edit */}
      {showModal && selectedClaim && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === "view" ? "Claim Details" : modalType === "edit" ? "Edit Claim" : "New Claim"}
              </h3>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-field">
                <label>Claim ID</label>
                {modalType === "view" ? (
                  <p className="modal-value">{selectedClaim.claim_id}</p>
                ) : (
                  <input
                    type="text"
                    value={selectedClaim.claim_id}
                    onChange={(e) =>
                      setSelectedClaim({
                        ...selectedClaim,
                        claim_id: e.target.value,
                      })
                    }
                    className="modal-input"
                    placeholder="e.g., CLM-001"
                  />
                )}
              </div>

              <div className="modal-field">
                <label>Claimant Name</label>
                {modalType === "view" ? (
                  <p className="modal-value">{selectedClaim.claimant}</p>
                ) : (
                  <input
                    type="text"
                    value={selectedClaim.claimant}
                    onChange={(e) =>
                      setSelectedClaim({
                        ...selectedClaim,
                        claimant: e.target.value,
                      })
                    }
                    className="modal-input"
                    placeholder="Enter claimant name"
                  />
                )}
              </div>

              <div className="modal-field">
                <label>Amount</label>
                {modalType === "view" ? (
                  <p className="modal-value">{selectedClaim.amount}</p>
                ) : (
                  <input
                    type="text"
                    value={selectedClaim.amount}
                    onChange={(e) =>
                      setSelectedClaim({
                        ...selectedClaim,
                        amount: e.target.value,
                      })
                    }
                    className="modal-input"
                    placeholder="e.g., ₹45,000"
                  />
                )}
              </div>

              <div className="modal-field">
                <label>Status</label>
                {modalType === "view" ? (
                  <p className="modal-value">
                    <span className={`claim-status ${getStatusColor(selectedClaim.status)}`}>
                      {selectedClaim.status}
                    </span>
                  </p>
                ) : (
                  <select
                    value={selectedClaim.status}
                    onChange={(e) =>
                      setSelectedClaim({
                        ...selectedClaim,
                        status: e.target.value,
                      })
                    }
                    className="modal-input"
                  >
                    <option>Approved</option>
                    <option>Pending</option>
                    <option>Under Review</option>
                    <option>Rejected</option>
                  </select>
                )}
              </div>

              <div className="modal-field">
                <label>Type</label>
                {modalType === "view" ? (
                  <p className="modal-value">{selectedClaim.claim_type}</p>
                ) : (
                  <input
                    type="text"
                    value={selectedClaim.claim_type}
                    onChange={(e) =>
                      setSelectedClaim({
                        ...selectedClaim,
                        claim_type: e.target.value,
                      })
                    }
                    className="modal-input"
                    placeholder="e.g., Auto, Health, Property"
                  />
                )}
              </div>

              <div className="modal-field">
                <label>Priority</label>
                {modalType === "view" ? (
                  <p className="modal-value">
                    <span className={`claim-priority ${getPriorityColor(selectedClaim.priority)}`}>
                      {selectedClaim.priority}
                    </span>
                  </p>
                ) : (
                  <select
                    value={selectedClaim.priority}
                    onChange={(e) =>
                      setSelectedClaim({
                        ...selectedClaim,
                        priority: e.target.value,
                      })
                    }
                    className="modal-input"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                )}
              </div>

              <div className="modal-field">
                <label>Date</label>
                {modalType === "view" ? (
                  <p className="modal-value">{selectedClaim.date}</p>
                ) : (
                  <input
                    type="text"
                    value={selectedClaim.date}
                    onChange={(e) =>
                      setSelectedClaim({
                        ...selectedClaim,
                        date: e.target.value,
                      })
                    }
                    className="modal-input"
                  />
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>
                Close
              </button>
              {(modalType === "edit" || modalType === "create") && (
                <button className="btn-primary" onClick={handleSaveEdit}>
                  {modalType === "create" ? "Create Claim" : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimsManagement;
