import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { updatePolicy } from "../services/policiesService";

const policyTypeOptions = [
  { label: "Auto Insurance", value: "Auto" },
  { label: "Home Insurance", value: "Home" },
  { label: "Life Insurance", value: "Life" },
  { label: "Health Insurance", value: "Health" }
];

const EditPolicyModal = ({ policy, isOpen, onClose, reload }) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (policy) {
      setForm({
        ...policy,
        status: policy.status || "active",
        description: policy.description || ""
      });
    }
  }, [policy]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updatePolicy(policy.id, form);
    await reload();
    onClose();
  };

  if (!isOpen || !policy) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-200/80 p-4 backdrop-blur-md">
      <div className="admin-surface bg-white max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[28px] p-6 shadow-2xl md:p-8">
        <h2 className="text-3xl font-semibold text-gray-900">Edit Policy</h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="block text-base font-medium text-gray-900 md:text-lg">Policy Name *</span>
              <input
                name="policyName"
                value={form.policyName || ""}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 text-base outline-none focus:border-blue-500 md:h-14"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="block text-base font-medium text-gray-900 md:text-lg">Provider *</span>
              <input
                name="provider"
                value={form.provider || ""}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 text-base outline-none focus:border-blue-500 md:h-14"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="block text-base font-medium text-gray-900 md:text-lg">Policy Type *</span>
              <select
                name="type"
                value={form.type || "Auto"}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 text-base outline-none focus:border-blue-500 md:h-14"
                required
              >
                {policyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="block text-base font-medium text-gray-900 md:text-lg">Annual Premium *</span>
              <input
                name="premium"
                type="number"
                min="0"
                value={form.premium || ""}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 text-base outline-none focus:border-blue-500 md:h-14"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="block text-base font-medium text-gray-900 md:text-lg">Coverage Amount *</span>
              <input
                name="coverage"
                type="number"
                min="0"
                value={form.coverage || ""}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 text-base outline-none focus:border-blue-500 md:h-14"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="block text-base font-medium text-gray-900 md:text-lg">Deductible *</span>
              <input
                name="deductible"
                type="number"
                min="0"
                value={form.deductible || ""}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 text-base outline-none focus:border-blue-500 md:h-14"
                required
              />
            </label>

            <label className="space-y-2 md:col-span-2 lg:col-span-1">
              <span className="block text-base font-medium text-gray-900 md:text-lg">Status *</span>
              <select
                name="status"
                value={form.status || "active"}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 text-base capitalize outline-none focus:border-blue-500 md:h-14"
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-base font-medium text-gray-900 md:text-lg">Description</span>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              placeholder="Policy description and key features..."
              rows={5}
              className="w-full resize-y rounded-2xl border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-500 md:text-lg"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-2xl border border-gray-300 bg-gray-100 text-base font-medium text-gray-800 md:h-14"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-12 rounded-2xl bg-blue-600 text-base font-medium text-white transition hover:bg-blue-700 md:h-14"
            >
              Update Policy
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditPolicyModal;
