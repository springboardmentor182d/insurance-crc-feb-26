import AdminLayout from "../layout/admin/AdminLayout";
import { useAdminDashboard } from "../features/admin/dashboard/hooks/useAdminDashboard";
import StatCard from "../features/admin/dashboard/components/StatCard";
import ClaimsChart from "../features/admin/dashboard/components/ClaimsChart";
import RevenueChart from "../features/admin/dashboard/components/RevenueChart";
import PolicyDistribution from "../features/admin/dashboard/components/PolicyDistribution";
import TopAdjusters from "../features/admin/dashboard/components/TopAdjusters";
import RecentActivity from "../features/admin/dashboard/components/RecentActivity";
import ActionCard from "../features/admin/dashboard/components/ActionCard";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    stats,
    claims,
    revenue,
    distribution,
    adjusters,
    activity
  } = useAdminDashboard();
  if (!stats) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Monitor and manage platform operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <StatCard title="Total Users" value={stats.totalUsers} />
          <StatCard title="Active Policies" value={stats.activePolicies} />
          <StatCard title="Total Claims" value={stats.totalClaims} />
          <StatCard title="Fraud Detected" value={stats.fraudDetected} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ClaimsChart data={claims} />
          <RevenueChart data={revenue} />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <PolicyDistribution data={distribution} />
          <TopAdjusters data={adjusters} />
          <RecentActivity data={activity} />
        </div>
      </div>

      {/* Action Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          title="Fraud Detection"
          description="Manage fraud rules and review flagged claims"
          color="bg-gradient-to-r from-red-500 to-red-600"
          onClick={() => navigate("/admin/fraud-rules")}
        />

        <ActionCard
          title="Advanced Analytics"
          description="Deep dive into performance metrics"
          color="bg-gradient-to-r from-blue-500 to-indigo-600"
          onClick={() => navigate("/admin/analytics")}
        />

        <ActionCard
          title="Revenue Growth"
          description="+18% increase from last month"
          color="bg-gradient-to-r from-green-500 to-green-600"
          onClick={() => navigate("/admin/analytics")}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
