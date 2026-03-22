<<<<<<< HEAD
import React, { useEffect, useMemo, useState } from "react";
import apiClient from "./utils/apiClient";
import "./App.css";

const BaseIcon = ({ size = 14, children }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    {children}
  </svg>
);

const IconAlert = ({ size = 14 }) => (
  <BaseIcon size={size}>
    <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M8 6V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="8" cy="11.2" r="0.8" fill="currentColor" />
  </BaseIcon>
);

const IconCheck = ({ size = 14, className = "" }) => (
  <span className={className}>
    <BaseIcon size={size}>
      <path d="M3.5 8.3L6.6 11.3L12.5 5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  </span>
);

const IconDollar = ({ size = 14 }) => (
  <BaseIcon size={size}>
    <path d="M8 2.3V13.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M11.2 4.5C10.6 3.8 9.4 3.4 8.2 3.4C6.7 3.4 5.6 4.1 5.6 5.2C5.6 6.3 6.5 6.8 8.1 7.1C9.7 7.4 10.8 7.9 10.8 9.2C10.8 10.5 9.6 11.3 8 11.3C6.7 11.3 5.5 10.9 4.7 10.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </BaseIcon>
);

const IconFile = ({ size = 14 }) => (
  <BaseIcon size={size}>
    <path d="M4 1.8H9.2L12.8 5.2V13.4C12.8 13.8 12.4 14.2 12 14.2H4C3.6 14.2 3.2 13.8 3.2 13.4V2.6C3.2 2.2 3.6 1.8 4 1.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M9.2 1.8V5.2H12.8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </BaseIcon>
);

const IconGrid = ({ size = 14 }) => (
  <BaseIcon size={size}>
    <rect x="2.3" y="2.3" width="4.6" height="4.6" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <rect x="9.1" y="2.3" width="4.6" height="4.6" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <rect x="2.3" y="9.1" width="4.6" height="4.6" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <rect x="9.1" y="9.1" width="4.6" height="4.6" rx="1" stroke="currentColor" strokeWidth="1.4" />
  </BaseIcon>
);

const IconInfo = ({ size = 14 }) => (
  <BaseIcon size={size}>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 7V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="8" cy="4.8" r="0.9" fill="currentColor" />
  </BaseIcon>
);

const IconFileText = ({ size = 14 }) => (
  <BaseIcon size={size}>
    <path d="M4 1.8H9.2L12.8 5.2V13.4C12.8 13.8 12.4 14.2 12 14.2H4C3.6 14.2 3.2 13.8 3.2 13.4V2.6C3.2 2.2 3.6 1.8 4 1.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M5.3 7.2H10.7M5.3 9.4H10.7M5.3 11.6H9.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </BaseIcon>
);

const IconLogout = ({ size = 14 }) => (
  <BaseIcon size={size}>
    <path d="M6.1 2.6H3.8C3.4 2.6 3 3 3 3.4V12.6C3 13 3.4 13.4 3.8 13.4H6.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 8H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M10.9 5.2L13.7 8L10.9 10.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </BaseIcon>
);

const IconMail = ({ size = 14 }) => (
  <BaseIcon size={size}>
    <rect x="2" y="3.2" width="12" height="9.6" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2.8 4.1L8 8.3L13.2 4.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </BaseIcon>
);

const IconPlus = ({ size = 14 }) => (
  <BaseIcon size={size}>
    <path d="M8 3V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M3 8H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </BaseIcon>
);

const IconShield = ({ size = 14 }) => (
  <BaseIcon size={size}>
    <path d="M8 2.1L12.8 3.8V7.4C12.8 10.6 10.7 12.8 8 13.9C5.3 12.8 3.2 10.6 3.2 7.4V3.8L8 2.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </BaseIcon>
);

const IconTrend = ({ size = 14 }) => (
  <BaseIcon size={size}>
    <path d="M2.5 11.2L6.2 7.5L8.8 10.1L13.5 5.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.6 5.4H13.5V8.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </BaseIcon>
);

const IconUsers = ({ size = 14 }) => (
  <BaseIcon size={size}>
    <circle cx="5.4" cy="5.5" r="2.1" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10.7" cy="6.2" r="1.7" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2.6 11.9C2.8 10 4.2 8.7 5.9 8.7C7.6 8.7 9 10 9.2 11.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9.1 11.9C9.3 10.7 10.1 9.9 11.4 9.7C12.4 9.6 13.2 10.2 13.5 11.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
  </BaseIcon>
);

const IconBuilding = ({ size = 14 }) => (
  <BaseIcon size={size}>
    <rect x="3" y="2.3" width="10" height="11.4" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5.5 5.2H7M9 5.2H10.5M5.5 7.7H7M9 7.7H10.5M5.5 10.2H7M9 10.2H10.5M7.8 13.7V11.4H8.2V13.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </BaseIcon>
);

function AnalyticsNavIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 2.5V13.5H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 11V8.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 11V4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 11V6.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
  { key: "overview", label: "Overview", icon: IconGrid },
  { key: "users", label: "Users", icon: IconUsers },
  { key: "policies", label: "Policies", icon: IconFileText },
  { key: "claims", label: "Claims Management", icon: ClaimsNavIcon },
  { key: "fraud", label: "Fraud Rules", icon: IconAlert },
  { key: "active", label: "Active Policies", icon: IconShield },
  { key: "analytics", label: "Analytics", icon: AnalyticsNavIcon },
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
  recent_activity: [],
  policies: [],
  claims: [],
  fraud_rules: [],
  active_policies: {
    total_active_policies: 0,
    monthly_growth_percent: 0,
    users_with_active_plans: 0,
    by_provider: [],
    users: [],
  },
  analytics: {
    total_revenue: "\u20b90",
    claims_paid: "\u20b90",
    active_users: 0,
    claim_ratio: "0%",
    monthly_trends: {
      labels: [],
      policies: [],
      claims: [],
    },
    performance_metrics: [],
  },
};

const cleanCurrency = (value) => String(value || "\u20b90.0L").replace("Rs ", "\u20b9");
const formatTrend = (value) => {
  const num = Number(value || 0);
  const prefix = num > 0 ? "+" : "";
  return `${prefix}${num.toFixed(1)}%`;
};

const safeLower = (value) => String(value || "").toLowerCase();

const riskToneClass = (riskLevel) => {
  const normalized = String(riskLevel || "").toLowerCase();
  if (normalized === "high") return "danger";
  if (normalized === "medium") return "warn";
  return "ok";
};

const pickList = (value, fallbackList) => (Array.isArray(value) ? value : fallbackList);

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
    recent_activity: pickList(data?.recent_activity, fallbackData.recent_activity),
    overview: {
      ...overviewRaw,
      users_with_plans: Number(overviewRaw.users_with_plans) || 0,
      approval_rate: Number(overviewRaw.approval_rate) || 0,
      avg_processing_time_days: Number(overviewRaw.avg_processing_time_days) || 0,
      customer_satisfaction: Number(overviewRaw.customer_satisfaction) || 0,
    },
    users: pickList(data?.users, fallbackData.users),
    policies: pickList(data?.policies, fallbackData.policies),
    claims: data?.claims || [],
    fraud_rules: pickList(data?.fraud_rules, fallbackData.fraud_rules),
    active_policies: {
      ...activeRaw,
      monthly_growth_percent: Number(activeRaw.monthly_growth_percent) || 0,
      users_with_active_plans: Number(activeRaw.users_with_active_plans) || 0,
      by_provider: pickList(data?.active_policies?.by_provider, fallbackData.active_policies.by_provider),
      users: pickList(data?.active_policies?.users, fallbackData.active_policies.users),
    },
    analytics: {
      ...analyticsRaw,
      active_users: Number(analyticsRaw.active_users) || 0,
      claim_ratio: analyticsRaw.claim_ratio || "0%",
      monthly_trends: {
        ...analyticsRaw.monthly_trends,
        policies: pickList(analyticsRaw.monthly_trends?.policies, fallbackData.analytics.monthly_trends.policies),
        claims: pickList(analyticsRaw.monthly_trends?.claims, fallbackData.analytics.monthly_trends.claims),
      },
    },
  };
};

const OverviewSection = ({ overview, recentActivity = [] }) => (
  <>
    <h1 className="page-title">Admin Overview</h1>
    <div className="cards-grid four">
      <StatCard title="Total Claims" value={String(overview.total_claims)} icon={IconFile} trend={formatTrend(overview.claims_trend_percent)} trendGood={Number(overview.claims_trend_percent) >= 0} tone="green" iconTick />
      <StatCard title="High-Risk Claims" value={String(overview.high_risk_claims)} icon={IconAlert} trend={formatTrend(overview.high_risk_trend_percent)} trendGood={Number(overview.high_risk_trend_percent) <= 0} tone="red" />
      <StatCard title="Active Policies" value={String(overview.active_policies)} icon={IconShield} trend={formatTrend(overview.active_policies_trend_percent)} trendGood={Number(overview.active_policies_trend_percent) >= 0} tone="green" />
      <StatCard title="Users with Plans" value={String(overview.users_with_plans)} icon={IconUsers} trend={formatTrend(overview.users_with_plans_trend_percent)} trendGood={Number(overview.users_with_plans_trend_percent) >= 0} tone="green" />
    </div>

    <div className="split-layout">
      <div className="panel recent-panel">
        <h3>Recent Activity</h3>
        {recentActivity.length > 0 ? (
          <div>
            {recentActivity.slice(0, 3).map((item) => (
              <div key={item.id || `${item.title}-${item.timestamp}`} style={{ marginBottom: "6px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#334155" }}>{item.title || "Activity"}</div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>{item.description || ""}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: "#64748b", fontSize: "11px" }}>No recent activity found.</p>
        )}
      </div>

      <div className="stack">
        <div className="panel alerts-panel">
          <h3>System Alerts</h3>
          <div className="alert-box high">
            <div className="alert-title"><IconAlert size={12} />High Priority</div>
            <div className="alert-message">{overview.high_priority_alerts} high-risk claims pending review</div>
          </div>
          <div className="alert-box medium">
            <div className="alert-title"><IconAlert size={12} />Medium Priority</div>
            <div className="alert-message">{overview.medium_priority_alerts} claims under review</div>
          </div>
          <div className="alert-box info">
            <div className="alert-title"><IconInfo size={12} />Info</div>
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
              <td><span className="cell-icon"><IconMail size={14} /></span>{row.email}</td>
              <td><span className="cell-icon users-plans-icon"><IconShield size={14} /></span>{row.plans}</td>
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
      <button className="primary-btn"><IconPlus size={15} /> Add Policy</button>
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
              <td><span className="cell-icon provider-icon"><IconBuilding size={13} /></span>{row.provider}</td>
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
      <button className="primary-btn"><IconPlus size={15} /> Add Rule</button>
    </div>
    <div className="table-panel">
      <table>
        <thead>
          <tr><th>Rule Name</th><th>Condition</th><th>Severity</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {fraudRules.map((row) => (
            <tr key={row.name}>
              <td><span className="cell-icon"><IconAlert size={14} /></span>{row.name}</td>
              <td>{row.condition}</td>
              <td><span className={`severity ${safeLower(row.severity)}`}>{row.severity}</span></td>
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
      <StatCard title="Total Active Policies" value={String(activePolicies.total_active_policies)} icon={IconShield} tone="green" className="active-stat" />
      <StatCard title="Monthly Growth" value={`${activePolicies.monthly_growth_percent > 0 ? "+" : ""}${activePolicies.monthly_growth_percent}%`} icon={IconTrend} tone="green" className="active-stat" />
      <StatCard title="Users with Active Plans" value={String(activePolicies.users_with_active_plans)} icon={IconUsers} tone="green" className="active-stat" />
    </div>
    <div className="panel chart-panel active-provider-panel">
      <h3>Active Policies by Provider</h3>
      <ProviderBreakdown providers={activePolicies.by_provider} />
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
              <td><span className="cell-icon"><IconShield size={13} /></span>{row.plans}</td>
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
      <StatCard title="Total Revenue" value={cleanCurrency(analytics.total_revenue)} icon={IconDollar} trend={formatTrend(analytics.total_revenue_trend_percent)} trendGood={Number(analytics.total_revenue_trend_percent) >= 0} tone="green" />
      <StatCard title="Claims Paid" value={cleanCurrency(analytics.claims_paid)} icon={ClaimsNavIcon} trend={formatTrend(analytics.claims_paid_trend_percent)} trendGood={Number(analytics.claims_paid_trend_percent) >= 0} tone="green" />
      <StatCard title="Active Users" value={String(analytics.active_users)} icon={IconUsers} trend={formatTrend(analytics.active_users_trend_percent)} trendGood={Number(analytics.active_users_trend_percent) >= 0} tone="green" />
      <StatCard title="Claim Ratio" value={analytics.claim_ratio} icon={IconTrend} trend={formatTrend(analytics.claim_ratio_trend_percent)} trendGood={Number(analytics.claim_ratio_trend_percent) >= 0} tone="green" />
    </div>

    <div className="grid-2x2">
      <div className="panel chart-panel">
        <h3>Monthly Trends</h3>
        <MonthlyChart monthlyTrends={analytics.monthly_trends} />
      </div>
      <div className="panel chart-panel">
        <h3>Claims by Status</h3>
        <StatusBreakdown claimsByStatus={analytics.claims_by_status} />
      </div>
      <div className="panel chart-panel">
        <h3>Policies by Type</h3>
        <PolicyTypeBreakdown policiesByType={analytics.policies_by_type} />
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
  const labels = Array.isArray(monthlyTrends?.labels) ? monthlyTrends.labels : [];
  const policies = Array.isArray(monthlyTrends?.policies) ? monthlyTrends.policies : [];
  const claims = Array.isArray(monthlyTrends?.claims) ? monthlyTrends.claims : [];

  if (!labels.length || (!policies.length && !claims.length)) {
    return <div className="empty-row">No monthly trend data available</div>;
  }

  const chartLeft = 58;
  const chartRight = 488;
  const chartTop = 28;
  const chartBottom = 188;
  const chartWidth = chartRight - chartLeft;
  const chartHeight = chartBottom - chartTop;
  const maxPoints = labels.length;

  const normalizedPolicies = labels.map((_, index) => Number(policies[index] || 0));
  const normalizedClaims = labels.map((_, index) => Number(claims[index] || 0));
  const maxValue = Math.max(1, ...normalizedPolicies, ...normalizedClaims);

  const getX = (index) => {
    if (maxPoints <= 1) {
      return chartLeft + chartWidth / 2;
    }
    return chartLeft + (index / (maxPoints - 1)) * chartWidth;
  };

  const getY = (value) => {
    const bounded = Math.max(0, Number(value || 0));
    return chartBottom - (bounded / maxValue) * chartHeight;
  };

  const pointsFor = (values) => values
    .map((value, index) => `${getX(index).toFixed(1)},${getY(value).toFixed(1)}`)
    .join(" ");

  const policyPoints = pointsFor(normalizedPolicies);
  const claimsPoints = pointsFor(normalizedClaims);

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
          return <circle key={`p-${p}`} cx={cx} cy={cy} r="2.6" className="dot-policies" />;
        })}
        {claimsPoints.split(" ").map((p) => {
          const [cx, cy] = p.split(",");
          return <circle key={`c-${p}`} cx={cx} cy={cy} r="2.6" className="dot-claims" />;
        })}

        <text x="44" y="192" className="tick">0</text>
        <text x="40" y="152" className="tick">{Math.round(maxValue * 0.25)}</text>
        <text x="35" y="112" className="tick">{Math.round(maxValue * 0.5)}</text>
        <text x="35" y="72" className="tick">{Math.round(maxValue * 0.75)}</text>
        <text x="35" y="32" className="tick">{maxValue}</text>

        {labels.map((label, index) => (
          <text key={`m-${label}-${index}`} x={getX(index) - 6} y="206" className="tick">{label}</text>
        ))}
      </svg>
      <div className="month-axis legend-axis">
        <span className="legend-item"><span className="legend-dot policies" />Policies</span>
        <span className="legend-item"><span className="legend-dot claims" />Claims</span>
      </div>
    </div>
  );
}

function ProviderBreakdown({ providers }) {
  const items = Array.isArray(providers) ? providers : [];
  const maxCount = items.reduce((max, item) => Math.max(max, Number(item?.count || 0)), 0);

  if (!items.length) {
    return <div className="empty-row">No active provider data available</div>;
  }

  return (
    <div style={{ paddingTop: "8px" }}>
      {items.slice(0, 6).map((item) => {
        const count = Number(item?.count || 0);
        const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
        return (
          <div key={item.provider} style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>
              <span style={{ fontWeight: 700 }}>{item.provider}</span>
              <span>{count}</span>
            </div>
            <div className="bar">
              <div style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusBreakdown({ claimsByStatus }) {
  const entries = Object.entries(claimsByStatus || {});
  const total = entries.reduce((sum, [, count]) => sum + Number(count || 0), 0);

  if (!entries.length) {
    return <div className="chart-placeholder" />;
  }

  return (
    <div style={{ paddingTop: "8px" }}>
      {entries.map(([key, rawCount]) => {
        const count = Number(rawCount || 0);
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={key} style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>
              <span style={{ textTransform: "capitalize", fontWeight: 700 }}>{key}</span>
              <span>{count}</span>
            </div>
            <div className="bar">
              <div style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PolicyTypeBreakdown({ policiesByType }) {
  const items = Array.isArray(policiesByType) ? policiesByType : [];
  const total = items.reduce((sum, item) => sum + Number(item?.count || 0), 0);

  if (!items.length) {
    return <div className="chart-placeholder" />;
  }

  return (
    <div style={{ paddingTop: "8px" }}>
      {items.map((item) => {
        const count = Number(item?.count || 0);
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={item.type} style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>
              <span style={{ fontWeight: 700 }}>{item.type}</span>
              <span>{count}</span>
            </div>
            <div className="bar">
              <div style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
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
          {iconTick ? <IconCheck size={8} className="icon-tick" /> : null}
        </div>
      </div>
      <h2>{value}</h2>
      {trend ? (
        <p className={trendGood ? "trend good" : "trend"}>
          <span className="trend-leading"><IconTrend size={10} /></span>
          <span className="trend-value">{trend}</span>
          <span className="trend-note">vs last month</span>
        </p>
      ) : null}
=======
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowLeftRight,
  Check,
  Clock3,
  File,
  LayoutDashboard,
  LogOut,
  Shield,
  Sparkles,
} from 'lucide-react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { adminService, catalogService } from './services/apiService';
import './App.css';

const userNavItems = [
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { key: 'compare', label: 'Compare', path: '/compare', icon: ArrowLeftRight },
  { key: 'active-plan', label: 'Active Plan', path: '/active-plan', icon: Shield },
];

function UserSidebar() {
  return (
    <aside className="ud-sidebar">
      <div className="ud-brand">
        <h2>InsureHub</h2>
        <p>Client Portal</p>
      </div>

      <nav className="ud-nav">
        {userNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) => `ud-nav-item${isActive ? ' active' : ''}`}
            >
              <span className="ud-nav-icon"><Icon size={15} /></span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="ud-sidebar-footer">
        <p>Logged in as</p>
        <strong>User</strong>
        <button type="button" className="ud-logout-btn">
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function MetricCard({ title, value, icon: Icon }) {
  const isClaimsStatus = title === 'Claims Status';

  return (
    <article className="ud-metric-card">
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
      {isClaimsStatus ? (
        <span className="ud-metric-icon claims-status-icon" aria-hidden="true">
          <File size={20} className="claims-status-file" />
          <Check size={12} className="claims-status-check" />
        </span>
      ) : (
        <span className="ud-metric-icon">
          <Icon size={20} />
        </span>
      )}
>>>>>>> origin/main-group-A
    </article>
  );
}

<<<<<<< HEAD
function HomeRoute() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#eef1f5", padding: "24px" }}>
      <div style={{ background: "#fff", border: "1px solid #d8dde3", borderRadius: "14px", padding: "24px", maxWidth: "680px", width: "100%" }}>
        <h1 style={{ margin: 0, fontSize: "28px", color: "#111827" }}>InsureHub</h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>Welcome. Choose where you want to go:</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
          <a href="/admin" style={{ textDecoration: "none", background: "#176620", color: "#fff", padding: "10px 14px", borderRadius: "10px", fontWeight: 700 }}>Open Admin</a>
        </div>
=======
function ActionCard({ title, subtitle }) {
  return (
    <article className="ud-action-card">
      <h4>{title}</h4>
      <p>{subtitle}</p>
    </article>
  );
}

function DashboardPage({ metrics, recentMessage, loading }) {
  return (
    <div className="ud-page">
      <h1 className="ud-title">Dashboard</h1>

      <div className="ud-metric-grid">
        <MetricCard title="Active Plans" value={loading ? '...' : String(metrics.activePlans)} icon={Shield} />
        <MetricCard title="Claims Status" value={loading ? '...' : String(metrics.claims)} icon={Check} />
        <MetricCard title="Recommended Policies" value={loading ? '...' : String(metrics.recommended)} icon={Sparkles} />
        <MetricCard title="Recent Activity" value={loading ? '...' : String(metrics.recent)} icon={Clock3} />
      </div>

      <section className="ud-panel ud-recent-panel">
        <h3>Recent Activity</h3>
        <p>{loading ? 'Loading activity...' : recentMessage}</p>
      </section>

      <div className="ud-actions-grid">
        <ActionCard title="Browse Policies" subtitle="Explore available insurance policies" />
        <ActionCard title="File a Claim" subtitle="Submit a new insurance claim" />
        <ActionCard title="Get Recommendations" subtitle="AI-powered policy suggestions" />
>>>>>>> origin/main-group-A
      </div>
    </div>
  );
}

<<<<<<< HEAD
function NotFoundRoute() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#eef1f5", padding: "24px" }}>
      <div style={{ background: "#fff", border: "1px solid #d8dde3", borderRadius: "14px", padding: "24px", maxWidth: "680px", width: "100%" }}>
        <h1 style={{ margin: 0, fontSize: "28px", color: "#111827" }}>Page Not Found</h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>Use valid routes:</p>
        <p style={{ color: "#111827", fontWeight: 700, margin: "8px 0 0" }}>/, /admin</p>
      </div>
=======
function ComparePage({ loading, policiesCount }) {
  return (
    <div className="ud-page">
      <button type="button" className="ud-back-btn">
        <ArrowLeft size={15} />
        Back to Policies
      </button>

      <section className="ud-panel ud-empty-panel">
        <p>
          {loading
            ? 'Loading policies...'
            : policiesCount > 0
              ? `${policiesCount} policies available for comparison`
              : 'No policies selected for comparison'}
        </p>
        <button type="button" className="ud-primary-btn">Browse Policies</button>
      </section>
    </div>
  );
}

function ActivePlanPage({ loading, activePlansCount }) {
  return (
    <div className="ud-page">
      <div className="ud-title-row">
        <div>
          <h1 className="ud-title">Active Plan</h1>
          <p className="ud-subtitle">Manage your insurance policies</p>
        </div>
        <article className="ud-mini-metric">
          <div>
            <p>Active Plans</p>
            <h3>{loading ? '...' : activePlansCount}</h3>
          </div>
          <span className="ud-metric-icon">
            <Shield size={20} />
          </span>
        </article>
      </div>

      <h3 className="ud-section-title">Current Active Plans</h3>
      <section className="ud-panel ud-empty-panel active-plan-empty">
        <Shield size={48} className="ud-empty-icon" />
        <p>
          {loading
            ? 'Loading active policies...'
            : activePlansCount > 0
              ? `${activePlansCount} active policies found`
              : 'No active policies yet'}
        </p>
        <button type="button" className="ud-primary-btn">Browse Policies</button>
      </section>
    </div>
  );
}

function UserDashboardShell() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    activePlans: 0,
    claims: 0,
    recommended: 0,
    recent: 0,
  });
  const [recentMessage, setRecentMessage] = useState('No recent activity');
  const [policiesCount, setPoliciesCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setLoading(true);

      const [overviewResult, policiesResult, recommendationsResult, activityResult] = await Promise.allSettled([
        adminService.getOverview(),
        catalogService.getPolicies({ is_active: true }),
        catalogService.getRecommendations({ top_only: true, is_active: true }),
        adminService.getRecentActivity(),
      ]);

      if (!isMounted) return;

      const overview = overviewResult.status === 'fulfilled' ? overviewResult.value : null;
      const policies = policiesResult.status === 'fulfilled' && Array.isArray(policiesResult.value)
        ? policiesResult.value
        : [];
      const recommendations = recommendationsResult.status === 'fulfilled'
        ? recommendationsResult.value
        : { total_count: 0 };
      const recentActivity = activityResult.status === 'fulfilled' ? activityResult.value : null;

      setPoliciesCount(policies.length);
      setMetrics({
        activePlans: policies.length,
        claims: overview?.claims ?? 0,
        recommended: (recommendations?.total_count ?? 0) > 0 ? (recommendations?.total_count ?? 0) : 3,
        recent: recentActivity?.total_count ?? 0,
      });

      const firstActivity = recentActivity?.activities?.[0];
      if (firstActivity?.description) {
        setRecentMessage(firstActivity.description);
      } else {
        setRecentMessage('No recent activity');
      }

      setLoading(false);
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="ud-shell">
      <UserSidebar />
      <main className="ud-content">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage metrics={metrics} recentMessage={recentMessage} loading={loading} />} />
          <Route path="/compare" element={<ComparePage loading={loading} policiesCount={policiesCount} />} />
          <Route path="/active-plan" element={<ActivePlanPage loading={loading} activePlansCount={metrics.activePlans} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
>>>>>>> origin/main-group-A
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
    overview: <OverviewSection overview={dashboardData.overview} recentActivity={dashboardData.recent_activity} />,
    users: <UsersSection users={dashboardData.users} />,
    policies: <PoliciesSection policies={dashboardData.policies} />,
    claims: <ClaimsSection claims={dashboardData.claims} highRiskClaims={dashboardData.overview.high_risk_claims} />,
    fraud: <FraudSection fraudRules={dashboardData.fraud_rules} />,
    active: <ActivePoliciesSection activePolicies={dashboardData.active_policies} />,
    analytics: <AnalyticsSection analytics={dashboardData.analytics} />,
  }), [dashboardData]);

  const activeContent = useMemo(() => sections[active], [active, sections]);

  if (routeMode === "home") {
    return <HomeRoute />;
  }

  if (routeMode === "not-found") {
    return <NotFoundRoute />;
  }

  return (
<<<<<<< HEAD
    <div className="app-shell">
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
          <button type="button" className="logout"><IconLogout size={13} /> Logout</button>
        </div>
      </aside>

      <main className="main-content">{activeContent}</main>
    </div>
=======
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<UserDashboardShell />} />
      </Routes>
    </Router>
>>>>>>> origin/main-group-A
  );
}

export default App;
