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
    </article>
  );
}

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
      </div>
    </div>
  );
}

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
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<UserDashboardShell />} />
      </Routes>
    </Router>
  );
}

export default App;
