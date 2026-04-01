import { useEffect, useState, useCallback } from 'react';
import { fetchClaims, fetchClaimDetail, updateClaimStatus } from '../services/claimsService';

export const useManageClaims = () => {
  const [stats, setStats]               = useState(null);
  const [claims, setClaims]             = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch]             = useState('');
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  // ── Detail modal ──────────────────────────────────────────────────────────
  const [selectedClaim, setSelectedClaim]         = useState(null);
  const [detailLoading, setDetailLoading]         = useState(false);
  const [isDetailOpen, setIsDetailOpen]           = useState(false);

  // ── Approve modal ─────────────────────────────────────────────────────────
  const [approveTarget, setApproveTarget]         = useState(null);
  const [approveNotes, setApproveNotes]           = useState('');
  const [isApproveOpen, setIsApproveOpen]         = useState(false);
  const [approveLoading, setApproveLoading]       = useState(false);

  // ── Reject modal ──────────────────────────────────────────────────────────
  const [rejectTarget, setRejectTarget]           = useState(null);
  const [rejectNotes, setRejectNotes]             = useState('');
  const [isRejectOpen, setIsRejectOpen]           = useState(false);
  const [rejectLoading, setRejectLoading]         = useState(false);
  const [rejectNotesError, setRejectNotesError]   = useState(false);

  // ── Action feedback ───────────────────────────────────────────────────────
  const [actionError, setActionError] = useState('');

  // ── Load claims ───────────────────────────────────────────────────────────
  const loadClaims = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchClaims({ status: statusFilter });
      setStats(data?.stats ?? null);
      setClaims(Array.isArray(data?.claims) ? data.claims : []);
    } catch (err) {
      console.error('Failed to load claims', err);
      setStats(null);
      setClaims([]);
      setError('Unable to load claims. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  // ── Filtered by search (client-side) ─────────────────────────────────────
  const filteredClaims = (Array.isArray(claims) ? claims : []).filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      String(c?.claim_id ?? '').toLowerCase().includes(q) ||
      String(c?.user_name ?? '').toLowerCase().includes(q) ||
      String(c?.policy_number ?? '').toLowerCase().includes(q)
    );
  });

  // ── Detail modal handlers ─────────────────────────────────────────────────
  const openDetail = async (claimId) => {
    setIsDetailOpen(true);
    setDetailLoading(true);
    setSelectedClaim(null);
    try {
      const data = await fetchClaimDetail(claimId);
      setSelectedClaim(data);
    } catch (err) {
      console.error('Failed to load claim detail', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedClaim(null);
  };

  // ── Approve modal handlers ────────────────────────────────────────────────
  const openApprove = (claim) => {
    setApproveTarget(claim);
    setApproveNotes('');
    setActionError('');
    setIsApproveOpen(true);
  };

  const closeApprove = () => {
    setIsApproveOpen(false);
    setApproveTarget(null);
    setApproveNotes('');
  };

  const confirmApprove = async () => {
    if (!approveTarget) return;
    try {
      setApproveLoading(true);
      setActionError('');
      await updateClaimStatus(approveTarget.claim_id, {
        status: 'approved',
        review_notes: approveNotes,
      });
      closeApprove();
      await loadClaims();
    } catch (err) {
      console.error('Failed to approve claim', err);
      setActionError(err?.response?.data?.detail || 'Failed to approve claim.');
    } finally {
      setApproveLoading(false);
    }
  };

  // ── Reject modal handlers ─────────────────────────────────────────────────
  const openReject = (claim) => {
    setRejectTarget(claim);
    setRejectNotes('');
    setRejectNotesError(false);
    setActionError('');
    setIsRejectOpen(true);
  };

  const closeReject = () => {
    setIsRejectOpen(false);
    setRejectTarget(null);
    setRejectNotes('');
    setRejectNotesError(false);
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    if (!rejectNotes.trim()) {
      setRejectNotesError(true);
      return;
    }
    try {
      setRejectLoading(true);
      setActionError('');
      await updateClaimStatus(rejectTarget.claim_id, {
        status: 'rejected',
        review_notes: rejectNotes,
      });
      closeReject();
      await loadClaims();
    } catch (err) {
      console.error('Failed to reject claim', err);
      setActionError(err?.response?.data?.detail || 'Failed to reject claim.');
    } finally {
      setRejectLoading(false);
    }
  };

  return {
    // data
    stats,
    claims: filteredClaims,
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

    // action error (approve/reject)
    actionError,
  };
};
