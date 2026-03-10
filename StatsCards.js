import React from 'react';

const StatsCards = () => {
  const statsData = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12.5%',
      isPositive: true,
      icon: '👥'
    },
    {
      title: 'Total Policies',
      value: '8,432',
      change: '+8.3%',
      isPositive: true,
      icon: '📋'
    },
    {
      title: 'Pending Claims',
      value: '234',
      change: '-5.2%',
      isPositive: true,
      icon: '⏳'
    },
    {
      title: 'Approved Claims',
      value: '1,892',
      change: '+15.7%',
      isPositive: true,
      icon: '✅'
    }
  ];

  return (
    <div className="stats-grid">
      {statsData.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">{stat.icon}</span>
            <span className={`stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
              {stat.change}
            </span>
          </div>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.title}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
