import { useNavigate } from "react-router-dom";

const severityColor = {
  fraud: "bg-red-500",
  approved: "bg-green-500",
  flagged: "bg-yellow-500",
  info: "bg-blue-500"
};

const RecentActivity = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full">

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 mb-8">
        Recent Activity
      </h2>

      {/* Activity List */}
      <div className="space-y-6 flex-1">

        {data.map((item, index) => (
          <div key={index} className="flex gap-4">

            {/* Colored Bullet */}
            <div
              className={`w-2.5 h-2.5 rounded-full mt-[6px] ${
                severityColor[item.severity] || "bg-gray-400"
              }`}
            />

            {/* Text Content */}
            <div>
              <p className="text-base font-medium text-gray-900">
                {item.title}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {item.actor} • {item.timestamp}
              </p>
            </div>

          </div>
        ))}

      </div>

      {/* Bottom Button */}
      <div className="mt-6 flex justify-center ">
        <button
          onClick={() => navigate("/admin/fraud-rules")}
          className="text-blue-600 text-sm font-medium hover:text-blue-800 "
        >
          Manage Fraud Rules →
        </button>
      </div>

    </div>
  );
};

export default RecentActivity;