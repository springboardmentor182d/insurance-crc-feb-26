import AdminLayout from "../layout/admin/AdminLayout";
import { useAdminDashboard } from "../features/admin/dashboard/hooks/useAdminDashboard";
import StatCard from "../features/admin/dashboard/components/StatCard";
import ClaimsChart from "../features/admin/dashboard/components/ClaimsChart";
import RevenueChart from "../features/admin/dashboard/components/RevenueChart";
import PolicyDistribution from "../features/admin/dashboard/components/PolicyDistribution";
import TopAdjusters from "../features/admin/dashboard/components/TopAdjusters";
import RecentActivity from "../features/admin/dashboard/components/RecentActivity";
import ActionCard from "../features/admin/dashboard/components/ActionCard";
import "../features/admin/dashboardColors.css";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiFileText, FiShield, FiAlertTriangle, FiTrendingUp } from "react-icons/fi";
import { HiOutlineChartBar } from "react-icons/hi";


const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    stats,
    claims,
    revenue,
    distribution,
    adjusters,
    activity,
    error
  } = useAdminDashboard();

  if (error) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </AdminLayout>
    );
  }

  if (!stats) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-dashboard-theme space-y-10">

        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Monitor and manage platform operations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers}
            growth={stats?.usersGrowth}
            icon={<FiUsers />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatCard
            title="Active Policies"
            value={stats?.activePolicies}
            growth={stats?.policiesGrowth}
            icon={<FiFileText />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />

          <StatCard
            title="Total Claims"
            value={stats?.totalClaims}
            growth={stats?.claimsGrowth}
            icon={<FiShield />}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />

          <StatCard
            title="Fraud Detected"
            value={stats?.fraudDetected}
            growth={stats?.fraudGrowth}
            icon={<FiAlertTriangle />}
            iconBg="bg-red-100"
            iconColor="text-red-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ClaimsChart data={claims} />
          <RevenueChart data={revenue} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <PolicyDistribution data={distribution} />
          <TopAdjusters data={adjusters} />
          <RecentActivity data={activity} />
        </div>

        <div className="mt-5 mb-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard
              title="Fraud Detection"
              description="Manage fraud rules and review flagged claims"
              color="admin-action-fraud"
              icon={<FiShield />}
              onClick={() => navigate("/admin/fraud-rules")}
            />

            <ActionCard
              title="Advanced Analytics"
              description="Deep dive into performance metrics"
              color="admin-action-analytics"
              icon={<HiOutlineChartBar />}
              onClick={() => navigate("/admin/analytics")}
            />

            <ActionCard
              title="Revenue Growth"
              description="+18% increase from last month"
              color="admin-action-revenue"
              icon={<FiTrendingUp />}
              onClick={() => navigate("/admin/revenue")}
            />

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
