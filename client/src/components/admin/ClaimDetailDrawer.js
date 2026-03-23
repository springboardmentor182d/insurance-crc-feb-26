// FIX: Added missing React import
import React from "react";

const ClaimDetailDrawer = ({ isOpen, isLoading, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold admin-text-primary">Claim Details</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600"
          >
            Close
          </button>
        </div>

        {isLoading && (
          <div className="mt-6 space-y-4">
            <div className="h-6 w-3/4 rounded bg-gray-100" />
            <div className="h-6 w-1/2 rounded bg-gray-100" />
            <div className="h-40 rounded bg-gray-100" />
          </div>
        )}

        {!isLoading && data && (
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase text-gray-400">Claim</h3>
              <div className="mt-2 space-y-2 text-sm">
                <p>Claim Number: {String(data.claim.claim_number)}</p>
                <p>Status: {String(data.claim.status)}</p>
                <p>Amount: INR {String(data.claim.claim_amount)}</p>
                <p>Description: {String(data.claim.description || "-")}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase text-gray-400">User</h3>
              <div className="mt-2 space-y-2 text-sm">
                <p>Name: {String(data.user.full_name)}</p>
                <p>Email: {String(data.user.email)}</p>
                <p>Phone: {String(data.user.phone || "-")}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase text-gray-400">Policy</h3>
              <div className="mt-2 space-y-2 text-sm">
                <p>Policy Number: {String(data.policy.policy_number)}</p>
                <p>Type: {String(data.policy.policy_type)}</p>
                <p>Coverage: INR {String(data.policy.coverage_amount)}</p>
                <p>Start: {String(data.policy.start_date)}</p>
              </div>
            </div>

            {data.adjuster && (
              <div>
                <h3 className="text-sm font-semibold uppercase text-gray-400">Adjuster</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <p>Name: {String(data.adjuster.name)}</p>
                  <p>Email: {String(data.adjuster.email)}</p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold uppercase text-gray-400">Fraud Flags</h3>
              <div className="mt-3 space-y-3">
                {data.fraud_flags.length === 0 ? (
                  <p className="text-sm text-gray-500">No flags recorded.</p>
                ) : (
                  data.fraud_flags.map((flag) => (
                    <div key={flag.id} className="rounded-2xl border border-gray-200 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{flag.rule_name}</p>
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold">
                          {flag.severity}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-500">{flag.details || "-"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase text-gray-400">Activity</h3>
              <div className="mt-3 space-y-3">
                {data.activity_logs.length === 0 ? (
                  <p className="text-sm text-gray-500">No activity logged.</p>
                ) : (
                  data.activity_logs.map((log) => (
                    <div key={String(log.id)} className="rounded-2xl border border-gray-200 p-3 text-sm">
                      <p className="font-semibold">{String(log.title)}</p>
                      <p className="mt-1 text-gray-500">{String(log.details || "-")}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimDetailDrawer;