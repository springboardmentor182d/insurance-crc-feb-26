import { useEffect } from "react";
import { createPortal } from "react-dom";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });

const ViewPolicyModal = ({ policy, isOpen, onClose, onEdit }) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !policy) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-200/80 p-4 backdrop-blur-md">
      <div className="admin-surface bg-white max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[28px] p-6 shadow-2xl md:p-8">
        <h2 className="text-3xl font-semibold text-gray-900">Policy Details</h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-base text-gray-600">Policy Name</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">{policy.policyName}</p>
          </div>

          <div>
            <p className="text-base text-gray-600">Provider</p>
            <p className="mt-2 text-xl text-gray-900">{policy.provider}</p>
          </div>

          <div>
            <p className="text-base text-gray-600">Policy Type</p>
            <span className="mt-2 inline-flex rounded-full bg-gray-100 px-4 py-1 text-base text-gray-700">{policy.type}</span>
          </div>

          <div>
            <p className="text-base text-gray-600">Annual Premium</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">{formatCurrency(policy.premium)}/year</p>
          </div>

          <div>
            <p className="text-base text-gray-600">Coverage Amount</p>
            <p className="mt-2 text-xl text-gray-900">{formatCurrency(policy.coverage)}</p>
          </div>

          <div>
            <p className="text-base text-gray-600">Deductible</p>
            <p className="mt-2 text-xl text-gray-900">{formatCurrency(policy.deductible)}</p>
          </div>

          <div>
            <p className="text-base text-gray-600">Status</p>
            <span
              className={`mt-2 inline-flex rounded-full px-4 py-1 text-base capitalize ${
                policy.status === "inactive"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {policy.status}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-base text-gray-600">Description</p>
          <p className="mt-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800">
            {policy.description || "No description added."}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-200 pt-6 md:grid-cols-2">
          <button
            onClick={onClose}
            className="h-14 rounded-2xl border border-gray-300 bg-gray-100 text-base font-medium text-gray-800"
          >
            Close
          </button>

          <button
            onClick={onEdit}
            className="h-14 rounded-2xl bg-blue-600 text-base font-medium text-white transition hover:bg-blue-700"
          >
            Edit Policy
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ViewPolicyModal;
