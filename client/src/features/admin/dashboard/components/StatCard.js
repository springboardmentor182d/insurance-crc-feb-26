const StatCard = ({
  title,
  value,
  growth,
  icon,
  iconBg,
  iconColor
}) => {
  const isPositive = growth >= 0;

  return (
    <div className="admin-surface rounded-3xl p-7 shadow-sm border admin-border-soft hover:shadow-md transition">

      <div className="flex items-start justify-between">

        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${iconBg}`}>
          <div className={`text-2xl ${iconColor}`}>
            {icon}
          </div>
        </div>

        <div
          className={`flex items-center text-sm font-medium ${
            isPositive ? "admin-growth-positive" : "admin-growth-negative"
          }`}
        >
          {isPositive ? "\u2191" : "\u2193"}
          <span className="ml-1">
            {Math.abs(growth)}%
          </span>
        </div>

      </div>

      <div className="mt-6">
        <h2 className="text-4xl font-bold admin-text-primary tracking-tight">
          {value?.toLocaleString()}
        </h2>
      </div>

      <p className="mt-2 admin-text-subtle text-base">
        {title}
      </p>

    </div>
  );
};

export default StatCard;
