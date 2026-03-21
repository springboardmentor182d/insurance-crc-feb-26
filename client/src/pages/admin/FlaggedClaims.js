import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiSearch } from "react-icons/fi";

import AdminLayout from "../../layout/admin/AdminLayout";
import "../../features/admin/dashboardColors.css";
import FlaggedClaimCard from "../../components/admin/FlaggedClaimCard";
import ClaimDetailDrawer from "../../components/admin/ClaimDetailDrawer";
import { useFlaggedClaims } from "../../hooks/useFlaggedClaims";
import { fetchClaimDetails } from "../../api/flaggedClaims";

const statusOptions = ["all", "pending", "fraudulent", "approved", "rejected"];

const FlaggedClaims = () => {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedClaim, setSelectedClaim] = useState(null);

  const { listQuery, statsQuery, confirmMutation, clearMutation, optimisticRemove } = useFlaggedClaims({
    status,
    search,
    page,
    pageSize: 8
  });

  const detailQuery = useQuery({
    queryKey: ["claim-details", selectedClaim?.claim_id],
    // FIX: Added optional chaining — queryFn can be called while selectedClaim
    // is nullish during React state transitions even with `enabled` guard.
    queryFn: () => fetchClaimDetails(selectedClaim?.claim_id),
    enabled: Boolean(selectedClaim)
  });

  const stats = statsQuery.data;
  const claims = listQuery.data?.items || [];

  // FIX: Destructure total before useMemo to avoid the react-hooks/exhaustive-deps
  // warning about object expressions changing on every render (seen in the BOM screenshot).
  const listTotal = listQuery.data?.total || 0;
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(listTotal / 8));
  }, [listTotal]);

  return (
    <AdminLayout>
      <div className="admin-dashboard-theme space-y-6 lg:space-y-8">
        <div>
          <h1 className="text-3xl font-semibold admin-text-primary">Flagged Claims</h1>
          <p className="mt-2 text-base admin-text-secondary md:text-lg">
            Review high-risk claims and confirm fraud decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Flagged", value: stats?.total_flagged ?? 0, color: "text-orange-500" },
            { label: "Pending Review", value: stats?.pending_review ?? 0, color: "text-yellow-500" },
            { label: "Fraud Confirmed", value: stats?.fraud_confirmed ?? 0, color: "text-red-600" },
            { label: "Cleared", value: stats?.cleared ?? 0, color: "text-green-600" }
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500" />
              <input
                placeholder="Search by claim number or user name"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="h-12 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All Status" : option.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {listQuery.isLoading && (
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="admin-surface rounded-3xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="h-4 w-1/3 rounded bg-gray-100" />
                <div className="mt-4 h-16 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {listQuery.isError && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load flagged claims. Please try again.
          </div>
        )}

        {!listQuery.isLoading && !listQuery.isError && claims.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <p className="text-base admin-text-secondary">No flagged claims found.</p>
          </div>
        )}

        {!listQuery.isLoading && !listQuery.isError && claims.length > 0 && (
          <div className="space-y-4">
            {claims.map((claim) => (
              <FlaggedClaimCard
                key={claim.claim_id}
                claim={claim}
                onConfirm={(selected) => {
                  confirmMutation.mutate(selected.claim_id, {
                    onSuccess: () => optimisticRemove(selected.claim_id)
                  });
                }}
                onClear={(selected) => {
                  clearMutation.mutate(selected.claim_id, {
                    onSuccess: () => optimisticRemove(selected.claim_id)
                  });
                }}
                onView={(selected) => setSelectedClaim(selected)}
              />
            ))}
          </div>
        )}

        {!listQuery.isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
            >
              Previous
            </button>
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        <ClaimDetailDrawer
          isOpen={Boolean(selectedClaim)}
          // FIX: Was detailQuery.isLoading — which is true even when the query is
          // disabled (no claim selected yet), causing a flash of skeleton on open.
          // isFetching is only true when a network request is actually in-flight.
          isLoading={detailQuery.isFetching}
          onClose={() => setSelectedClaim(null)}
          data={detailQuery.data}
        />
      </div>
    </AdminLayout>
  );
};

export default FlaggedClaims;