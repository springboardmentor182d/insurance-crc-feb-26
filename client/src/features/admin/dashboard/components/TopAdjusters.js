import { useNavigate } from "react-router-dom";




const TopAdjusters = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full">

      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Top Adjusters
      </h2>

      <div className="flex-1 space-y-6">
        {data.map((item, index) => (
          <div key={index}>

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {item.name}
              </h3>
              <span className="text-sm text-gray-600">
                {item.totalClaims} claims
              </span>
            </div>

            <div className="text-sm text-gray-500 mt-2">
              {item.approvalRate}% approval
              <span className="mx-2">•</span>
              {item.avgProcessingDays} days avg
            </div>

            {index !== data.length - 1 && (
              <div className="border-t border-gray-100 mt-6"></div>
            )}

          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => navigate("/admin/analytics")}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All Analytics →
        </button>
      </div>

    </div>
  );
};

export default TopAdjusters;