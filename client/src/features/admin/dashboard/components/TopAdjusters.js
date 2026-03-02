import { useNavigate } from "react-router-dom";

const TopAdjusters = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="admin-surface rounded-3xl p-8 shadow-sm border admin-border-soft flex flex-col h-full">

      <h2 className="text-xl font-semibold admin-text-heading mb-6">
        Top Adjusters
      </h2>

      <div className="flex-1 space-y-6">
        {data.map((item, index) => (
          <div key={index}>

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium admin-text-primary">
                {item.name}
              </h3>
              <span className="text-sm admin-text-muted">
                {item.totalClaims} claims
              </span>
            </div>

            <div className="text-sm admin-text-subtle mt-2">
              {item.approvalRate}% approval
              <span className="mx-2">-</span>
              {item.avgProcessingDays} days avg
            </div>

            {index !== data.length - 1 && (
              <div className="border-t admin-border-soft mt-6"></div>
            )}

          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => navigate("/admin/analytics")}
          className="admin-link text-sm font-medium"
        >
          View All Analytics <span className="ml-1 text-xl leading-none">&rarr;</span>
        </button>
      </div>

    </div>
  );
};

export default TopAdjusters;
