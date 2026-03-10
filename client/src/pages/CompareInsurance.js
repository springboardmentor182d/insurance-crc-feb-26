import React, { useState, useEffect } from 'react';
import ComparisonTable from '../components/ComparisonTable';

const CompareInsurance = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch insurance plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:8000/insurance/plans');
        const data = await response.json();
        setPlans(data.plans);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch insurance plans');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Toggle plan selection
  const handlePlanSelect = (planId) => {
    if (selectedPlans.includes(planId)) {
      setSelectedPlans(selectedPlans.filter(id => id !== planId));
    } else {
      if (selectedPlans.length < 2) {
        setSelectedPlans([...selectedPlans, planId]);
      }
    }
  };

  const getSelectedPlanData = () => {
    return plans.filter((_, index) => selectedPlans.includes(index));
  };

  if (loading) return <div className="page-container"><p>Loading plans...</p></div>;
  if (error) return <div className="page-container"><p className="error">{error}</p></div>;

  return (
    <div className="page-container">
      <h1>Compare Insurance Plans</h1>
      
      <div className="plan-selector">
        <h3>Select Plans to Compare (max 2)</h3>
        <div className="plan-list">
          {plans.map((plan, index) => (
            <div key={index} className="plan-checkbox">
              <input
                type="checkbox"
                id={`plan-${index}`}
                checked={selectedPlans.includes(index)}
                onChange={() => handlePlanSelect(index)}
                disabled={selectedPlans.length === 2 && !selectedPlans.includes(index)}
              />
              <label htmlFor={`plan-${index}`}>{plan.name}</label>
            </div>
          ))}
        </div>
      </div>

      {selectedPlans.length > 0 && (
        <div className="comparison-section">
          <h2>Comparison</h2>
          <ComparisonTable plans={getSelectedPlanData()} />
        </div>
      )}
    </div>
  );
};

export default CompareInsurance;
