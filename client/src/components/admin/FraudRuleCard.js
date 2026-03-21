import { FiShield } from "react-icons/fi";

const severityStyles = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700"
};

const shieldStyles = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-green-600"
};

const FraudRuleCard = ({
  rule,
  category,
  conditions = [],
  onEdit,
  onDelete,
  onToggle
}) => {
  return (
    <div className="admin-surface flex h-full flex-col gap-5 rounded-3xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={`rounded-2xl bg-gray-50 p-3 ${shieldStyles[rule.severity] || ""}`}>
            <FiShield className="text-2xl" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold admin-text-primary">
                {rule.rule_name.replace(/_/g, " ")}
              </h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                  severityStyles[rule.severity] || "bg-gray-100 text-gray-600"
                }`}
              >
                {rule.severity}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  rule.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                {rule.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-2 text-sm admin-text-secondary">
              {rule.description || "No description available."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          Triggered {rule.trigger_count} times
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          {category}
        </span>
        {rule.trigger_threshold !== null && rule.trigger_threshold !== undefined && (
          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
            Threshold: {rule.trigger_threshold}
          </span>
        )}
      </div>

      {conditions.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs">
          {conditions.map((condition) => (
            <span
              key={condition}
              className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-600"
            >
              {condition}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-3">
        <button
          onClick={() => onToggle(rule)}
          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
            rule.is_active
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {/* FIX: Changed "Enabled"/"Disabled" to "Disable"/"Enable" — action labels, not state labels */}
          {rule.is_active ? "Disable" : "Enable"}
        </button>
        <button
          onClick={() => onEdit(rule)}
          className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(rule)}
          className="rounded-2xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FraudRuleCard;