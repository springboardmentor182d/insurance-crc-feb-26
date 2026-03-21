import React, { useState, useEffect, useCallback } from "react";
import { catalogService } from "../../../services/apiService";
import "../styles/AdminDashboard.css";

const INITIAL_FORM_STATE = {
  name: "",
  provider: "",
  policy_type: "Health",
  coverage_amount: "",
  premium_amount: "",
  claim_ratio: "",
  risk_level: "Low",
  is_active: true,
  user_id: "",
};

const TYPE_COLORS = {
  Health: "#10b981",
  Auto: "#3b82f6",
  Life: "#f59e0b",
  Home: "#8b5cf6",
  Travel: "#ec4899",
  Property: "#6366f1",
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN")}`;
};

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [policyTypes, setPolicyTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Memoized data loader to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [policiesData, typesData] = await Promise.all([
        catalogService.getPolicies(),
        catalogService.getPolicyTypes(),
      ]);
      setPolicies(policiesData || []);
      setPolicyTypes(typesData.types || []);
      setError(null);
    } catch (err) {
      setError("Failed to synchronize policy data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Modal Handlers
  const handleOpenModal = (policy = null) => {
    if (policy) {
      setEditingPolicyId(policy.id);
      setFormData({
        ...INITIAL_FORM_STATE,
        ...policy,
        coverage_amount: policy.coverage_amount ?? "",
        premium_amount: policy.premium_amount ?? "",
        claim_ratio: policy.claim_ratio ?? "",
        risk_level: policy.risk_level || "Low",
        is_active: policy.is_active ?? true,
        user_id: policy.user_id ?? "",
      });
    } else {
      setEditingPolicyId(null);
      setFormData(INITIAL_FORM_STATE);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPolicyId(null);
    setFormData(INITIAL_FORM_STATE);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // CRUD Actions
  const handleSavePolicy = async () => {
    const { name, provider, coverage_amount, premium_amount } = formData;
    if (!name || !provider || coverage_amount === "" || premium_amount === "") {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        coverage_amount: Number(formData.coverage_amount || 0),
        premium_amount: Number(formData.premium_amount || 0),
        claim_ratio: Number(formData.claim_ratio || 0),
        user_id: formData.user_id === "" ? null : Number(formData.user_id),
      };

      if (editingPolicyId) {
        await catalogService.updatePolicy(editingPolicyId, payload);
      } else {
        await catalogService.createPolicy(payload);
      }
      await fetchData();
      handleCloseModal();
    } catch (err) {
      setError("Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePolicy = async (policyId) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;
    
    try {
      setLoading(true);
      await catalogService.deletePolicy(policyId);
      await fetchData();
    } catch (err) {
      setError("Failed to delete policy");
    } finally {
      setLoading(false);
    }
  };

  if (loading && policies.length === 0) return <div className="loading">Loading policies...</div>;

  return (
    <div className="users-section">
      <div className="section-header">
        <div>
          <h2>Insurance Policies</h2>
          <p className="section-subtitle">Manage insurance policies and coverage details</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>+</span> Add Policy
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        {policies.length === 0 ? (
          <p className="no-data-text">No policies found. Click "Add Policy" to create one.</p>
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
                  <td className="text-primary-bold">{policy.name}</td>
                  <td><span className="icon-provider">📋</span> {policy.provider}</td>
                  <td>
                    <span 
                      className="pill" 
                      style={{ 
                        backgroundColor: `${TYPE_COLORS[policy.policy_type] || "#6b7280"}20`, 
                        color: TYPE_COLORS[policy.policy_type] || "#6b7280" 
                      }}
                    >
                      {policy.policy_type}
                    </span>
                  </td>
                  <td className="bold">{formatCurrency(policy.coverage_amount)}</td>
                  <td className="bold">{formatCurrency(policy.premium_amount)}</td>
                  <td className="text-success-bold">{`${Number(policy.claim_ratio || 0)}%`}</td>
                  <td>
                    <button className="btn-link" onClick={() => handleOpenModal(policy)}>Edit</button>
                    <button className="btn-link-danger" onClick={() => handleDeletePolicy(policy.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPolicyId ? "Edit Policy" : "Add New Policy"}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <ModalInput label="Policy Name *" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Comprehensive Health Shield" />
              <ModalInput label="Provider *" name="provider" value={formData.provider} onChange={handleInputChange} placeholder="e.g., HealthFirst Insurance" />
              
              <div className="modal-field">
                <label>Policy Type *</label>
                <select name="policy_type" value={formData.policy_type} onChange={handleInputChange} className="modal-input">
                  {(policyTypes.length > 0 ? policyTypes : Object.keys(TYPE_COLORS)).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <ModalInput label="Coverage Amount *" type="number" name="coverage_amount" value={formData.coverage_amount} onChange={handleInputChange} placeholder="e.g., 500000" />
              <ModalInput label="Premium *" type="number" name="premium_amount" value={formData.premium_amount} onChange={handleInputChange} placeholder="e.g., 15000" />
              <ModalInput label="Claim Ratio" type="number" name="claim_ratio" value={formData.claim_ratio} onChange={handleInputChange} placeholder="e.g., 95" />

              <div className="modal-field">
                <label>Risk Level</label>
                <select name="risk_level" value={formData.risk_level} onChange={handleInputChange} className="modal-input">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="modal-field">
                <label>Status</label>
                <select
                  name="is_active"
                  value={String(formData.is_active)}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.value === "true" }))}
                  className="modal-input"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
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

// Internal Sub-component for cleaner Modal JSX
const ModalInput = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="modal-field">
    <label>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} className="modal-input" placeholder={placeholder} />
  </div>
);

export default Policies;