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

const ClaimsChart = ({ data }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">

      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Claims Trends
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          
          {/* 🔹 Background Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />

          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey="approved" fill="#10b981" />
          <Bar dataKey="rejected" fill="#ef4444" />
          <Bar dataKey="fraudulent" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default ClaimsChart;