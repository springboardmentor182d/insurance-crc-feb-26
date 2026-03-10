import React from 'react';

const FraudPanel = () => {
  const fraudData = {
    criticalCases: 12,
    underReview: 45,
    amountAtRisk: '$284,500'
  };

  return (
    <div className="fraud-panel">
      <h2 className="panel-title">Fraud Detection Summary</h2>
      
      <div className="fraud-metrics">
        <div className="fraud-metric">
          <div className="metric-value critical">{fraudData.criticalCases}</div>
          <div className="metric-label">Critical Cases</div>
        </div>
        
        <div className="fraud-metric">
          <div className="metric-value warning">{fraudData.underReview}</div>
          <div className="metric-label">Under Review</div>
        </div>
        
        <div className="fraud-metric">
          <div className="metric-value info">{fraudData.amountAtRisk}</div>
          <div className="metric-label">Amount at Risk</div>
        </div>
      </div>
      
      <button className="fraud-btn">Review Fraud Cases</button>
    </div>
  );
};

export default FraudPanel;
