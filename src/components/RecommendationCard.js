import React from "react";

function RecommendationCard({ icon, title, description, match, policy, reasons }) {
  return (
    <div className="recommend-card">
      <div className="recommend-header">
        <div className="recommend-left">
          <div className="recommend-icon">{icon}</div>
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>

        <div className="match-badge">{match} Match</div>
      </div>

      <div className="recommend-body">
        <div className="policy-box">
          <span>Recommended Policy</span>
          <h4>{policy.name}</h4>
          <p>{policy.provider}</p>
          <div className="policy-row">
            <span>Premium</span>
            <strong>{policy.premium}</strong>
          </div>
          <div className="policy-row">
            <span>Coverage</span>
            <strong>{policy.coverage}</strong>
          </div>
          <div className="highlight">💰 {policy.highlight}</div>
        </div>

        <div className="reasons">
          <h4>Why we recommend this:</h4>
          {reasons.map((r, index) => (
            <div key={index}>✔ {r}</div>
          ))}
        </div>
      </div>

      <div className="actions">
        <button className="primary">Get Quote →</button>
        <button className="secondary">Learn More</button>
        <button className="text-btn">Not Interested</button>
      </div>
    </div>
  );
}

export default RecommendationCard;