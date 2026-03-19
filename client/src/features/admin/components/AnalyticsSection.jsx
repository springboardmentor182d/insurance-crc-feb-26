import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { getAnalytics, getClaims } from "../services/adminService";
import "../styles/AdminDashboard.css";

const AnalyticsSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Consolidated Data State
  const [data, setData] = useState({
    trend: [],
    fraud: [],
    sales: [],
    ratio: [],
    metrics: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [trendRaw, claimsData] = await Promise.all([getAnalytics(), getClaims()]);
      
      // 1. Basic Counts
      const total = claimsData.length;
      const approved = claimsData.filter(c => c.status === "Approved").length;
      const pending = claimsData.filter(c => c.status === "Pending").length;
      const rejected = claimsData.filter(c => c.status === "Rejected").length;
      const review = claimsData.filter(c => c.status === "Under Review").length;

      // 2. Financials & Rates
      const amounts = claimsData
        .map(c => parseFloat(c.amount?.replace(/[₹,]/g, "")) || 0)
        .filter(amt => amt > 0);
      
      const avgAmt = amounts.length ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;
      const approvalRate = total > 0 ? (approved / total) * 100 : 0;
      const fraudRate = total > 0 ? (rejected / total) * 100 : 0;

      // 3. Data Transformations for Charts
      const salesMap = {};
      claimsData.forEach(c => salesMap[c.claim_type] = (salesMap[c.claim_type] || 0) + 1);

      setData({
        trend: trendRaw.map(item => ({
          ...item,
          approved: Math.round(item.claims * (approvalRate / 100))
        })),
        fraud: [
          { name: "Detected", value: fraudRate, fill: "#dc2626" },
          { name: "Clean", value: 100 - fraudRate, fill: "#10b981" }
        ],
        sales: Object.entries(salesMap).map(([type, count]) => ({
          name: type,
          value: count,
          fill: { Auto: "#3b82f6", Health: "#8b5cf6", Property: "#f59e0b" }[type] || "#ec4899"
        })),
        ratio: [
          { name: "Approved", value: approved, fill: "#10b981" },
          { name: "Pending", value: pending, fill: "#f59e0b" },
          { name: "Rejected/Review", value: rejected + review, fill: "#ef4444" }
        ],
        metrics: [
          { title: "Avg Claim Amount", value: `₹${Math.round(avgAmt).toLocaleString('en-IN')}`, sub: "from actual claims", type: "neutral" },
          { title: "Fraud Rate", value: `${fraudRate.toFixed(1)}%`, sub: `${rejected} rejected`, type: fraudRate < 15 ? "positive" : "negative" },
          { title: "Approval Rate", value: `${approvalRate.toFixed(1)}%`, sub: `${approved} of ${total}`, type: "positive" },
          { title: "Total Claims", value: total.toString(), sub: `${pending} pending`, type: "neutral" }
        ]
      });

      setError(null);
    } catch (err) {
      setError("Failed to load analytics data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error">{error}</div>;

  const tooltipStyle = {
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "#fff",
  };

  return (
    <div className="analytics-section">
      <header className="section-header">
        <div>
          <h2>Performance Metrics</h2>
          <p className="section-subtitle">Real-time analytics across operations.</p>
        </div>
        <span className="pill">Last 6 Months</span>
      </header>

      <div className="analytics-charts-grid">
        {/* Claims Trend */}
        <ChartCard title="Claims Trend (Last 6 Months)">
          <LineChart data={data.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Line type="monotone" dataKey="claims" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ChartCard>

        {/* Fraud Rate */}
        <ChartCard title="Fraud Detection Rate" legend={data.fraud}>
          <PieChart>
            <Pie data={data.fraud} innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
              {data.fraud.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ChartCard>

        {/* Sales Distribution */}
        <ChartCard title="Policy Sales Distribution">
          <BarChart data={data.sales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.sales.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ChartCard>

        {/* Approval Ratio */}
        <ChartCard title="Claim Approval Ratio" legend={data.ratio}>
          <PieChart>
            <Pie data={data.ratio} outerRadius={100} paddingAngle={3} dataKey="value">
              {data.ratio.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ChartCard>
      </div>

      {/* KPI Metrics */}
      <div className="analytics-metrics-section">
        <h3 className="metrics-title">Key Performance Indicators</h3>
        <div className="metrics-grid">
          {data.metrics.map((m, i) => (
            <div key={i} className="metric-card">
              <p className="metric-label">{m.title}</p>
              <div className="metric-value">{m.value}</div>
              <div className={`metric-change ${m.type}`}>
                <span className="change-text">{m.type === "positive" ? "↑ Live" : "→ Active"}</span>
              </div>
              <p className="metric-subtext">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper Components to remove JSX duplication
const ChartCard = ({ title, children, legend }) => (
  <div className="analytics-card chart-card">
    <h3 className="chart-title">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>{children}</ResponsiveContainer>
    {legend && (
      <div className="chart-legend">
        {legend.map((item, i) => (
          <span key={i} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: item.fill }}></span>
            {item.name}: {item.value.toFixed ? item.value.toFixed(1) : item.value}%
          </span>
        ))}
      </div>
    )}
  </div>
);

export default AnalyticsSection;