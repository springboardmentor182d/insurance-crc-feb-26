import React, { useState } from 'react';
import RecommendationCard from '../components/RecommendationCard';

const Recommendation = () => {
  const [age, setAge] = useState('');
  const [budget, setBudget] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recommendation from backend
  const handleGetRecommendation = async (e) => {
    e.preventDefault();
    
    if (!age || !budget) {
      setError('Please enter both age and budget');
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const response = await fetch('http://localhost:8000/insurance/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: parseInt(age),
          budget: parseFloat(budget)
        })
      });

      const data = await response.json();
      if (response.ok) {
        setRecommendation(data.recommendation);
      } else {
        setError(data.message || 'Failed to get recommendation');
      }
    } catch (err) {
      setError('Failed to get recommendation. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Get Insurance Recommendation</h1>
      
      <div className="recommendation-form-container">
        <form onSubmit={handleGetRecommendation} className="form">
          <div className="form-group">
            <label htmlFor="age">Age *</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              min="18"
              max="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="budget">Budget (Monthly in $) *</label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter your monthly budget"
              min="0"
              step="10"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
        
        {recommendation && (
          <div className="recommendation-result">
            <h2>Recommended Plan</h2>
            <RecommendationCard plan={recommendation} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendation;
