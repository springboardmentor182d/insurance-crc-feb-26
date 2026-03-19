import React, { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiChevronDown,
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

function AnalyticsNavIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 2.5V13.5H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 11V7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 11V5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 11V3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ClaimsNavIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 1.8H9.2L12.8 5.3V13.4C12.8 13.8 12.4 14.2 12 14.2H4C3.6 14.2 3.2 13.8 3.2 13.4V2.6C3.2 2.2 3.6 1.8 4 1.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.2 1.8V5.3H12.8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M5.2 9.2L6.9 10.9L10.7 7.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const navItems = [
  { key: "overview", label: "Overview", icon: FiGrid },
  { key: "users", label: "Users", icon: FiUsers },
  { key: "policies", label: "Policies", icon: FiFileText },
  { key: "claims", label: "Claims Management", icon: ClaimsNavIcon },
  { key: "fraud", label: "Fraud Rules", icon: FiAlertTriangle },
  { key: "active", label: "Active Policies", icon: FiShield },
  { key: "analytics", label: "Analytics", icon: AnalyticsNavIcon },
];

const fallbackData = {
  overview: {
    total_claims: 0,
    high_risk_claims: 0,
    active_policies: 0,
    users_with_plans: 3,
    approval_rate: 94,
    avg_processing_time_days: 2.5,
    customer_satisfaction: 4.8,
    high_priority_alerts: 0,
    medium_priority_alerts: 0,
  },
  users: [
    { initials: "JD", name: "John Doe", email: "john@example.com", plans: 2, coverage: "₹15.0L", status: "active" },
    { initials: "SS", name: "Sarah Smith", email: "sarah@example.com", plans: 1, coverage: "₹5.0L", status: "active" },
    { initials: "MJ", name: "Michael Johnson", email: "michael@example.com", plans: 3, coverage: "₹25.0L", status: "active" },
  ],
  policies: [
    { name: "Comprehensive Health Shield", provider: "HealthFirst Insurance", type: "Health", coverage: "₹5.0L", premium: "₹15,000", ratio: "95%" },
    { name: "Family Health Plus", provider: "StarCare Insurance", type: "Health", coverage: "₹10.0L", premium: "₹25,000", ratio: "92%" },
    { name: "Smart Drive Insurance", provider: "AutoSecure", type: "Auto", coverage: "₹3.0L", premium: "₹8,000", ratio: "88%" },
    { name: "Life Guard Premium", provider: "LifeSecure Insurance", type: "Life", coverage: "₹20.0L", premium: "₹30,000", ratio: "98%" },
    { name: "Home Protection Plan", provider: "HomeSafe Insurance", type: "Home", coverage: "₹50.0L", premium: "₹12,000", ratio: "90%" },
    { name: "Senior Citizen Care", provider: "ElderCare Insurance", type: "Health", coverage: "₹7.5L", premium: "₹20,000", ratio: "94%" },
  ],
  claims: [],
  fraud_rules: [
    { name: "Multiple Claims in Short Period", condition: "More than 3 claims in 30 days", severity: "High", status: "active" },
    { name: "High Value Claim on New Policy", condition: "Claim > 80% coverage within 60 days of policy start", severity: "Medium", status: "active" },
    { name: "Duplicate Document Detection", condition: "Same document used across multiple claims", severity: "High", status: "active" },
  ],
  active_policies: {
    total_active_policies: 0,
    monthly_growth_percent: 8.5,
    users_with_active_plans: 3,
    users: [
      { initials: "JD", name: "John Doe", email: "john@example.com", plans: 2, coverage: "₹15.0L", risk_level: "Medium", status: "active" },
      { initials: "SS", name: "Sarah Smith", email: "sarah@example.com", plans: 1, coverage: "₹5.0L", risk_level: "High", status: "active" },
      { initials: "MJ", name: "Michael Johnson", email: "michael@example.com", plans: 3, coverage: "₹25.0L", risk_level: "Low", status: "active" },
    ],
  },
  analytics: {
    total_revenue: "\u20b90.0L",
    claims_paid: "\u20b90.0L",
    active_users: 3,
    claim_ratio: "92%",
    monthly_trends: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      policies: [12, 15, 18, 22, 28, 32],
      claims: [8, 10, 12, 15, 18, 20],
    },
    performance_metrics: [
      { label: "Customer Satisfaction", value: "4.8/5.0", percent: 95 },
      { label: "Claim Processing Speed", value: "2.5 days avg", percent: 80 },
      { label: "Policy Renewal Rate", value: "87%", percent: 87 },
      { label: "Fraud Detection Rate", value: "98%", percent: 98 },
      { label: "User Retention", value: "92%", percent: 92 },
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

const pickList = (value, fallbackList) => (Array.isArray(value) && value.length > 0 ? value : fallbackList);
const pickPositiveNumber = (value, fallbackValue) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallbackValue;
};

const normalizeDashboardData = (data) => {
  const overviewRaw = { ...fallbackData.overview, ...(data?.overview || {}) };
  const activeRaw = { ...fallbackData.active_policies, ...(data?.active_policies || {}) };
  const analyticsRaw = {
    ...fallbackData.analytics,
    ...(data?.analytics || {}),
    monthly_trends: { ...fallbackData.analytics.monthly_trends, ...(data?.analytics?.monthly_trends || {}) },
    performance_metrics: pickList(data?.analytics?.performance_metrics, fallbackData.analytics.performance_metrics),
  };

  return {
    ...fallbackData,
    ...data,
    overview: {
      ...overviewRaw,
      users_with_plans: pickPositiveNumber(overviewRaw.users_with_plans, fallbackData.overview.users_with_plans),
      approval_rate: pickPositiveNumber(overviewRaw.approval_rate, fallbackData.overview.approval_rate),
      avg_processing_time_days: pickPositiveNumber(overviewRaw.avg_processing_time_days, fallbackData.overview.avg_processing_time_days),
      customer_satisfaction: pickPositiveNumber(overviewRaw.customer_satisfaction, fallbackData.overview.customer_satisfaction),
    },
    users: pickList(data?.users, fallbackData.users),
    policies: pickList(data?.policies, fallbackData.policies),
    claims: data?.claims || [],
    fraud_rules: pickList(data?.fraud_rules, fallbackData.fraud_rules),
    active_policies: {
      ...activeRaw,
      monthly_growth_percent: activeRaw.monthly_growth_percent > 0 ? activeRaw.monthly_growth_percent : fallbackData.active_policies.monthly_growth_percent,
      users_with_active_plans: activeRaw.users_with_active_plans > 0 ? activeRaw.users_with_active_plans : fallbackData.active_policies.users_with_active_plans,
      users: pickList(data?.active_policies?.users, fallbackData.active_policies.users),
    },
    analytics: {
      ...analyticsRaw,
      active_users: analyticsRaw.active_users > 0 ? analyticsRaw.active_users : fallbackData.analytics.active_users,
      claim_ratio: analyticsRaw.claim_ratio && analyticsRaw.claim_ratio !== "0%" && analyticsRaw.claim_ratio !== "0.0%"
        ? analyticsRaw.claim_ratio
        : fallbackData.analytics.claim_ratio,
      monthly_trends: {
        ...analyticsRaw.monthly_trends,
        policies: pickList(analyticsRaw.monthly_trends?.policies, fallbackData.analytics.monthly_trends.policies),
        claims: pickList(analyticsRaw.monthly_trends?.claims, fallbackData.analytics.monthly_trends.claims),
      },
    },
  };
};

const OverviewSection = ({ overview }) => (
  <>
    <h1 className="page-title">Admin Overview</h1>
    <div className="cards-grid four">
      <StatCard title="Total Claims" value="0" icon={FiFile} trend="+12%" trendGood tone="green" iconTick />
      <StatCard title="High-Risk Claims" value={String(overview.high_risk_claims)} icon={FiAlertTriangle} trend="-5%" tone="red" />
      <StatCard title="Active Policies" value="0" icon={FiShield} trend="+8%" trendGood tone="green" />
      <StatCard title="Users with Plans" value={String(overview.users_with_plans)} icon={FiUsers} trend="+15%" trendGood tone="green" />
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
      <StatCard title="Total Revenue" value={cleanCurrency(analytics.total_revenue)} icon={FiDollarSign} trend="+12.5%" trendGood tone="green" />
      <StatCard title="Claims Paid" value={cleanCurrency(analytics.claims_paid)} icon={ClaimsNavIcon} trend="+8.2%" trendGood tone="green" />
      <StatCard title="Active Users" value={String(analytics.active_users)} icon={FiUsers} trend="+15.3%" trendGood tone="green" />
      <StatCard title="Claim Ratio" value={analytics.claim_ratio} icon={FiTrendingUp} trend="+2.1%" trendGood tone="green" />
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

function HomeRoute() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#eef1f5", padding: "24px" }}>
      <div style={{ background: "#fff", border: "1px solid #d8dde3", borderRadius: "14px", padding: "24px", maxWidth: "680px", width: "100%" }}>
        <h1 style={{ margin: 0, fontSize: "28px", color: "#111827" }}>InsureHub</h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>Welcome. Choose where you want to go:</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
          <a href="/admin" style={{ textDecoration: "none", background: "#176620", color: "#fff", padding: "10px 14px", borderRadius: "10px", fontWeight: 700 }}>Open Admin</a>
        </div>
      </div>
    </div>
  );
}

function NotFoundRoute() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#eef1f5", padding: "24px" }}>
      <div style={{ background: "#fff", border: "1px solid #d8dde3", borderRadius: "14px", padding: "24px", maxWidth: "680px", width: "100%" }}>
        <h1 style={{ margin: 0, fontSize: "28px", color: "#111827" }}>Page Not Found</h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>Use valid routes:</p>
        <p style={{ color: "#111827", fontWeight: 700, margin: "8px 0 0" }}>/, /admin</p>
      </div>
    </div>
  );
}

function App() {
  const routeMode = useMemo(() => {
    const path = window.location.pathname.toLowerCase();
    if (path === "/" || path === "") {
      return "home";
    }
    if (path.startsWith("/admin")) {
      return "admin";
    }
    return "not-found";
  }, []);

  const [active, setActive] = useState("overview");
  const [dashboardData, setDashboardData] = useState(fallbackData);

  useEffect(() => {
    if (routeMode !== "admin") {
      return undefined;
    }

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
    return () => {
      isMounted = false;
    };
  }, [routeMode]);

  const sections = useMemo(() => ({
    overview: <OverviewSection overview={dashboardData.overview} />,
    users: <UsersSection users={fallbackData.users} />,
    policies: <PoliciesSection policies={fallbackData.policies} />,
    claims: <ClaimsSection claims={[]} highRiskClaims={0} />,
    fraud: <FraudSection fraudRules={dashboardData.fraud_rules} />,
    active: <ActivePoliciesSection activePolicies={fallbackData.active_policies} />,
    analytics: <AnalyticsSection analytics={fallbackData.analytics} />,
  }), [dashboardData]);

  const activeContent = useMemo(() => sections[active], [active, sections]);

  if (routeMode === "home") {
    return <HomeRoute />;
  }

  if (routeMode === "not-found") {
    return <NotFoundRoute />;
  }

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
            <button
              key={item.key}
              className={`side-link ${active === item.key ? "active" : ""}`}
              onClick={() => setActive(item.key)}
              type="button"
            >
              <span className="side-icon"><item.icon size={14} /></span>
              <span className="side-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="side-footer">
          <p>Logged in as</p>
          <strong>Admin User</strong>
          <button type="button" className="logout"><FiLogOut size={13} /> Logout</button>
        </div>
      </aside>

      <main className="main-content">{activeContent}</main>
    </div>
  );
}

export default App;


