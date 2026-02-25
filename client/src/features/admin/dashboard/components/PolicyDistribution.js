import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

/* 🔹 Custom Tooltip */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { policyType, percentage, count } = payload[0].payload;

    return (
      <div className="bg-white border border-gray-200 shadow-md rounded-xl px-4 py-3">
        <p className="text-sm font-semibold text-gray-800">
          {policyType}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {percentage}% ({count} policies)
        </p>
      </div>
    );
  }

  return null;
};

/* 🔹 Label Renderer */
const renderLabel = ({
  name,
  percent,
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  index
}) => {
  const RADIAN = Math.PI / 180;

  // Move label closer to pie (keeps it inside container)
  const radius = innerRadius + (outerRadius - innerRadius) * 1.1;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={COLORS[index]}   
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontSize: "12px", fontWeight: 500 }}
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PolicyDistribution = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Policy Distribution
      </h2>

      <div className="flex flex-col items-center">

        {/* Pie Chart */}
        <ResponsiveContainer width={280} height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="percentage"
              nameKey="policyType"
              outerRadius={70}
              label={renderLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-6 w-full space-y-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-gray-700">
                  {item.policyType}
                </span>
              </div>
              <span className="font-medium text-gray-900">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PolicyDistribution;