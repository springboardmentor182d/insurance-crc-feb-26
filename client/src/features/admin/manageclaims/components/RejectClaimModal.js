import { FiX } from 'react-icons/fi';
import '../styles/manageClaims.css';

const RejectClaimModal = ({
  claim,
  notes,
  setNotes,
  notesError,
  onConfirm,
  onClose,
  loading,
  actionError,
}) => {
  if (!claim) return null;

  return (
    <div className="claims-modal-overlay" onClick={onClose}>
      <div
        className="claims-modal claims-modal--action"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div className="claims-modal-header">
          <h2 className="claims-modal-title">Reject Claim</h2>
          <button onClick={onClose} className="claims-modal-close">
            <FiX size={20} />
          </button>
        </div>

        <div className="claims-modal-body">

          {/* ── Claim summary card ── */}
          <div className="claims-action-summary">
            <p className="claims-action-summary-id">Claim: {claim.claim_id}</p>
            <p className="claims-action-summary-meta">User: {claim.user_name}</p>
            <p className="claims-action-summary-meta">
              Amount: ${claim.amount?.toLocaleString()}
            </p>
          </div>

          {/* ── Notes (required for rejection) ── */}
          <div className="claims-action-field">
            <label className="claims-action-label">
              Review Notes <span className="claims-action-required">*</span>
            </label>
            <textarea
              rows={5}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              placeholder="Provide detailed notes for rejecting this claim..."
              className={`claims-action-textarea ${notesError ? 'claims-action-textarea--error' : ''}`}
            />
            {notesError && (
              <p className="claims-action-notes-error">
                * Review notes are required when rejecting a claim
              </p>
            )}
          </div>

          {actionError && (
            <p className="claims-action-error">{actionError}</p>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="claims-modal-footer">
          <button onClick={onClose} className="claims-btn claims-btn--ghost">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || !notes.trim()}
            className={`claims-btn claims-btn--reject ${!notes.trim() ? 'claims-btn--disabled' : ''}`}
          >
            {loading ? 'Rejecting…' : 'Confirm Rejection'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RejectClaimModal;