import React from "react";

function RecommendationCard({ policy }) {
  return (
    <div className="card">
      <h3>{policy.name}</h3>
      <p>{policy.description}</p>
    </div>
  );
}

export default RecommendationCard;