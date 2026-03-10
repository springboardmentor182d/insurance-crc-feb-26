import React from 'react';
import InsuranceCard from './InsuranceCard';

const RecommendationCard = ({ plan }) => {
  return (
    <div className="recommendation-card-container">
      <div className="recommendation-badge">Recommended for You</div>
      <InsuranceCard plan={plan} />
    </div>
  );
};

export default RecommendationCard;
