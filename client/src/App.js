import React, { useEffect, useMemo } from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiChevronDown,
  FiClipboard,
  FiDollarSign,
  FiFile,
  FiGrid,
  FiHelpCircle,
  FiInfo,
  FiFileText,
  FiLogOut,
  FiMail,
  FiPlus,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";
import apiClient from "./utils/apiClient";
import "./App.css";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";

function AnalyticsNavIcon({ size = 14 }) {
  // L-shaped chart: thick horizontal base, three vertical bars (left short, middle medium, right tallest), all rounded
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {/* Thick horizontal base */}
      <rect x="2" y="16" width="15.5" height="2.2" rx="1.1" fill="currentColor" />
      {/* Left bar (shortest) */}
      <rect x="4" y="12" width="2.2" height="4" rx="1.1" fill="currentColor" />
      {/* Middle bar (medium) */}
      <rect x="8.2" y="8.5" width="2.2" height="7.5" rx="1.1" fill="currentColor" />
      {/* Right bar (tallest) */}
      <rect x="12.4" y="4" width="2.2" height="12" rx="1.1" fill="currentColor" />
    </svg>
  );
}


function ClaimsNavIcon({ size = 14 }) {
  // File with bold border and thick tick
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {/* File outline */}
      <rect x="3.5" y="2.5" width="13" height="15" rx="2.5" stroke="currentColor" strokeWidth="2.2" fill="none" />
      {/* Folded corner */}
      <rect x="7" y="2" width="6" height="3.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Bold checkmark */}
      <path d="M8 12.2L10 14.2L13.5 10.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const navItems = [
  { key: "overview", label: "Overview", icon: FiGrid, path: "/admin/overview" },
  { key: "users", label: "Users", icon: FiUsers, path: "/admin/users" },
  { key: "policies", label: "Policies", icon: FiFileText, path: "/admin/policies" },
  { key: "claims", label: "Claims Management", icon: ClaimsNavIcon, path: "/admin/claims" },
  { key: "fraud", label: "Fraud Rules", icon: FiAlertTriangle, path: "/admin/fraud" },
  { key: "active", label: "Active Policies", icon: FiShield, path: "/admin/active" },
  { key: "analytics", label: "Analytics", icon: AnalyticsNavIcon, path: "/admin/analytics" },
];

const fallbackData = {
  overview: {
    total_claims: 0,
    high_risk_claims: 0,
    active_policies: 0,
    users_with_plans: 0,
    approval_rate: 0,
    avg_processing_time_days: 0,
    customer_satisfaction: 0,
    high_priority_alerts: 0,
    medium_priority_alerts: 0,
  },
  users: [],
  policies: [],
  claims: [],
  fraud_rules: [],
  active_policies: {
    total_active_policies: 0,
    monthly_growth_percent: 0,
    users_with_active_plans: 0,
    users: [],
  },
  analytics: {
    total_revenue: "\u20b90.0L",
    claims_paid: "\u20b90.0L",
    active_users: 0,
    claim_ratio: "0%",
    monthly_trends: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      policies: [0, 0, 0, 0, 0, 0],
      claims: [0, 0, 0, 0, 0, 0],
    },
    performance_metrics: [
      { label: "Customer Satisfaction", value: "0.0/5.0", percent: 0 },
      { label: "Claim Processing Speed", value: "0.0 days avg", percent: 0 },
      { label: "Policy Renewal Rate", value: "0%", percent: 0 },
      { label: "Fraud Detection Rate", value: "0%", percent: 0 },
      { label: "User Retention", value: "0%", percent: 0 },
    ],
  },
};

const cleanCurrency = (value) => String(value || "\u20b90.0L").replace("Rs ", "\u20b9");

const riskToneClass = (riskLevel) => {
  const normalized = String(riskLevel || "").toLowerCase();
  if (normalized === "high") return "danger";
  if (normalized === "medium") return "warn";
  return "ok";
};

const normalizeDashboardData = (data) => ({
  ...fallbackData,
  ...data,
  overview: { ...fallbackData.overview, ...(data?.overview || {}) },
  users: data?.users || [],
  policies: data?.policies || [],
  claims: data?.claims || [],
  fraud_rules: data?.fraud_rules || [],
  active_policies: { ...fallbackData.active_policies, ...(data?.active_policies || {}) },
  analytics: {
    ...fallbackData.analytics,
    ...(data?.analytics || {}),
    monthly_trends: { ...fallbackData.analytics.monthly_trends, ...(data?.analytics?.monthly_trends || {}) },
    performance_metrics: data?.analytics?.performance_metrics || fallbackData.analytics.performance_metrics,
  },
});

const OverviewSection = ({ overview }) => (
  <>
    <h1 className="page-title">Admin Overview</h1>
    <div className="cards-grid four">
      <StatCard title="Total Claims" value={String(overview.total_claims)} icon={FiFile} trend={`${overview.total_claims > 0 ? "+" : ""}${overview.total_claims}%`} trendGood={overview.total_claims >= 0} tone="green" iconTick />
      <StatCard title="High-Risk Claims" value={String(overview.high_risk_claims)} icon={FiAlertTriangle} trend={`${overview.high_risk_claims > 0 ? "+" : ""}${overview.high_risk_claims}%`} tone="red" />
      <StatCard title="Active Policies" value={String(overview.active_policies)} icon={FiShield} trend={`${overview.active_policies > 0 ? "+" : ""}${overview.active_policies}%`} trendGood={overview.active_policies >= 0} tone="green" />
      <StatCard title="Users with Plans" value={String(overview.users_with_plans)} icon={FiUsers} trend={`${overview.users_with_plans > 0 ? "+" : ""}${overview.users_with_plans}%`} trendGood={overview.users_with_plans >= 0} tone="green" />
    </div>

    <div className="split-layout">
      <div className="panel recent-panel">
        <h3>Recent Activity</h3>
      </div>

      <div className="stack">
        <div className="panel alerts-panel">
          <h3>System Alerts</h3>
          <div className="alert-box high">
            <div className="alert-title"><FiAlertTriangle size={12} />High Priority</div>
            <div className="alert-message">{overview.high_priority_alerts} high-risk claims pending review</div>
          </div>
          <div className="alert-box medium">
            <div className="alert-title"><FiAlertTriangle size={12} />Medium Priority</div>
            <div className="alert-message">{overview.medium_priority_alerts} claims under review</div>
          </div>
          <div className="alert-box info">
            <div className="alert-title"><FiInfo size={12} />Info</div>
            <div className="alert-message">System operating normally</div>
          </div>
        </div>

        <div className="panel quick-panel">
          <h3>Quick Stats</h3>
          <p>Approval Rate</p>
          <strong>{overview.approval_rate}%</strong>
          <p>Avg. Processing Time</p>
          <strong>{overview.avg_processing_time_days} days</strong>
          <p>Customer Satisfaction</p>
          <strong>{overview.customer_satisfaction}/5</strong>
        </div>
      </div>
    </div>
  </>
);

const UsersSection = ({ users }) => (
  <>
    <div className="title-row">
      <h1 className="page-title">Users</h1>
      <div className="mini-stat">
        <span>Total Users</span>
        <strong>{users.length}</strong>
      </div>
    </div>
    <div className="table-panel users-table">
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Active Plans</th>
            <th>Total Coverage</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((row) => (
            <tr key={row.email}>
              <td><span className="avatar">{row.initials}</span> {row.name}</td>
              <td><span className="cell-icon"><FiMail size={14} /></span>{row.email}</td>
              <td><span className="cell-icon users-plans-icon"><FiShield size={14} /></span>{row.plans}</td>
              <td>{cleanCurrency(row.coverage)}</td>
              <td><span className="status-pill users-active-pill">{row.status}</span></td>
              <td className="action-link">View Details</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const PoliciesSection = ({ policies }) => (
  <>
    <div className="title-row">
      <h1 className="page-title">Policies</h1>
      <button className="primary-btn"><FiPlus size={15} /> Add Policy</button>
    </div>
    <div className="table-panel">
      <table>
        <thead>
          <tr>
            <th>Policy Name</th>
            <th>Provider</th>
            <th>Type</th>
            <th>Coverage</th>
            <th>Premium</th>
            <th>Claim Ratio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td><span className="cell-icon provider-icon"><LuBuilding2 size={13} /></span>{row.provider}</td>
              <td><span className="type-pill">{row.type}</span></td>
              <td>{cleanCurrency(row.coverage)}</td>
              <td>{cleanCurrency(row.premium)}</td>
              <td className="ratio">{row.ratio}</td>
              <td className="action-link">Edit</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const ClaimsSection = ({ claims, highRiskClaims }) => (
  <>
    <div className="title-row">
      <h1 className="page-title">Claims Management</h1>
      <div className="mini-grid">
        <div className="mini-stat"><span>Pending Review</span><strong>{claims.filter((claim) => String(claim.status).toLowerCase() === "pending").length}</strong></div>
        <div className="mini-stat"><span>High Risk</span><strong className="danger">{highRiskClaims}</strong></div>
      </div>
    </div>
    <div className="table-panel">
      <table>
        <thead>
          <tr>
            <th>Claim ID</th><th>User</th><th>Policy</th><th>Type</th><th>Amount</th><th>Status</th><th>Risk</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((row) => (
            <tr key={row.claim_id}>
              <td>{row.claim_id}</td>
              <td>{row.user}</td>
              <td>{row.policy}</td>
              <td>{row.type}</td>
              <td>{cleanCurrency(row.amount)}</td>
              <td><span className="status-pill">{row.status}</span></td>
              <td><span className={`severity ${String(row.risk).toLowerCase()}`}>{row.risk}</span></td>
              <td className="action-link">Review</td>
            </tr>
          ))}
        </tbody>
      </table>
      {claims.length === 0 ? <p className="empty-row claims-empty-row">No claims filed yet</p> : null}
    </div>
  </>
);

const FraudSection = ({ fraudRules }) => (
  <>
    <div className="title-row">
      <h1 className="page-title">Fraud Rules</h1>
      <button className="primary-btn"><FiPlus size={15} /> Add Rule</button>
    </div>
    <div className="table-panel">
      <table>
        <thead>
          <tr><th>Rule Name</th><th>Condition</th><th>Severity</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {fraudRules.map((row) => (
            <tr key={row.name}>
              <td><span className="cell-icon"><FiAlertTriangle size={14} /></span>{row.name}</td>
              <td>{row.condition}</td>
              <td><span className={`severity ${row.severity.toLowerCase()}`}>{row.severity}</span></td>
              <td><span className="status-pill">{row.status}</span></td>
              <td className="actions-inline"><span className="action-link">Edit</span><span className="danger">Deactivate</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const ActivePoliciesSection = ({ activePolicies }) => (
  <div className="active-page">
    <h1 className="page-title">Active Policies</h1>
    <div className="cards-grid three">
      <StatCard title="Total Active Policies" value={String(activePolicies.total_active_policies)} icon={FiShield} tone="green" className="active-stat" />
      <StatCard title="Monthly Growth" value={`${activePolicies.monthly_growth_percent > 0 ? "+" : ""}${activePolicies.monthly_growth_percent}%`} icon={FiTrendingUp} tone="green" className="active-stat" />
      <StatCard title="Users with Active Plans" value={String(activePolicies.users_with_active_plans)} icon={FiUsers} tone="green" className="active-stat" />
    </div>
    <div className="panel chart-panel active-provider-panel">
      <h3>Active Policies by Provider</h3>
      <div className="active-provider-canvas">
        <div className="active-provider-inner" />
        <div className="active-provider-baseline" />
      </div>
      <div className="active-legend"><span className="active-legend-dot" />policies</div>
    </div>
    <div className="table-panel mt16 active-users-table">
      <h3>Users with Active Plans</h3>
      <table>
        <thead>
          <tr><th>User Name</th><th>Email</th><th>Active Plans</th><th>Total Coverage</th><th>Risk Level</th><th>Status</th></tr>
        </thead>
        <tbody>
          {activePolicies.users.map((row) => (
            <tr key={row.email}>
              <td><span className="avatar">{row.initials}</span> {row.name}</td>
              <td>{row.email}</td>
              <td><span className="cell-icon"><FiShield size={13} /></span>{row.plans}</td>
              <td>{cleanCurrency(row.coverage)}</td>
              <td className={riskToneClass(row.risk_level)}>{row.risk_level}</td>
              <td><span className="status-pill">{row.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AnalyticsSection = ({ analytics }) => (
  <>
    <h1 className="page-title">Analytics</h1>
    <div className="cards-grid four">
      <StatCard title="Total Revenue" value={cleanCurrency(analytics.total_revenue)} icon={FiDollarSign} trend="0%" trendGood tone="green" />
      <StatCard title="Claims Paid" value={cleanCurrency(analytics.claims_paid)} icon={ClaimsNavIcon} trend="0%" trendGood tone="green" />
      <StatCard title="Active Users" value={String(analytics.active_users)} icon={FiUsers} trend="0%" trendGood tone="green" />
      <StatCard title="Claim Ratio" value={analytics.claim_ratio} icon={FiTrendingUp} trend="0%" trendGood tone="green" />
    </div>

    <div className="grid-2x2">
      <div className="panel chart-panel">
        <h3>Monthly Trends</h3>
        <MonthlyChart monthlyTrends={analytics.monthly_trends} />
      </div>
      <div className="panel chart-panel">
        <h3>Claims by Status</h3>
      </div>
      <div className="panel chart-panel">
        <h3>Policies by Type</h3>
      </div>
      <div className="panel metrics-panel">
        <h3>Performance Metrics</h3>
        {analytics.performance_metrics.map(({ label, value, percent }) => (
          <div key={label} className="metric-row">
            <div className="metric-label"><span>{label}</span><strong>{value}</strong></div>
            <div className="bar"><div style={{ width: `${percent}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  </>
);

function MonthlyChart({ monthlyTrends }) {
  const labels = monthlyTrends?.labels?.length ? monthlyTrends.labels : fallbackData.analytics.monthly_trends.labels;
  const policies = monthlyTrends?.policies?.length ? monthlyTrends.policies : fallbackData.analytics.monthly_trends.policies;
  const claims = monthlyTrends?.claims?.length ? monthlyTrends.claims : fallbackData.analytics.monthly_trends.claims;
  const maxValue = Math.max(1, ...policies, ...claims);
  const pointsFor = (values) => values
    .map((value, index) => {
      const x = 58 + index * 72;
      const y = 188 - (value / maxValue) * 150;
      return `${x},${y.toFixed(1)}`;
    })
    .join(" ");
  const policyPoints = pointsFor(policies);
  const claimsPoints = pointsFor(claims);

  return (
    <div className="monthly-chart" aria-label="Monthly trends chart">
      <svg viewBox="0 0 520 220" role="img" aria-label="Revenue and claims monthly trend lines">
        <line x1="58" y1="188" x2="58" y2="28" className="axis" />
        <line x1="58" y1="188" x2="488" y2="188" className="axis" />

        <line x1="58" y1="148" x2="488" y2="148" className="grid" />
        <line x1="58" y1="108" x2="488" y2="108" className="grid" />
        <line x1="58" y1="68" x2="488" y2="68" className="grid" />
        <line x1="58" y1="28" x2="488" y2="28" className="grid" />

        <polyline className="line-policies" points={policyPoints} />
        <polyline className="line-claims" points={claimsPoints} />

        {policyPoints.split(" ").map((p) => {
          const [cx, cy] = p.split(",");
          return <circle key={`p-${p}`} cx={cx} cy={cy} r="3" className="dot-policies" />;
        })}
        {claimsPoints.split(" ").map((p) => {
          const [cx, cy] = p.split(",");
          return <circle key={`c-${p}`} cx={cx} cy={cy} r="3" className="dot-claims" />;
        })}

        <text x="44" y="192" className="tick">0</text>
        <text x="40" y="152" className="tick">{Math.round(maxValue * 0.25)}</text>
        <text x="35" y="112" className="tick">{Math.round(maxValue * 0.5)}</text>
        <text x="35" y="72" className="tick">{Math.round(maxValue * 0.75)}</text>
        <text x="35" y="32" className="tick">{maxValue}</text>

        {labels.map((label, index) => (
          <text key={`m-${label}-${index}`} x={52 + index * 72} y="206" className="tick">{label}</text>
        ))}
      </svg>
      <div className="month-axis legend-axis">
        <span className="legend-item"><span className="legend-dot policies" />Policies</span>
        <span className="legend-item"><span className="legend-dot claims" />Claims</span>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendGood, tone = "green", className = "", iconTick = false }) {
  return (
    <article className={`stat-card ${className}`.trim()}>
      <div className="card-head">
        <span>{title}</span>
        <div className={`icon-box ${tone} ${iconTick ? "with-tick" : ""}`}>
          <Icon size={18} />
          {iconTick ? <FiCheck size={8} className="icon-tick" /> : null}
        </div>
      </div>
      <h2>{value}</h2>
      {trend ? (
        <p className={trendGood ? "trend good" : "trend"}>
          <span className="trend-leading"><FiTrendingUp size={10} /></span>
          <span className="trend-value">{trend}</span>
          <span className="trend-note">vs last month</span>
        </p>
      ) : null}
    </article>
  );
}

function App() {
  const [dashboardData, setDashboardData] = React.useState(fallbackData);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      try {
        const response = await apiClient.get("/api/admin/dashboard");
        if (isMounted) {
          setDashboardData(normalizeDashboardData(response.data));
        }
      } catch {
        if (isMounted) {
          setDashboardData(fallbackData);
        }
      }
    };
    loadDashboard();
    return () => { isMounted = false; };
  }, []);

  // Determine active nav item from URL
  const activeKey = navItems.find(item => location.pathname.startsWith(item.path))?.key || "overview";

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="top-left">
          <span className="figma-dot"><FiGrid size={12} /></span>
          <span className="ai-badge">AI</span>
        </div>
        <p>Insurance Comparison Platform UI <FiChevronDown size={10} /></p>
        <button className="help-btn" type="button"><FiHelpCircle size={12} /></button>
        <button className="share-btn">Share</button>
      </header>

      <aside className="sidebar">
        <div className="brand">
          <h2>InsureHub</h2>
          <p>Admin Portal</p>
        </div>

        <nav>
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`side-link ${activeKey === item.key ? "active" : ""}`}
            >
              <span className="side-icon"><item.icon size={14} /></span>
              <span className="side-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="side-footer">
          <p>Logged in as</p>
          <strong>Admin User</strong>
          <button type="button" className="logout"><FiLogOut size={13} /> Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/admin/overview" element={<OverviewSection overview={dashboardData.overview} />} />
          <Route path="/admin/users" element={<UsersSection users={dashboardData.users} />} />
          <Route path="/admin/policies" element={<PoliciesSection policies={dashboardData.policies} />} />
          <Route path="/admin/claims" element={<ClaimsSection claims={dashboardData.claims} highRiskClaims={dashboardData.overview.high_risk_claims} />} />
          <Route path="/admin/fraud" element={<FraudSection fraudRules={dashboardData.fraud_rules} />} />
          <Route path="/admin/active" element={<ActivePoliciesSection activePolicies={dashboardData.active_policies} />} />
          <Route path="/admin/analytics" element={<AnalyticsSection analytics={dashboardData.analytics} />} />
          <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;


