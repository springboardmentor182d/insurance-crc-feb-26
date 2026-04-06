import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiSearch } from "react-icons/fi";

import AdminLayout from "../../layout/admin/AdminLayout";
import "../../features/admin/dashboardColors.css";
import ClaimDetailDrawer from "../../components/admin/ClaimDetailDrawer";
import { useFlaggedClaims } from "../../hooks/useFlaggedClaims";
import { fetchClaimDetails } from "../../api/flaggedClaims";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import apiClient from "../../utils/apiClient";

const statusOptions = ["all", "pending", "fraudulent", "approved", "rejected"];

const FlaggedClaims = () => {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedClaim, setSelectedClaim] = useState(null);

  const [sortField, setSortField] = useState("submitted_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const { listQuery, statsQuery, confirmMutation, clearMutation, optimisticRemove } =
    useFlaggedClaims({
      status,
      search,
      page,
      pageSize: 8
    });

  const claims = useMemo(() => listQuery.data?.items ?? [], [listQuery.data?.items]);
  const stats = statsQuery.data;

  // ✅ Sorting
  const sortedClaims = useMemo(() => {
    return [...claims].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (sortOrder === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
  }, [claims, sortField, sortOrder]);

  // ✅ Export current page
  const handleExportExcel = () => {
    const data = sortedClaims.map((c) => ({
      "Claim Number": c.claim_number,
      User: c.user_name,
      Amount: c.claim_amount,
      "Risk %": c.fraud_risk_percentage,
      Status: c.status,
      "Submitted At": c.submitted_at
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Flagged Claims");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    saveAs(new Blob([buffer]), "flagged_claims_page.xlsx");
  };

  // ✅ Export ALL data from backend
  const handleExportAll = async () => {
    try {
      const res = await apiClient.get("/admin/flagged-claims/export");

      const worksheet = XLSX.utils.json_to_sheet(res.data);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "All Claims");

      const buffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });

      saveAs(new Blob([buffer]), "all_flagged_claims.xlsx");
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  const detailQuery = useQuery({
    queryKey: ["claim-details", selectedClaim?.claim_id],
    queryFn: () => fetchClaimDetails(selectedClaim?.claim_id),
    enabled: Boolean(selectedClaim)
  });

  const listTotal = listQuery.data?.total || 0;

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(listTotal / 8));
  }, [listTotal]);

  return (
    <AdminLayout>
      <div className="admin-dashboard-theme space-y-6 lg:space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold admin-text-primary">Flagged Claims</h1>
          <p className="mt-2 text-base admin-text-secondary md:text-lg">
            Review high-risk claims and confirm fraud decisions.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Flagged", value: stats?.total_flagged ?? 0, color: "text-orange-500" },
            { label: "Pending Review", value: stats?.pending_review ?? 0, color: "text-yellow-500" },
            { label: "Fraud Confirmed", value: stats?.fraud_confirmed ?? 0, color: "text-red-600" },
            { label: "Cleared", value: stats?.cleared ?? 0, color: "text-green-600" }
          ].map((stat) => (
            <div key={stat.label} className="admin-surface rounded-3xl border border-gray-200 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-wide admin-text-secondary">{stat.label}</p>
              <h2 className={`mt-3 text-3xl font-semibold ${stat.color}`}>{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* FILTERS + EXPORT */}
        <div className="admin-surface rounded-3xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">

            {/* SEARCH */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                placeholder="Search by claim number or user name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-12 w-full rounded-2xl border border-gray-200 pl-12 pr-4"
              />
            </div>

            {/* EXPORT BUTTONS */}
            <button
              onClick={handleExportExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-xl"
            >
              Export Page
            </button>

            <button
              onClick={handleExportAll}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
              Export All
            </button>

            {/* STATUS FILTER */}
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="h-12 rounded-2xl border border-gray-200 px-4"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All Status" : option.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE */}
        {!listQuery.isLoading && claims.length > 0 && (
          <div className="admin-surface rounded-3xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Claim #</th>
                  <th className="p-3 text-left">User</th>

                  <th
                    className="p-3 text-left cursor-pointer"
                    onClick={() => {
                      setSortField("claim_amount");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Amount ⬍
                  </th>

                  <th className="p-3 text-left">Risk</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedClaims.map((claim) => (
                  <tr
                    key={claim.claim_id}
                    className={`border-t hover:bg-gray-50 ${claim.fraud_risk_percentage > 80 ? "bg-red-50" : ""
                      }`}
                  >
                    <td className="p-3 font-semibold">{claim.claim_number}</td>
                    <td className="p-3">{claim.user_name}</td>
                    <td className="p-3">₹{claim.claim_amount}</td>

                    <td className="p-3 text-red-600 font-semibold">
                      {claim.fraud_risk_percentage}%
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${claim.status === "fraudulent"
                            ? "bg-red-100 text-red-600"
                            : claim.status === "approved"
                              ? "bg-green-100 text-green-600"
                              : claim.status === "pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {claim.status}
                      </span>
                    </td>

                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() =>
                          confirmMutation.mutate(claim.claim_id, {
                            onSuccess: () => optimisticRemove(claim.claim_id)
                          })
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs"
                      >
                        Fraud
                      </button>

                      <button
                        onClick={() =>
                          clearMutation.mutate(claim.claim_id, {
                            onSuccess: () => optimisticRemove(claim.claim_id)
                          })
                        }
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs"
                      >
                        Clear
                      </button>

                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {!listQuery.isLoading && totalPages > 1 && (
          <div className="flex justify-between">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="bg-gray-100 px-4 py-2 rounded-xl"
            >
              Previous
            </button>

            <p>Page {page} of {totalPages}</p>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="bg-gray-100 px-4 py-2 rounded-xl"
            >
              Next
            </button>
          </div>
        )}

        {/* DRAWER */}
        <ClaimDetailDrawer
          isOpen={Boolean(selectedClaim)}
          isLoading={detailQuery.isFetching}
          onClose={() => setSelectedClaim(null)}
          data={detailQuery.data}
        />
      </div>
    </AdminLayout>
  );
};

export default FlaggedClaims;
