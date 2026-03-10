import React from 'react';

const AlertsPanel = () => {
  const alerts = [
    {
      type: 'orange',
      icon: '⚡',
      message: '15 claims require immediate review',
      action: 'Review'
    },
    {
      type: 'red',
      icon: '🚨',
      message: 'Fraud detection alert: Claim #CL-8734',
      action: 'Review'
    },
    {
      type: 'blue',
      icon: '⏰',
      message: '3 policies expiring in next 7 days',
      action: 'Review'
    }
  ];

  return (
    <div className="alerts-panel">
      <h2 className="section-title">Priority Alerts</h2>
      <div className="alerts-grid">
        {alerts.map((alert, index) => (
          <div key={index} className={`alert-card alert-${alert.type}`}>
            <div className="alert-header">
              <span className="alert-icon">{alert.icon}</span>
              <span className="alert-message">{alert.message}</span>
            </div>
            <button className="alert-btn">Review</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;
