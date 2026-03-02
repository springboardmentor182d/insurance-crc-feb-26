import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const POLICY_COLORS = [
  "var(--admin-policy-color-1)",
  "var(--admin-policy-color-2)",
  "var(--admin-policy-color-3)",
  "var(--admin-policy-color-4)"
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { policyType, percentage, count } = payload[0].payload;

    return (
      <div className="admin-surface border admin-border-tooltip shadow-md rounded-xl px-4 py-3">
        <p className="text-sm font-semibold admin-text-heading">
          {policyType}
        </p>
        <p className="text-sm admin-text-subtle mt-1">
          {percentage}% ({count} policies)
        </p>
      </div>
    );
  }

  return null;
};

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
  const radius = innerRadius + (outerRadius - innerRadius) * 1.1;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={POLICY_COLORS[index]}
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
    <div className="admin-surface rounded-3xl p-8 shadow-sm border admin-border-soft">
      <h2 className="text-xl font-semibold admin-text-heading mb-6">
        Policy Distribution
      </h2>

      <div className="flex flex-col items-center">
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
                <Cell key={index} fill={POLICY_COLORS[index]} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-6 w-full space-y-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: POLICY_COLORS[index] }}
                />
                <span className="admin-text-secondary">
                  {item.policyType}
                </span>
              </div>
              <span className="font-medium admin-text-primary">
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
