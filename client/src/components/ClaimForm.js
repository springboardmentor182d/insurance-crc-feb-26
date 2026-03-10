import React, { useState } from 'react';

const ClaimForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    policy_number: '',
    reason: '',
    amount: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.policy_number || !formData.reason || !formData.amount) {
      setError('Please fill in all fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Claim amount must be greater than 0');
      return;
    }

    setLoading(true);
    onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="claim-form">
      <div className="form-group">
        <label htmlFor="policy_number">Policy Number *</label>
        <input
          type="text"
          id="policy_number"
          name="policy_number"
          value={formData.policy_number}
          onChange={handleChange}
          placeholder="Enter your policy number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="reason">Claim Reason *</label>
        <select
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
        >
          <option value="">Select a reason</option>
          <option value="medical_expense">Medical Expense</option>
          <option value="hospitalization">Hospitalization</option>
          <option value="accident">Accident</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="amount">Claim Amount ($) *</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter claim amount"
          min="0"
          step="0.01"
        />
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Claim'}
      </button>
    </form>
  );
};

export default ClaimForm;
