import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const CHART_COLORS = {
  grid: "var(--admin-chart-grid)",
  approved: "var(--admin-chart-approved)",
  rejected: "var(--admin-chart-rejected)",
  fraudulent: "var(--admin-chart-fraudulent)"
};

const ClaimsChart = ({ data }) => {
  return (
    <div className="admin-surface p-8 rounded-3xl shadow-sm border admin-border-soft">

      <h2 className="text-xl font-semibold admin-text-heading mb-6">
        Claims Trends
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />

          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey="approved" fill={CHART_COLORS.approved} />
          <Bar dataKey="rejected" fill={CHART_COLORS.rejected} />
          <Bar dataKey="fraudulent" fill={CHART_COLORS.fraudulent} />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default ClaimsChart;
