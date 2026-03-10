import React from 'react';

const InsuranceCard = ({ plan }) => {
  return (
    <div className="insurance-card">
      <h3>{plan.name}</h3>
      <div className="card-content">
        <p className="price">${plan.price}/month</p>
        <p className="coverage">Coverage: ${plan.coverage}</p>
        <p className="deductible">Deductible: ${plan.deductible}</p>
        <p className="description">{plan.description}</p>
        
        <div className="features">
          <h4>Key Features:</h4>
          <ul>
            {plan.features && plan.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCard;
