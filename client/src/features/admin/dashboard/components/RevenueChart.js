import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const CHART_COLORS = {
  grid: "var(--admin-chart-grid)",
  revenue: "var(--admin-chart-revenue)",
  expenses: "var(--admin-chart-expenses)"
};

const RevenueChart = ({ data }) => {
  return (
    <div className="admin-surface p-8 rounded-3xl shadow-sm border admin-border-soft">

      <h2 className="text-xl font-semibold admin-text-heading mb-6">
        Revenue & Expenses
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />

          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke={CHART_COLORS.revenue}
            strokeWidth={3}
            dot={{ r: 4 }}
          />

          <Line
            type="monotone"
            dataKey="expenses"
            stroke={CHART_COLORS.expenses}
            strokeWidth={3}
            dot={{ r: 4 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default RevenueChart;
