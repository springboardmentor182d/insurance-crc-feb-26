import React, { useEffect, useState } from 'react';
import { catalogService } from '../services/apiService';
import './RecommendationCard.css';

const RecommendationCard = ({ category = null, topOnly = false }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, [category, topOnly]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      let data;
      
      if (topOnly) {
        data = await catalogService.getTopRecommendations(category);
      } else {
        data = await catalogService.getRecommendations({ category });
      }
      
      const recs = Array.isArray(data) ? data : data.recommendations || [];
      setRecommendations(recs);
      setSelectedIndex(0);
      setError(null);
    } catch (err) {
      setError("Failed to load recommendations");
      console.error(err);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="recommendation-card"><p>Loading recommendations...</p></div>;
  if (error) return <div className="recommendation-card"><p style={{ color: 'red' }}>{error}</p></div>;
  if (recommendations.length === 0) {
    return (
      <div className="recommendation-card">
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No recommendations available.</p>
      </div>
    );
  }

  const plan = recommendations[selectedIndex];
  // Helper to handle inconsistent naming from API
  const score = plan.match_score || plan.match || 0;

  return (
    <div className="recommendation-card">
      {plan.is_top_recommendation && <p className="top-label">✨ TOP RECOMMENDATION</p>}
      
      <div className="card-header">
        <div className="plan-info">
          <span className="category-tag">{plan.category || plan.type}</span>
          <h2 className="plan-title">{plan.title}</h2>
          <p className="provider-name">{plan.provider}</p>
        </div>
        <div className="match-score">
          <span className="match-value">{Math.round(score)}%</span>
          <span className="match-label">Match</span>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${score}%` }}></div>
      </div>

      <div className="reason-box">
        <p className="reason-title">Why we recommend this</p>
        <p className="reason-text">{plan.why || plan.reason || 'Great match for your profile'}</p>
        {plan.family_health && (
          <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '8px' }}>
            👨‍👩‍👧‍👦 {plan.family_health}
          </p>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <label>Coverage</label>
          <p>{plan.coverage}</p>
        </div>
        <div className="stat-item">
          <label>Premium</label>
          <p>{plan.premium}</p>
        </div>
        <div className="stat-item">
          <label>Claim Ratio</label>
          <p className="highlight-green">{plan.claim_ratio}</p>
        </div>
        <div className="stat-item">
          <label>Risk Level</label>
          <span className={`risk-tag ${plan.risk_level?.toLowerCase().replace(' ', '-')}`}>
            {plan.risk_level}
          </span>
        </div>
      </div>

      {plan.tags && Array.isArray(plan.tags) && (
        <div className="tags-container">
          {plan.tags.map((tag, index) => (
            <span key={index} className="feature-tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {recommendations.length > 1 && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
            Showing {selectedIndex + 1} of {recommendations.length}
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              className="nav-btn"
              onClick={() => setSelectedIndex(prev => prev - 1)}
              disabled={selectedIndex === 0}
            >
              ← Previous
            </button>
            <button
              className="nav-btn"
              onClick={() => setSelectedIndex(prev => prev + 1)}
              disabled={selectedIndex === recommendations.length - 1}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      <button className="select-btn">Select Plan</button>
    </div>
  );
};

export default RecommendationCard;