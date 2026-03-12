import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAnalytics, getClaims } from "../services/adminService";
import "../styles/AdminDashboard.css";

const AnalyticsSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic data states - will be populated from API
  const [claimsTrendData, setClaimsTrendData] = useState([]);
  const [fraudDetectionData, setFraudDetectionData] = useState([]);
  const [policySalesData, setPolicySalesData] = useState([]);
  const [approvalRatioData, setApprovalRatioData] = useState([]);
  const [metricsData, setMetricsData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch trend data and claims data
      const [trendData, claimsData] = await Promise.all([
        getAnalytics(),
        getClaims()
      ]);
      
      // Calculate comprehensive analytics from claims data
      const totalClaims = claimsData.length;
      const approvedClaims = claimsData.filter(c => c.status === "Approved").length;
      const pendingClaims = claimsData.filter(c => c.status === "Pending").length;
      const rejectedClaims = claimsData.filter(c => c.status === "Rejected").length;
      const underReviewClaims = claimsData.filter(c => c.status === "Under Review").length;
      
      // Calculate average claim amount
      const amounts = claimsData.map(claim => {
        const numericAmount = parseFloat(claim.amount.replace(/[₹,]/g, ""));
        return isNaN(numericAmount) ? 0 : numericAmount;
      }).filter(amt => amt > 0);
      const averageAmount = amounts.length > 0 ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;
      
      // Calculate rates
      const approvalRate = totalClaims > 0 ? (approvedClaims / totalClaims * 100) : 0;
      const fraudRate = totalClaims > 0 ? (rejectedClaims / totalClaims * 100) : 0;
      
      // Claims by type
      const claimsByType = {};
      claimsData.forEach(claim => {
        claimsByType[claim.claim_type] = (claimsByType[claim.claim_type] || 0) + 1;
      });
      
      // Set claims trend data (monthly data)
      const formattedTrendData = trendData.map(item => ({
        month: item.month,
        claims: item.claims,
        approved: Math.round(item.claims * (approvalRate / 100))
      }));
      setClaimsTrendData(formattedTrendData);
      
      // Set fraud detection data
      const cleanRate = 100 - fraudRate;
      setFraudDetectionData([
        { name: "Detected", value: fraudRate, fill: "#dc2626" },
        { name: "Clean", value: cleanRate, fill: "#10b981" },
      ]);
      
      // Set policy sales data (claims by type)
      const typeData = Object.entries(claimsByType).map(([type, count]) => ({
        name: type,
        value: count,
        fill: type === "Auto" ? "#3b82f6" : 
              type === "Health" ? "#8b5cf6" : 
              type === "Property" ? "#f59e0b" : "#ec4899"
      }));
      setPolicySalesData(typeData);
      
      // Set approval ratio data
      const rejectedAndReview = rejectedClaims + underReviewClaims;
      setApprovalRatioData([
        { name: "Approved", value: approvedClaims, fill: "#10b981" },
        { name: "Pending", value: pendingClaims, fill: "#f59e0b" },
        { name: "Rejected", value: rejectedAndReview, fill: "#ef4444" },
      ]);
      
      // Set metrics data with REAL calculated values
      setMetricsData([
        {
          title: "Average Claim Amount",
          value: `₹${Math.round(averageAmount).toLocaleString('en-IN')}`,
          change: "Live Data",
          changeType: "neutral",
          subtext: "from actual claims",
        },
        {
          title: "Fraud Detection Rate",
          value: `${fraudRate.toFixed(1)}%`,
          change: "Real-time",
          changeType: fraudRate < 15 ? "positive" : "negative",
          subtext: `${rejectedClaims} rejected`,
        },
        {
          title: "Approval Rate",
          value: `${approvalRate.toFixed(1)}%`,
          change: "Live",
          changeType: "positive",
          subtext: `${approvedClaims} of ${totalClaims} approved`,
        },
        {
          title: "Total Claims",
          value: totalClaims.toString(),
          change: "Active",
          changeType: "neutral",
          subtext: `${pendingClaims} pending`,
        },
      ]);
      
      setError(null);
    } catch (err) {
      setError("Failed to load analytics data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="analytics-section">
      <div className="section-header">
        <div>
          <h2>Performance Metrics</h2>
          <p className="section-subtitle">Real-time analytics across claims, fraud, and policy operations.</p>
        </div>
        <div className="header-actions">
          <span className="pill">Last 6 Months</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Chart 1: Claims Trend */}
        <div className="analytics-card chart-card">
          <h3 className="chart-title">Claims Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={claimsTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="claims" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Fraud Detection Rate */}
        <div className="analytics-card chart-card">
          <h3 className="chart-title">Fraud Detection Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fraudDetectionData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
              >
                {fraudDetectionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#dc2626" }}></span>
              Detected: 11.9%
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#10b981" }}></span>
              Clean: 88.1%
            </span>
          </div>
        </div>

        {/* Chart 3: Policy Sales Distribution */}
        <div className="analytics-card chart-card">
          <h3 className="chart-title">Policy Sales Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={policySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {policySalesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Claim Approval Ratio */}
        <div className="analytics-card chart-card">
          <h3 className="chart-title">Claim Approval Ratio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={approvalRatioData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {approvalRatioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#10b981" }}></span>
              Approved: 65%
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#f59e0b" }}></span>
              Pending: 20%
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#ef4444" }}></span>
              Rejected: 15%
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="analytics-metrics-section">
        <h3 className="metrics-title">Key Performance Indicators</h3>
        <div className="metrics-grid">
          {metricsData.map((metric, index) => (
            <div key={index} className="metric-card">
              <p className="metric-label">{metric.title}</p>
              <div className="metric-value">{metric.value}</div>
              <div className={`metric-change ${metric.changeType}`}>
                <span className="change-icon">
                  {metric.changeType === "positive" ? "↑" : metric.changeType === "negative" ? "↓" : "→"}
                </span>
                <span className="change-text">{metric.change}</span>
              </div>
              <p className="metric-subtext">{metric.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
