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

const RevenueChart = ({ data }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">

      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Revenue & Expenses
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>

          {/* 🔹 Background Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />

          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default RevenueChart;