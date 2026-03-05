import { useNavigate } from "react-router-dom";

const severityColor = {
  fraud: "admin-severity-fraud",
  approved: "admin-severity-approved",
  flagged: "admin-severity-flagged",
  info: "admin-severity-info"
};

const RecentActivity = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="admin-surface rounded-3xl p-8 shadow-sm border admin-border-soft flex flex-col h-full">

      <h2 className="text-xl font-semibold admin-text-primary mb-8">
        Recent Activity
      </h2>

      <div className="space-y-6 flex-1">

        {data.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div
              className={`w-2.5 h-2.5 rounded-full mt-[6px] ${
                severityColor[item.severity] || "admin-severity-default"
              }`}
            />

            <div>
              <p className="text-base font-medium admin-text-primary">
                {item.title}
              </p>

              <p className="text-sm admin-text-subtle mt-1">
                {item.actor} - {item.timestamp}
              </p>
            </div>

          </div>
        ))}

      </div>

      <div className="mt-6 flex justify-center ">
        <button
          onClick={() => navigate("/admin/fraud-rules")}
          className="admin-link text-sm font-medium"
        >
          Manage Fraud Rules <span className="ml-1 text-xl leading-none">&rarr;</span>
        </button>
      </div>

    </div>
  );
};

export default RecentActivity;
