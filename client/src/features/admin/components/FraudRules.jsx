import React, { useState, useEffect, useCallback } from "react";
import { 
  getFraudRules, 
  createFraudRule, 
  deleteFraudRule,
  updateFraudRule,
  toggleFraudRuleStatus
} from "../services/adminService";
import "../styles/AdminDashboard.css";

const FraudRules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Unified Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRule, setCurrentRule] = useState({ 
    name: "", 
    description: "", 
    priority: "Medium",
    status: "Active" 
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const data = await getFraudRules();
      setRules(data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load fraud rules");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Logic to handle both Add and Edit opening
  const openModal = (rule = null) => {
    if (rule) {
      setIsEditMode(true);
      setCurrentRule(rule);
    } else {
      setIsEditMode(false);
      setCurrentRule({ name: "", description: "", priority: "Medium", status: "Active" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentRule({ name: "", description: "", priority: "Medium", status: "Active" });
  };

  const handleSaveRule = async () => {
    if (!currentRule.name || !currentRule.description) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (isEditMode) {
        await updateFraudRule(currentRule.id, currentRule);
      } else {
        await createFraudRule(currentRule);
      }
      closeModal();
      fetchRules();
    } catch (err) {
      alert(`Failed to ${isEditMode ? 'update' : 'add'} fraud rule`);
      console.error(err);
    }
  };

  const handleToggleStatus = async (ruleId) => {
    try {
      await toggleFraudRuleStatus(ruleId);
      fetchRules();
    } catch (err) {
      alert("Failed to toggle rule status");
      console.error(err);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm("Are you sure you want to delete this fraud rule?")) {
      try {
        await deleteFraudRule(ruleId);
        fetchRules();
      } catch (err) {
        alert("Failed to delete fraud rule");
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Loading fraud rules...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="fraud-rules-section">
      <div className="section-header">
        <div>
          <h2>Fraud Rules Management</h2>
          <p className="section-subtitle">Keep detection rules current and actionable.</p>
        </div>
        <div className="header-actions">
          <span className="pill">Rules: {rules.length}</span>
          <button className="btn-primary" onClick={() => openModal()}>
            + Add Rule
          </button>
        </div>
      </div>

      <div className="rules-grid">
        {rules.length === 0 ? (
          <div className="no-data">No fraud rules found. Add one to get started.</div>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className="rule-card">
              <div className="rule-header">
                <h3 className="rule-name">{rule.name}</h3>
                <div className="rule-actions">
                  <span className={`pill-priority priority-${(rule.priority || 'Medium').toLowerCase()}`}>
                    {rule.priority || 'Medium'}
                  </span>
                </div>
              </div>
              <p className="rule-description">{rule.description}</p>
              <div className="rule-footer">
                <span className={`status-badge ${(rule.status || 'Active').toLowerCase()}`}>
                  {rule.status || 'Active'}
                </span>
                <div className="rule-buttons">
                  <button className="btn-edit-small" onClick={() => openModal(rule)} title="Edit Rule">
                    ✏️ Edit
                  </button>
                  <button className="btn-toggle-small" onClick={() => handleToggleStatus(rule.id)} title="Toggle Status">
                    {(rule.status || 'Active') === 'Active' ? '⏸️ Deactivate' : '▶️ Activate'}
                  </button>
                  <button className="btn-delete-small" onClick={() => handleDeleteRule(rule.id)} title="Delete Rule">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Unified Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{isEditMode ? "Edit Fraud Rule" : "Add Fraud Rule"}</h3>
            <input
              type="text"
              placeholder="Rule Name"
              className="input-field"
              value={currentRule.name}
              onChange={(e) => setCurrentRule({ ...currentRule, name: e.target.value })}
            />
            <textarea
              placeholder="Rule Description"
              className="textarea-field"
              value={currentRule.description}
              onChange={(e) => setCurrentRule({ ...currentRule, description: e.target.value })}
              rows="4"
            />
            <select
              className="input-field"
              value={currentRule.priority}
              onChange={(e) => setCurrentRule({ ...currentRule, priority: e.target.value })}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleSaveRule}>
                {isEditMode ? "Update Rule" : "Save Rule"}
              </button>
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudRules;