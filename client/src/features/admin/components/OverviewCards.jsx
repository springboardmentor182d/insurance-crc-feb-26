import React, { useEffect, useState, useCallback } from "react";
import { getOverview } from "../services/adminService";
import { adminService } from "../../../services/apiService";
import "../styles/AdminDashboard.css";

const OverviewCards = () => {
  // 1. Unified State for cleaner updates and fewer re-renders
  const [data, setData] = useState({
    stats: { total_users: 0, active_policies: 0, claims: 0, fraud_alerts: 0 },
    quickStats: { approval_rate: 0, avg_processing_time: 0, customer_satisfaction: 0 },
    systemAlerts: [],
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      // Fetching all data in parallel for better performance
      const [overview, quick, alerts, activity] = await Promise.all([
        getOverview(),
        adminService.getQuickStats(),
        adminService.getSystemAlerts(),
        adminService.getRecentActivity(),
      ]);

      setData({
        stats: overview || {},
        quickStats: quick || {},
        systemAlerts: alerts?.alerts || [],
        recentActivities: activity?.activities || [],
      });
      setError(null);
    } catch (err) {
      setError("Failed to load dashboard overview data");
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  if (loading) return <div className="loading">Loading overview...</div>;
  if (error) return <div className="error">{error}</div>;

  const { stats, quickStats, systemAlerts, recentActivities } = data;

  // Configuration for the top stat cards
  const cards = [
    { title: "Total Claims", value: stats.claims, icon: "📄" },
    { title: "High-Risk Claims", value: stats.fraud_alerts, icon: "⚠️" },
    { title: "Active Policies", value: stats.active_policies, icon: "🛡️" },
    { title: "Users with Plans", value: stats.total_users, icon: "👥" },
  ];

  return (
    <div className="overview-container">
      {/* Top Statistic Cards */}
      <div className="overview-cards-grid">
        {cards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">{card.title}</span>
              <span className="stat-card-icon">{card.icon}</span>
            </div>
            <div className="stat-card-value">{card.value || 0}</div>
          </div>
        ))}
      </div>

      <div className="overview-bottom-section">
        {/* Recent Activity Section */}
        <div className="activity-section">
          <h3 className="section-heading">Recent Activity</h3>
          <div className="activity-content">
            {recentActivities.length > 0 ? (
              <div className="activities-list">
                {recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-timestamp">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                    <div className="activity-details">
                      <div className="activity-action">
                        <span className={`activity-badge activity-${activity.entity_type?.toLowerCase()}`}>
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

        {/* Sidebar: Alerts & Quick Stats */}
        <div className="alerts-stats-section">
          <div className="system-alerts">
            <h3 className="section-heading">System Alerts</h3>
            {systemAlerts.map((alert, index) => (
              <div key={index} className={`alert-item alert-${alert.priority?.toLowerCase()}`}>
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
            <StatItem label="Approval Rate" value={`${quickStats.approval_rate}%`} />
            <StatItem label="Avg. Processing Time" value={`${quickStats.avg_processing_time} days`} />
            <StatItem label="Customer Satisfaction" value={`${quickStats.customer_satisfaction}/5`} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Item component to keep code DRY
const StatItem = ({ label, value }) => (
  <div className="quick-stat-item">
    <div className="quick-stat-label">{label}</div>
    <div className="quick-stat-value">{value}</div>
  </div>
);

export default OverviewCards;