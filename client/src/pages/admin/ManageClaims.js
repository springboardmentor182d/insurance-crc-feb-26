import { useManageClaims } from '../../features/admin/manageclaims/hooks/useManageClaims';
import StatsCards from '../../features/admin/manageclaims/components/StatsCards';
import ClaimsTable from '../../features/admin/manageclaims/components/ClaimsTable';
import ClaimDetailModal from '../../features/admin/manageclaims/components/ClaimDetailModal';
import ApproveClaimModal from '../../features/admin/manageclaims/components/ApproveClaimModal';
import RejectClaimModal from '../../features/admin/manageclaims/components/RejectClaimModal';
import AdminLayout from '../../layout/admin/AdminLayout';
import '../../features/admin/manageclaims/styles/manageClaims.css';
import '../../features/admin/dashboardColors.css';

const ManageClaims = () => {
  const {
    // data
    stats,
    claims,
    loading,
    error,

    // search & filter
    search,
    setSearch,
    statusFilter,
    setStatusFilter,

    // detail modal
    selectedClaim,
    detailLoading,
    isDetailOpen,
    openDetail,
    closeDetail,

    // approve modal
    approveTarget,
    approveNotes,
    setApproveNotes,
    isApproveOpen,
    approveLoading,
    openApprove,
    closeApprove,
    confirmApprove,

    // reject modal
    rejectTarget,
    rejectNotes,
    setRejectNotes,
    isRejectOpen,
    rejectLoading,
    rejectNotesError,
    openReject,
    closeReject,
    confirmReject,

    // action error
    actionError,
  } = useManageClaims();

  return (
    <AdminLayout>
      <div className="admin-dashboard-theme">

        {/* ── Page Header ── */}
        <div className="claims-page-header">
          <h1 className="claims-page-title">Manage Claims</h1>
          <p className="claims-page-subtitle">Review and process insurance claims</p>
        </div>

        {/* ── Error Banner ── */}
        {error && <div className="claims-error-banner">{error}</div>}

        {loading ? (
          <div className="claims-loading">Loading claims…</div>
        ) : (
          <>
            {/* ── Stats Cards ── */}
            <StatsCards stats={stats} />

            {/* ── Claims Table ── */}
            <ClaimsTable
              claims={claims}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onView={openDetail}
              onApprove={openApprove}
              onReject={openReject}
            />
          </>
        )}

        {/* ── Detail Modal ── */}
        {isDetailOpen && (
          <ClaimDetailModal
            claim={selectedClaim}
            loading={detailLoading}
            onClose={closeDetail}
            onApprove={openApprove}
            onReject={openReject}
          />
        )}

        {/* ── Approve Modal ── */}
        {isApproveOpen && (
          <ApproveClaimModal
            claim={approveTarget}
            notes={approveNotes}
            setNotes={setApproveNotes}
            onConfirm={confirmApprove}
            onClose={closeApprove}
            loading={approveLoading}
            actionError={actionError}
          />
        )}

        {/* ── Reject Modal ── */}
        {isRejectOpen && (
          <RejectClaimModal
            claim={rejectTarget}
            notes={rejectNotes}
            setNotes={setRejectNotes}
            notesError={rejectNotesError}
            onConfirm={confirmReject}
            onClose={closeReject}
            loading={rejectLoading}
            actionError={actionError}
          />
        )}

      </div>
    </AdminLayout>
  );
};

export default ManageClaims;
