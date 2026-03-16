import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";

import { tableColumns } from "../config/tableColumns";
import { deletePolicy } from "../services/policiesService";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });

const PoliciesTable = ({ policies, openView, openEdit, reload }) => {
  const handleDelete = async (id) => {
    await deletePolicy(id);
    await reload();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px]">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200">
            {tableColumns.map((col) => (
              <th key={col.key} className="px-6 py-4 text-left text-sm font-semibold text-gray-800 md:text-base">
                {col.label}
              </th>
            ))}
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 md:text-base">Actions</th>
          </tr>
        </thead>

        <tbody>
          {policies.map((policy) => (
            <tr key={policy.id} className="border-b border-gray-100">
              {tableColumns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-base text-gray-800">
                  {col.key === "type" ? (
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                      {policy.type}
                    </span>
                  ) : null}

                  {col.key === "premium" ? (
                    <span className="font-semibold text-gray-900">{formatCurrency(policy.premium)}/year</span>
                  ) : null}

                  {col.key === "coverage" ? formatCurrency(policy.coverage) : null}

                  {col.key === "deductible" ? formatCurrency(policy.deductible) : null}

                  {col.key === "status" ? (
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm capitalize ${
                        policy.status === "inactive"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {policy.status}
                    </span>
                  ) : null}

                  {![
                    "type",
                    "premium",
                    "coverage",
                    "deductible",
                    "status"
                  ].includes(col.key)
                    ? policy[col.key]
                    : null}
                </td>
              ))}

              <td className="px-6 py-4">
                <div className="flex items-center gap-4 text-base md:text-lg">
                  <button
                    aria-label="View policy"
                    className="text-blue-600 transition hover:text-blue-700"
                    onClick={() => openView(policy)}
                  >
                    <FiEye />
                  </button>

                  <button
                    aria-label="Edit policy"
                    className="text-gray-700 transition hover:text-gray-900"
                    onClick={() => openEdit(policy)}
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    aria-label="Delete policy"
                    className="text-red-500 transition hover:text-red-600"
                    onClick={() => handleDelete(policy.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {policies.length === 0 ? (
            <tr>
              <td colSpan={tableColumns.length + 1} className="px-6 py-10 text-center text-base text-gray-500">
                No policies found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default PoliciesTable;
