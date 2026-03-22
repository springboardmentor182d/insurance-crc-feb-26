import React from 'react';
import './RecommendationCard.css';

const RecommendationCard = ({ plan }) => {
  if (!plan) {
    return (
      <div className="recommendation-card">
        <p style={{ textAlign: 'center', color: '#6b7280' }}>
          No recommendations available.
        </p>
      </div>
    );
  }

  const match = Math.round(plan.match_score || plan.match || 0);

  return (
    <div className="recommendation-card">
      <div className="card-header">
        <span className="category-tag">
          {plan.category || plan.type || 'Policy'}
        </span>
        <div className="match-score">
          <span className="match-value">{match}%</span>
          <span className="match-label">Match</span>
        </div>
      </div>

      <div className="card-body">
        <h3 className="policy-title">{plan.title || plan.name}</h3>
        <p className="provider-name">{plan.provider || 'N/A'}</p>

        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${match}%` }}></div>
        </div>

        {/* Reason */}
        <div className="reason-box">
          <p className="reason-title">Why we recommend this</p>
          <p className="reason-text">
            {plan.why || plan.reason || 'Great match for your profile'}
          </p>

          {plan.family_health && (
            <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '8px' }}>
              👨‍👩‍👧‍👦 {plan.family_health}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-item">
            <label>Coverage</label>
            <p>{plan.coverage || plan.coverage_amount || 'N/A'}</p>
          </div>
          <div className="stat-item">
            <label>Premium</label>
            <p>{plan.premium || plan.premium_amount || 'N/A'}</p>
          </div>
          <div className="stat-item">
            <label>Claim Ratio</label>
            <p className="highlight-green">
              {plan.claim_ratio || plan.claimRatio || 'N/A'}
            </p>
          </div>
          <div className="stat-item">
            <label>Risk Level</label>
            <span className="risk-tag">
              {plan.risk_level || plan.riskLevel || 'N/A'}
            </span>
          </div>
        </div>

        {/* Tags */}
        {Array.isArray(plan.tags) && plan.tags.length > 0 && (
          <div className="tags-container">
            {plan.tags.map((tag, index) => (
              <span key={index} className="feature-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <button className="select-plan-btn">Select Plan</button>
      </div>
    </div>
  );
};

export default RecommendationCard;