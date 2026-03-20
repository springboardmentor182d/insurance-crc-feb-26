import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  rule_name: z.string().min(3, "Rule name is required"),
  description: z.string().optional(),
  severity: z.enum(["low", "medium", "high"]),
  trigger_threshold: z
    .union([z.number(), z.nan()])
    .optional()
    .transform((value) => (Number.isNaN(value) ? undefined : value)),
  is_active: z.boolean()
});

const FraudRuleModal = ({
  isOpen,
  title,
  initialValues,
  onClose,
  onSave
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      rule_name: "",
      description: "",
      severity: "medium",
      trigger_threshold: undefined,
      is_active: true
    }
  });

  // FIX: Previously only reset when initialValues existed, causing stale form data
  // when reopening the modal for a new rule. Now resets to defaults when isOpen
  // triggers without initialValues (i.e. creating a new rule).
  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        reset({
          rule_name: initialValues.rule_name,
          description: initialValues.description || "",
          severity: initialValues.severity,
          trigger_threshold: initialValues.trigger_threshold ?? undefined,
          is_active: initialValues.is_active
        });
      } else {
        reset({
          rule_name: "",
          description: "",
          severity: "medium",
          trigger_threshold: undefined,
          is_active: true
        });
      }
    }
  }, [isOpen, initialValues, reset]);

  if (!isOpen) return null;

  const submitForm = (values) => {
    onSave({
      rule_name: values.rule_name,
      description: values.description,
      severity: values.severity,
      trigger_threshold: values.trigger_threshold,
      is_active: values.is_active
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="admin-surface w-full max-w-2xl rounded-3xl border border-gray-200 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold admin-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-semibold admin-text-secondary">Rule Name</label>
            <input
              {...register("rule_name")}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="DUPLICATE_CLAIM"
            />
            {errors.rule_name && (
              <p className="mt-1 text-xs text-red-600">{errors.rule_name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold admin-text-secondary">Severity</label>
            <select
              {...register("severity")}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold admin-text-secondary">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Describe the rule..."
            />
          </div>

          <div>
            <label className="text-sm font-semibold admin-text-secondary">Trigger Threshold (optional)</label>
            <input
              type="number"
              step="0.01"
              {...register("trigger_threshold", { valueAsNumber: true })}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="e.g. 3.0"
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-semibold admin-text-secondary">
            <input type="checkbox" {...register("is_active")} className="h-4 w-4" />
            Active
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Save Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FraudRuleModal;