import React, { useState, useEffect } from "react";
import { catalogService } from "../../../services/apiService";
import "../styles/AdminDashboard.css";

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [policyTypes, setPolicyTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    policy_type: "Health",
    coverage: "",
    premium: "",
    claim_ratio: "",
    description: "",
  });

  // Load policies and policy types on mount
  useEffect(() => {
    loadPolicies();
    loadPolicyTypes();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const data = await catalogService.getPolicies();
      setPolicies(data);
      setError(null);
    } catch (err) {
      setError("Failed to load policies");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPolicyTypes = async () => {
    try {
      const data = await catalogService.getPolicyTypes();
      setPolicyTypes(data.types || []);
    } catch (err) {
      console.error("Failed to load policy types", err);
    }
  };

  const handleAddPolicy = () => {
    setEditingPolicyId(null);
    setFormData({
      name: "",
      provider: "",
      policy_type: "Health",
      coverage: "",
      premium: "",
      claim_ratio: "",
      description: "",
    });
    setShowModal(true);
  };

  const handleEditPolicy = (policy) => {
    setEditingPolicyId(policy.id);
    setFormData({
      name: policy.name,
      provider: policy.provider,
      policy_type: policy.policy_type,
      coverage: policy.coverage,
      premium: policy.premium,
      claim_ratio: policy.claim_ratio || "",
      description: policy.description || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPolicyId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSavePolicy = async () => {
    if (!formData.name || !formData.provider || !formData.coverage || !formData.premium) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      if (editingPolicyId) {
        await catalogService.updatePolicy(editingPolicyId, formData);
      } else {
        await catalogService.createPolicy(formData);
      }
      await loadPolicies();
      handleCloseModal();
    } catch (err) {
      setError("Failed to save policy");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePolicy = async (policyId) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        setLoading(true);
        await catalogService.deletePolicy(policyId);
        await loadPolicies();
      } catch (err) {
        setError("Failed to delete policy");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      Health: "#10b981",
      Auto: "#3b82f6",
      Life: "#f59e0b",
      Home: "#8b5cf6",
      Travel: "#ec4899",
      Property: "#6366f1",
    };
    return colors[type] || "#6b7280";
  };

  if (loading && policies.length === 0) {
    return <div className="loading">Loading policies...</div>;
  }

  return (
    <div className="users-section">
      <div className="section-header">
        <div>
          <h2>Insurance Policies</h2>
          <p className="section-subtitle">Manage insurance policies and coverage details</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleAddPolicy}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <span>+</span> Add Policy
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        {policies.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
            No policies found. Click "Add Policy" to create one.
          </p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Policy Name</th>
                <th>Provider</th>
                <th>Type</th>
                <th>Coverage</th>
                <th>Premium</th>
                <th>Claim Ratio</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td style={{ fontWeight: 600, color: "var(--primary)" }}>{policy.name}</td>
                  <td style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "16px" }}>📋</span>
                    {policy.provider}
                  </td>
                  <td>
                    <span
                      className="pill"
                      style={{
                        backgroundColor: `${getTypeColor(policy.policy_type)}20`,
                        color: getTypeColor(policy.policy_type),
                      }}
                    >
                      {policy.policy_type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{policy.coverage}</td>
                  <td style={{ fontWeight: 600 }}>{policy.premium}</td>
                  <td style={{ color: "#10b981", fontWeight: 600 }}>{policy.claim_ratio}</td>
                  <td>
                    <button
                      onClick={() => handleEditPolicy(policy)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary)",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "14px",
                        marginRight: "10px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePolicy(policy.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPolicyId ? "Edit Policy" : "Add New Policy"}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="modal-field">
                <label>Policy Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="modal-input"
                  placeholder="e.g., Comprehensive Health Shield"
                />
              </div>

              <div className="modal-field">
                <label>Provider *</label>
                <input
                  type="text"
                  name="provider"
                  value={formData.provider}
                  onChange={handleInputChange}
                  className="modal-input"
                  placeholder="e.g., HealthFirst Insurance"
                />
              </div>

              <div className="modal-field">
                <label>Policy Type *</label>
                <select
                  name="policy_type"
                  value={formData.policy_type}
                  onChange={handleInputChange}
                  className="modal-input"
                >
                  {(policyTypes.length > 0
                    ? policyTypes
                    : ["Health", "Auto", "Life", "Home", "Travel", "Property"]
                  ).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-field">
                <label>Coverage Amount *</label>
                <input
                  type="text"
                  name="coverage"
                  value={formData.coverage}
                  onChange={handleInputChange}
                  className="modal-input"
                  placeholder="e.g., ₹5.0L"
                />
              </div>

              <div className="modal-field">
                <label>Premium *</label>
                <input
                  type="text"
                  name="premium"
                  value={formData.premium}
                  onChange={handleInputChange}
                  className="modal-input"
                  placeholder="e.g., ₹15,000/yr"
                />
              </div>

              <div className="modal-field">
                <label>Claim Ratio</label>
                <input
                  type="text"
                  name="claim_ratio"
                  value={formData.claim_ratio}
                  onChange={handleInputChange}
                  className="modal-input"
                  placeholder="e.g., 95%"
                />
              </div>

              <div className="modal-field">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="modal-input"
                  placeholder="Policy description..."
                  rows="3"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSavePolicy} disabled={loading}>
                {editingPolicyId ? "Update Policy" : "Add Policy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Policies;
