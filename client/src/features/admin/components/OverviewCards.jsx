import React, { useEffect, useState } from "react";
import { getOverview } from "../services/adminService";
import { adminService } from "../../../services/apiService";
import "../styles/AdminDashboard.css";

const OverviewCards = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    active_policies: 0,
    claims: 0,
    fraud_alerts: 0,
  });
  const [quickStats, setQuickStats] = useState({
    approval_rate: 0,
    avg_processing_time: 0,
    customer_satisfaction: 0,
  });
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const [overviewData, quickStatsData, systemAlertsData, recentActivityData] = await Promise.all([
        getOverview(),
        adminService.getQuickStats(),
        adminService.getSystemAlerts(),
        adminService.getRecentActivity(),
      ]);
      setStats(overviewData);
      setQuickStats(quickStatsData);
      setSystemAlerts(systemAlertsData.alerts || []);
      setRecentActivities(recentActivityData.activities || []);
      setError(null);
    } catch (err) {
      setError("Failed to load overview data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading overview...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const cards = [
    {
      title: "Total Claims",
      value: stats.claims || 0,
      icon: "📄",
      bgColor: "#ffffff",
    },
    {
      title: "High-Risk Claims",
      value: stats.fraud_alerts || 0,
      icon: "⚠️",
      bgColor: "#ffffff",
    },
    {
      title: "Active Policies",
      value: stats.active_policies || 0,
      icon: "🛡️",
      bgColor: "#ffffff",
    },
    {
      title: "Users with Plans",
      value: stats.total_users || 0,
      icon: "👥",
      bgColor: "#ffffff",
    },
  ];

  return (
    <>
      <div className="overview-cards-grid">
        {cards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">{card.title}</span>
              <span className="stat-card-icon">{card.icon}</span>
            </div>
            <div className="stat-card-value">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="overview-bottom-section">
        <div className="activity-section">
          <h3 className="section-heading">Recent Activity</h3>
          <div className="activity-content">
            {recentActivities.length > 0 ? (
              <div className="activities-list">
                {recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-timestamp">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="activity-details">
                      <div className="activity-action">
                        <span className={`activity-badge activity-${activity.entity_type.toLowerCase()}`}>
                          {activity.entity_type}
                        </span>
                        <span className="activity-title">{activity.action}</span>
                      </div>
                      <div className="activity-description">{activity.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-activities">No recent activities</div>
            )}
          </div>
        </div>

        <div className="alerts-stats-section">
          <div className="system-alerts">
            <h3 className="section-heading">System Alerts</h3>
            {systemAlerts.map((alert, index) => (
              <div 
                key={index} 
                className={`alert-item alert-${alert.priority.toLowerCase()}`}
              >
                <span className="alert-icon">{alert.icon}</span>
                <div className="alert-content">
                  <div className="alert-priority">{alert.priority} Priority</div>
                  <div className="alert-message">{alert.message}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="quick-stats">
            <h3 className="section-heading">Quick Stats</h3>
            <div className="quick-stat-item">
              <div className="quick-stat-label">Approval Rate</div>
              <div className="quick-stat-value">{quickStats.approval_rate}%</div>
            </div>
            <div className="quick-stat-item">
              <div className="quick-stat-label">Avg. Processing Time</div>
              <div className="quick-stat-value">{quickStats.avg_processing_time} days</div>
            </div>
            <div className="quick-stat-item">
              <div className="quick-stat-label">Customer Satisfaction</div>
              <div className="quick-stat-value">{quickStats.customer_satisfaction}/5</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewCards;

