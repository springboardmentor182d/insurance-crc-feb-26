import React from "react";

function RecommendationCard({
  title,
  company,
  match,
  coverage,
  premium,
  savings,
  features
}) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3>{title}</h3>
          <p className="company">{company}</p>
        </div>
        <span className="match">{match}</span>
      </div>

      <div className="card-info">
        <div>
          <p>Coverage Amount</p>
          <h4>{coverage}</h4>
        </div>
        <div>
          <p>Monthly Premium</p>
          <h4 className="purple">{premium}</h4>
        </div>
        <div className="savings-box">
          <p>Estimated Savings</p>
          <h4>{savings}</h4>
        </div>
      </div>

      <div className="features">
        {features.map((feature, index) => (
          <span key={index}>⭐ {feature}</span>
        ))}
      </div>

      <div className="card-buttons">
        <button className="view-btn">View Full Details →</button>
        <button className="compare-btn">Add to Compare</button>
      </div>
    </div>
  );
}

export default RecommendationCard;