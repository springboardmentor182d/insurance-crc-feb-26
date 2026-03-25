import React, { useEffect } from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiDollarSign,
  FiFile,
  FiFileText,
  FiGrid,
  FiInfo,
  FiLogOut,
  FiMail,
  FiPlus,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import apiClient from "./utils/apiClient";
import "./App.css";

function AnalyticsNavIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 3.75V18.5C4 19.33 4.67 20 5.5 20H19.5"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="7.1" y="12.2" width="2.5" height="4.3" rx="1.25" fill="currentColor" />
      <rect x="11.2" y="5.2" width="2.6" height="11.3" rx="1.3" fill="currentColor" />
      <rect x="15.8" y="8.1" width="2.6" height="8.4" rx="1.3" fill="currentColor" />
    </svg>
  );
}

function ClaimsNavIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3.75H14.25L19 8.5V18C19 19.1 18.1 20 17 20H7C5.9 20 5 19.1 5 18V5.75C5 4.65 5.9 3.75 7 3.75Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 4V8C14 8.83 14.67 9.5 15.5 9.5H19"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13L11.15 15.2L15.4 10.4"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

const emptyDashboardData = {
  overview: {
    total_claims: 0,
    high_risk_claims: 0,
    active_policies: 0,
    users_with_plans: 0,
    trends: {
      total_claims: 0,
      high_risk_claims: 0,
      active_policies: 0,
      users_with_plans: 0,
    },
    approval_rate: 0,
    avg_processing_time_days: null,
    customer_satisfaction: null,
    high_priority_alerts: 0,
    medium_priority_alerts: 0,
  },
  recent_activity: [],
  users: [],
  policies: [],
  claims: [],
  fraud_rules: [],
  active_policies: {
    total_active_policies: 0,
    monthly_growth_percent: 0,
    users_with_active_plans: 0,
    provider_breakdown: [],
    users: [],
  },
  analytics: {
    total_revenue: "-",
    claims_paid: "-",
    active_users: 0,
    claim_ratio: "-",
    monthly_trends: {
      labels: [],
      policies: [],
      claims: [],
    },
    performance_metrics: [],
    claims_by_status: {},
    policies_by_type: [],
  },
};

const normalizeDashboardData = (data) => ({
  ...emptyDashboardData,
  ...data,
  overview: { ...emptyDashboardData.overview, ...(data?.overview || {}) },
  recent_activity: Array.isArray(data?.recent_activity) ? data.recent_activity : [],
  users: Array.isArray(data?.users) ? data.users : [],
  policies: Array.isArray(data?.policies) ? data.policies : [],
  claims: Array.isArray(data?.claims) ? data.claims : [],
  fraud_rules: Array.isArray(data?.fraud_rules) ? data.fraud_rules : [],
  active_policies: {
    ...emptyDashboardData.active_policies,
    ...(data?.active_policies || {}),
    provider_breakdown: Array.isArray(data?.active_policies?.provider_breakdown)
      ? data.active_policies.provider_breakdown
      : [],
    users: Array.isArray(data?.active_policies?.users) ? data.active_policies.users : [],
  },
  analytics: {
    ...emptyDashboardData.analytics,
    ...(data?.analytics || {}),
    monthly_trends: {
      ...emptyDashboardData.analytics.monthly_trends,
      ...(data?.analytics?.monthly_trends || {}),
      labels: Array.isArray(data?.analytics?.monthly_trends?.labels) ? data.analytics.monthly_trends.labels : [],
      policies: Array.isArray(data?.analytics?.monthly_trends?.policies) ? data.analytics.monthly_trends.policies : [],
      claims: Array.isArray(data?.analytics?.monthly_trends?.claims) ? data.analytics.monthly_trends.claims : [],
    },
    performance_metrics: Array.isArray(data?.analytics?.performance_metrics)
      ? data.analytics.performance_metrics
      : [],
    claims_by_status: data?.analytics?.claims_by_status || {},
    policies_by_type: Array.isArray(data?.analytics?.policies_by_type) ? data.analytics.policies_by_type : [],
  },
});

const formatNullable = (value, suffix = "") => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return `${value}${suffix}`;
};

const riskToneClass = (riskLevel) => {
  const normalized = String(riskLevel || "").toLowerCase();
  if (normalized === "high") return "danger";
  if (normalized === "medium") return "warn";
  return "ok";
};

const titleCase = (value) =>
  String(value || "")
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");

const HomePage = () => (
  <main className="app-shell">
    <h3>Insurence_CRC</h3>
  </main>
);

const EmptyState = ({ message }) => <p className="empty-row">{message}</p>;

const RecentActivityPanel = ({ recentActivity }) => (
  <div className="panel recent-panel full-height-panel">
    <h3>Recent Activity</h3>
    {recentActivity.length ? (
      <div className="activity-list">
        {recentActivity.map((item, index) => (
          <div key={`${item.title}-${index}`} className="activity-item">
            <strong>{item.title}</strong>
            <span>{item.description || "-"}</span>
          </div>
        ))}
      </div>
    ) : (
      <EmptyState message="No recent activity found" />
    )}
  </div>
);

const SystemAlertsPanel = ({ overview }) => {
  const alerts = [
    {
      key: "high",
      tone: "high",
      title: "High Priority",
      message: `${overview.high_priority_alerts} high-risk claims pending review`,
      Icon: FiAlertTriangle,
    },
    {
      key: "medium",
      tone: "medium",
      title: "Medium Priority",
      message: `${overview.medium_priority_alerts} claims under review`,
      Icon: FiAlertTriangle,
    },
    {
      key: "info",
      tone: "info",
      title: "Info",
      message: "System operating normally",
      Icon: FiInfo,
    },
  ];

  return (
    <div className="panel alerts-panel">
      <h3>System Alerts</h3>
      {alerts.map((alert) => (
        <div key={alert.key} className={`alert-box ${alert.tone}`}>
          <div className="alert-title"><alert.Icon size={12} />{alert.title}</div>
          <div className="alert-message">{alert.message}</div>
        </div>
      ))}
    </div>
  );
};

const QuickStatsPanel = ({ overview }) => (
  <div className="panel quick-panel">
    <h3>Quick Stats</h3>
    <p>Approval Rate</p>
    <strong>{formatNullable(overview.approval_rate, "%")}</strong>
    <p>Avg. Processing Time</p>
    <strong>{formatNullable(overview.avg_processing_time_days, " days")}</strong>
    <p>Customer Satisfaction</p>
    <strong>{formatNullable(overview.customer_satisfaction, "/5")}</strong>
  </div>
);

const OverviewSection = ({ overview, recentActivity }) => (
  <>
    <h1 className="page-title">Admin Overview</h1>
    <div className="cards-grid four">
      <StatCard title="Total Claims" value={String(overview.total_claims)} icon={FiFile} tone="green" iconTick trend={overview.trends?.total_claims} />
      <StatCard title="High-Risk Claims" value={String(overview.high_risk_claims)} icon={FiAlertTriangle} tone="red" trend={overview.trends?.high_risk_claims} />
      <StatCard title="Active Policies" value={String(overview.active_policies)} icon={FiShield} tone="green" trend={overview.trends?.active_policies} />
      <StatCard title="Users with Plans" value={String(overview.users_with_plans)} icon={FiUsers} tone="green" trend={overview.trends?.users_with_plans} />
    </div>

    <div className="split-layout">
      <RecentActivityPanel recentActivity={recentActivity} />
      <div className="stack">
        <SystemAlertsPanel overview={overview} />
        <QuickStatsPanel overview={overview} />
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
          {users.map((row, index) => (
            <tr key={row.email || index}>
              <td><span className="avatar">{row.initials || "U"}</span> {row.name || "-"}</td>
              <td><span className="cell-icon"><FiMail size={14} /></span>{row.email || "-"}</td>
              <td><span className="cell-icon users-plans-icon"><FiShield size={14} /></span>{row.plans || 0}</td>
              <td>{row.coverage || "-"}</td>
              <td><span className="status-pill users-active-pill">{titleCase(row.status) || "-"}</span></td>
              <td className="action-link">View Details</td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 ? <EmptyState message="No users found" /> : null}
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
          {policies.map((row, index) => (
            <tr key={row.id || row.name || index}>
              <td>{row.name || "-"}</td>
              <td><span className="cell-icon provider-icon"><LuBuilding2 size={13} /></span>{row.provider || "-"}</td>
              <td><span className="type-pill">{row.type || "-"}</span></td>
              <td>{row.coverage || "-"}</td>
              <td>{row.premium || "-"}</td>
              <td className="ratio">{row.ratio || "-"}</td>
              <td className="action-link">Edit</td>
            </tr>
          ))}
        </tbody>
      </table>
      {policies.length === 0 ? <EmptyState message="No policies found" /> : null}
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
          {claims.map((row, index) => (
            <tr key={row.id || row.claim_id || index}>
              <td>{row.claim_id || "-"}</td>
              <td>{row.user || "-"}</td>
              <td>{row.policy || "-"}</td>
              <td>{row.type || "-"}</td>
              <td>{row.amount || "-"}</td>
              <td><span className="status-pill">{titleCase(row.status) || "-"}</span></td>
              <td><span className={`severity ${String(row.risk || "").toLowerCase()}`}>{row.risk || "-"}</span></td>
              <td className="action-link">Review</td>
            </tr>
          ))}
        </tbody>
      </table>
      {claims.length === 0 ? <EmptyState message="No claims found" /> : null}
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
          {fraudRules.map((row, index) => (
            <tr key={row.id || row.name || index}>
              <td><span className="cell-icon"><FiAlertTriangle size={14} /></span>{row.name || "-"}</td>
              <td>{row.condition || "-"}</td>
              <td><span className={`severity ${String(row.severity || "").toLowerCase()}`}>{row.severity || "-"}</span></td>
              <td><span className="status-pill">{titleCase(row.status) || "-"}</span></td>
              <td className="actions-inline"><span className="action-link">Edit</span><span className="danger">Deactivate</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      {fraudRules.length === 0 ? <EmptyState message="No fraud rules found" /> : null}
    </div>
  </>
);

const ProviderBreakdownPanel = ({ providerBreakdown }) => {
  const maxCount = Math.max(1, ...providerBreakdown.map((item) => item.count || 0));

  return (
    <div className="panel active-provider-panel">
      <h3>Active Policies by Provider</h3>
      {providerBreakdown.length ? (
        <div className="provider-list">
          {providerBreakdown.map((item) => (
            <div key={item.provider} className="provider-row">
              <div className="provider-meta">
                <span>{item.provider}</span>
                <strong>{item.count}</strong>
              </div>
              <div className="bar provider-bar">
                <div style={{ width: `${(item.count / maxCount) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No active provider data found" />
      )}
    </div>
  );
};

const ActivePoliciesSection = ({ activePolicies }) => (
  <div className="active-page">
    <h1 className="page-title">Active Policies</h1>
    <div className="cards-grid three">
      <StatCard title="Total Active Policies" value={String(activePolicies.total_active_policies)} icon={FiShield} tone="green" className="active-stat" />
      <StatCard title="Monthly Growth" value={formatNullable(activePolicies.monthly_growth_percent, "%")} icon={FiTrendingUp} tone="green" className="active-stat" />
      <StatCard title="Users with Active Plans" value={String(activePolicies.users_with_active_plans)} icon={FiUsers} tone="green" className="active-stat" />
    </div>
    <ProviderBreakdownPanel providerBreakdown={activePolicies.provider_breakdown} />
    <div className="table-panel mt16 active-users-table">
      <h3>Users with Active Plans</h3>
      <table>
        <thead>
          <tr><th>User Name</th><th>Email</th><th>Active Plans</th><th>Total Coverage</th><th>Risk Level</th><th>Status</th></tr>
        </thead>
        <tbody>
          {activePolicies.users.map((row, index) => (
            <tr key={row.email || index}>
              <td><span className="avatar">{row.initials || "U"}</span> {row.name || "-"}</td>
              <td>{row.email || "-"}</td>
              <td><span className="cell-icon"><FiShield size={13} /></span>{row.plans || 0}</td>
              <td>{row.coverage || "-"}</td>
              <td className={riskToneClass(row.risk_level)}>{row.risk_level || "-"}</td>
              <td><span className="status-pill">{titleCase(row.status) || "-"}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      {activePolicies.users.length === 0 ? <EmptyState message="No users with active plans found" /> : null}
    </div>
  </div>
);

const KeyValuePanel = ({ title, items, itemKey, keyLabel, valueLabel }) => {
  const normalizedItems = Array.isArray(items)
    ? items
    : Object.entries(items || {}).map(([key, value]) => ({ [keyLabel]: key, [valueLabel]: value }));
  const maxValue = Math.max(1, ...normalizedItems.map((item) => Number(item[valueLabel]) || 0));

  return (
    <div className="panel chart-panel">
      <h3>{title}</h3>
      {normalizedItems.length ? (
        <div className="provider-list">
          {normalizedItems.map((item, index) => (
            <div key={`${item[itemKey] || item[keyLabel]}-${index}`} className="provider-row">
              <div className="provider-meta">
                <span>{titleCase(item[itemKey] || item[keyLabel])}</span>
                <strong>{item[valueLabel] || 0}</strong>
              </div>
              <div className="bar provider-bar">
                <div style={{ width: `${((Number(item[valueLabel]) || 0) / maxValue) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message={`No ${title.toLowerCase()} data found`} />
      )}
    </div>
  );
};

const AnalyticsSection = ({ analytics }) => (
  <>
    <h1 className="page-title">Analytics</h1>
    <div className="cards-grid four">
      <StatCard title="Total Revenue" value={analytics.total_revenue || "-"} icon={FiDollarSign} tone="green" />
      <StatCard title="Claims Paid" value={analytics.claims_paid || "-"} icon={ClaimsNavIcon} tone="green" />
      <StatCard title="Active Users" value={String(analytics.active_users)} icon={FiUsers} tone="green" />
      <StatCard title="Claim Ratio" value={analytics.claim_ratio || "-"} icon={FiTrendingUp} tone="green" />
    </div>

    <div className="grid-2x2">
      <div className="panel chart-panel">
        <h3>Monthly Trends</h3>
        <MonthlyChart monthlyTrends={analytics.monthly_trends} />
      </div>
      <KeyValuePanel
        title="Claims by Status"
        items={analytics.claims_by_status}
        itemKey="status"
        keyLabel="status"
        valueLabel="count"
      />
      <KeyValuePanel
        title="Policies by Type"
        items={analytics.policies_by_type.map((item) => ({ type: item.type, count: item.count }))}
        itemKey="type"
        keyLabel="type"
        valueLabel="count"
      />
      <div className="panel metrics-panel">
        <h3>Performance Metrics</h3>
        {analytics.performance_metrics.length ? (
          analytics.performance_metrics.map(({ label, value, percent }, index) => (
            <div key={`${label}-${index}`} className="metric-row">
              <div className="metric-label"><span>{label || "-"}</span><strong>{value || "-"}</strong></div>
              <div className="bar"><div style={{ width: `${Math.min(Number(percent) || 0, 100)}%` }} /></div>
            </div>
          ))
        ) : (
          <EmptyState message="No performance metrics found" />
        )}
      </div>
    </div>
  </>
);

function MonthlyChart({ monthlyTrends }) {
  const labels = monthlyTrends?.labels?.length ? monthlyTrends.labels : [];
  const policies = monthlyTrends?.policies?.length ? monthlyTrends.policies : [];
  const claims = monthlyTrends?.claims?.length ? monthlyTrends.claims : [];

  if (!labels.length || (!policies.length && !claims.length)) {
    return <div className="chart-empty">No analytics data available</div>;
  }

  const maxValue = Math.max(1, ...policies, ...claims);
  const pointsFor = (values) =>
    values
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
      <svg viewBox="0 0 520 220" role="img" aria-label="Policy and claim monthly trend lines">
        <line x1="58" y1="188" x2="58" y2="28" className="axis" />
        <line x1="58" y1="188" x2="488" y2="188" className="axis" />
        <line x1="58" y1="148" x2="488" y2="148" className="grid" />
        <line x1="58" y1="108" x2="488" y2="108" className="grid" />
        <line x1="58" y1="68" x2="488" y2="68" className="grid" />
        <line x1="58" y1="28" x2="488" y2="28" className="grid" />
        <polyline className="line-policies" points={policyPoints} />
        <polyline className="line-claims" points={claimsPoints} />
        {policyPoints.split(" ").filter(Boolean).map((point) => {
          const [cx, cy] = point.split(",");
          return <circle key={`policy-${point}`} cx={cx} cy={cy} r="3" className="dot-policies" />;
        })}
        {claimsPoints.split(" ").filter(Boolean).map((point) => {
          const [cx, cy] = point.split(",");
          return <circle key={`claim-${point}`} cx={cx} cy={cy} r="3" className="dot-claims" />;
        })}
        <text x="44" y="192" className="tick">0</text>
        <text x="40" y="152" className="tick">{Math.round(maxValue * 0.25)}</text>
        <text x="35" y="112" className="tick">{Math.round(maxValue * 0.5)}</text>
        <text x="35" y="72" className="tick">{Math.round(maxValue * 0.75)}</text>
        <text x="35" y="32" className="tick">{maxValue}</text>
        {labels.map((label, index) => (
          <text key={`label-${label}-${index}`} x={52 + index * 72} y="206" className="tick">{label}</text>
        ))}
      </svg>
      <div className="month-axis legend-axis">
        <span className="legend-item"><span className="legend-dot policies" />Policies</span>
        <span className="legend-item"><span className="legend-dot claims" />Claims</span>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, tone = "green", className = "", iconTick = false, trend = null }) {
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
      {trend !== null ? (
        <p className={`trend ${Number(trend) >= 0 ? "good" : "bad"}`}>
          <span className="trend-leading"><FiTrendingUp size={10} /></span>
          <span className="trend-value">{`${Number(trend) > 0 ? "+" : ""}${Number(trend).toFixed(1)}%`}</span>
          <span className="trend-note">vs last month</span>
        </p>
      ) : null}
    </article>
  );
}

function AdminApp() {
  const [dashboardData, setDashboardData] = React.useState(emptyDashboardData);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const response = await apiClient.get("/api/admin/dashboard");
        if (isMounted) {
          setDashboardData(normalizeDashboardData(response.data));
        }
      } catch (error) {
        console.error("Failed to load admin dashboard", error);
        if (isMounted) {
          setDashboardData(emptyDashboardData);
        }
      }
    };

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeKey = navItems.find((item) => location.pathname.startsWith(item.path))?.key || "overview";

  return (
    <div className="admin-shell">
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
          <Route path="/" element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<OverviewSection overview={dashboardData.overview} recentActivity={dashboardData.recent_activity} />} />
          <Route path="users" element={<UsersSection users={dashboardData.users} />} />
          <Route path="policies" element={<PoliciesSection policies={dashboardData.policies} />} />
          <Route path="claims" element={<ClaimsSection claims={dashboardData.claims} highRiskClaims={dashboardData.overview.high_risk_claims} />} />
          <Route path="fraud" element={<FraudSection fraudRules={dashboardData.fraud_rules} />} />
          <Route path="active" element={<ActivePoliciesSection activePolicies={dashboardData.active_policies} />} />
          <Route path="analytics" element={<AnalyticsSection analytics={dashboardData.analytics} />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
}

export default App;
