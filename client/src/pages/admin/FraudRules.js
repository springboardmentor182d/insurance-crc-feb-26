import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";

import AdminLayout from "../../layout/admin/AdminLayout";
import "../../features/admin/dashboardColors.css";
import FraudRuleCard from "../../components/admin/FraudRuleCard";
import FraudRuleModal from "../../components/admin/FraudRuleModal";
import { useFraudRules } from "../../hooks/useFraudRules";
import { motion } from "framer-motion";

const tabs = [
  "All Rules",
  "Claim Patterns",
  "Amount Based",
  "Frequency",
  "Document",
  "Behavioral",
  "Timing"
];

const categoryMap = {
  DUPLICATE_CLAIM: "Claim Patterns",
  EXCESSIVE_AMOUNT: "Amount Based",
  MULTIPLE_CLAIMS_SHORT_PERIOD: "Frequency",
  DUPLICATE_DOCUMENTS: "Document",
  LOW_FRAUD_SCORE_OVERRIDE: "Behavioral",
  SUSPICIOUS_TIMING: "Timing",
  RAPID_POLICY_CLAIM: "Claim Patterns"
};

const conditionsMap = {
  DUPLICATE_CLAIM: ["Same policy", "Similar description", "Within 90 days"],
  EXCESSIVE_AMOUNT: ["Above average", "Policy type match"],
  RAPID_POLICY_CLAIM: ["Within 30 days", "Policy start date"],
  MULTIPLE_CLAIMS_SHORT_PERIOD: ["Same user", "60-day window"],
  SUSPICIOUS_TIMING: ["Weekend", "High amount"],
  DUPLICATE_DOCUMENTS: ["Same file", "Same doc type"],
  LOW_FRAUD_SCORE_OVERRIDE: ["Pre-scored risk", "Above threshold"]
};

const FraudRules = () => {
  const { data, isLoading, isError, createRule, updateRule, deleteRule, toggleRule } = useFraudRules();
  const [activeTab, setActiveTab] = useState("All Rules");
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const rules = useMemo(() => {
    if (!data?.rules) return [];

    return [...data.rules].sort((a, b) => {
      if (a.is_active === b.is_active) return a.id - b.id;
      return a.is_active ? -1 : 1;
    });
  }, [data?.rules]);
  const filteredRules = useMemo(() => {
    if (activeTab === "All Rules") return rules;
    return rules.filter((rule) => categoryMap[rule.rule_name] === activeTab);
  }, [activeTab, rules]);

  const handleSave = (values) => {
    if (editingRule) {
      updateRule.mutate(
        { id: editingRule.id, payload: values },
        {
          // FIX: Modal was closed and editingRule cleared immediately — before
          // the mutation resolved. If the mutation failed, the user lost their
          // editing context. Moved close/clear into onSuccess so it only happens
          // after a confirmed save. onError can surface a toast if needed.
          onSuccess: () => {
            setShowModal(false);
            setEditingRule(null);
          }
        }
      );
    } else {
      createRule.mutate(values, {
        onSuccess: () => {
          setShowModal(false);
          setEditingRule(null);
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-theme space-y-6 lg:space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold admin-text-primary">Fraud Detection Rules</h1>
            <p className="mt-2 text-base admin-text-secondary md:text-lg">
              Manage rule triggers and thresholds for claim fraud detection.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingRule(null);
              setShowModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-base text-white transition hover:bg-blue-700"
          >
            <FiPlus className="text-lg" />
            Add New Rule
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Active Rules", value: data?.active_count ?? 0, color: "text-green-600" },
            { label: "Total Triggers", value: data?.total_triggers ?? 0, color: "text-orange-500" },
            { label: "High Severity", value: data?.high_severity_count ?? 0, color: "text-red-600" },
            { label: "Total Rules", value: data?.total_rules ?? 0, color: "text-blue-600" }
          ].map((stat) => (
            <div
              key={stat.label}
              className="admin-surface rounded-3xl border border-gray-200 p-6 shadow-sm"
            >
              <p className="text-sm uppercase tracking-wide admin-text-secondary">{stat.label}</p>
              <h2 className={`mt-3 text-3xl font-semibold ${stat.color}`}>{stat.value}</h2>
            </div>
          ))}
        </div>

        <div className="admin-surface rounded-3xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="admin-surface rounded-3xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="h-4 w-1/2 rounded bg-gray-100" />
                <div className="mt-4 h-16 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load fraud rules. Please try again.
          </div>
        )}

        {!isLoading && !isError && filteredRules.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <p className="text-base admin-text-secondary">No rules found for this category.</p>
          </div>
        )}

        {!isLoading && !isError && filteredRules.length > 0 && (
          <motion.div
            layout
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredRules.map((rule) => (
              <motion.div
                key={rule.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <FraudRuleCard
                  rule={rule}
                  category={categoryMap[rule.rule_name] || "Other"}
                  conditions={conditionsMap[rule.rule_name] || []}
                  onEdit={(selected) => {
                    setEditingRule(selected);
                    setShowModal(true);
                  }}
                  onDelete={(selected) => deleteRule.mutate(selected.id)}
                  onToggle={(selected) =>
                    toggleRule.mutate({ id: selected.id })
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <FraudRuleModal
          isOpen={showModal}
          title={editingRule ? "Edit Rule" : "Add New Rule"}
          // FIX: editingRule || undefined is redundant — null is already falsy and
          // FraudRuleModal handles null/undefined identically in its useEffect.
          // Passing editingRule directly is cleaner and more explicit.
          initialValues={editingRule}
          onClose={() => {
            setShowModal(false);
            setEditingRule(null);
          }}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  );
};

export default FraudRules;
