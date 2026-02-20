import {
  FiAlertTriangle,
  FiCheckCircle,
  FiEye,
  FiXCircle
} from "react-icons/fi";

const riskBadgeColor = (risk) => {
  if (risk > 80) return "bg-red-600 text-white";
  if (risk >= 50) return "bg-orange-500 text-white";
  return "bg-yellow-400 text-white";
};

const statusBadgeColor = (status) => {
  switch (status) {
    case "fraudulent":
      return "bg-red-100 text-red-700";
    case "approved":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const warningColor = (claim) => {
  if (claim.status === "fraudulent") return "text-red-600";
  // FIX: Was checking claim.fraud_score > 0.5 (0–1 scale) but the card uses
  // claim.fraud_risk_percentage (0–100 scale). Changed to > 50 for consistency.
  if (claim.fraud_risk_percentage > 50) return "text-orange-500";
  return "text-yellow-500";
};

const FlaggedClaimCard = ({
  claim,
  onConfirm,
  onClear,
  onView
}) => {
  return (
    <div className="admin-surface rounded-3xl border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className={`rounded-2xl bg-gray-50 p-3 ${warningColor(claim)}`}>
            <FiAlertTriangle className="text-2xl" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold admin-text-primary">
                {claim.claim_number}
              </h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeColor(
                  claim.status
                )}`}
              >
                {claim.status}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${riskBadgeColor(
                  claim.fraud_risk_percentage
                )}`}
              >
                {claim.fraud_risk_percentage}% risk
              </span>
            </div>
            <p className="mt-2 text-sm admin-text-secondary">
              {claim.user_name} | {claim.policy_type}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {claim.fraud_indicators.length > 0 ? (
                claim.fraud_indicators.map((indicator) => (
                  <span
                    key={indicator}
                    className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700"
                  >
                    {indicator}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  No indicators
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 text-left lg:items-end">
          <div>
            <p className="text-xs uppercase text-gray-400">Amount</p>
            <p className="text-xl font-semibold admin-text-primary">INR {claim.claim_amount}</p>
          </div>
          <p className="text-sm text-gray-500">
            {new Date(claim.submitted_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {claim.status === "fraudulent" && (
        <p className="mt-4 text-sm font-semibold text-red-600">
          This claim has been confirmed as fraudulent
        </p>
      )}
      {claim.status === "approved" && (
        <p className="mt-4 text-sm font-semibold text-green-600">Claim cleared</p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {claim.status === "pending" && (
          <>
            <button
              onClick={() => onConfirm(claim)}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <FiXCircle />
              Confirm Fraud
            </button>
            <button
              onClick={() => onClear(claim)}
              className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              <FiCheckCircle />
              Clear Claim
            </button>
          </>
        )}
        <button
          onClick={() => onView(claim)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
        >
          <FiEye />
          View Details
        </button>
      </div>
    </div>
  );
};

export default FlaggedClaimCard;