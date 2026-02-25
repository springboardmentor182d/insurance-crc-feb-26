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
    <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition">

      {/* Top Row */}
      <div className="flex items-start justify-between">

        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${iconBg}`}>
          <div className={`text-2xl ${iconColor}`}>
            {icon}
          </div>
        </div>

        <div
          className={`flex items-center text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-500"
          }`}
        >
          {isPositive ? "↑" : "↓"}
          <span className="ml-1">
            {Math.abs(growth)}%
          </span>
        </div>

      </div>

      {/* Value */}
      <div className="mt-6">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
          {value?.toLocaleString()}
        </h2>
      </div>

      {/* Label */}
      <p className="mt-2 text-gray-500 text-base">
        {title}
      </p>

    </div>
  );
};

export default StatCard;