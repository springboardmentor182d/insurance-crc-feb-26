import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiDownload, FiFileText } from 'react-icons/fi';
import '../styles/manageClaims.css';

const StatusBadge = ({ status }) => {
  const map = {
    under_review: { label: 'under review', className: 'claims-badge claims-badge--review' },
    approved:     { label: 'approved',     className: 'claims-badge claims-badge--approved' },
    rejected:     { label: 'rejected',     className: 'claims-badge claims-badge--rejected' },
  };
  const badge = map[status] || { label: status, className: 'claims-badge' };
  return <span className={badge.className}>{badge.label}</span>;
};

const InfoRow = ({ label, value }) => (
  <div className="claims-detail-info-row">
    <span className="claims-detail-info-label">{label}</span>
    <span className="claims-detail-info-value">{value}</span>
  </div>
);

const ClaimDetailModal = ({ claim, loading, onClose, onApprove, onReject }) => {
  if (!claim && !loading) return null;

  const isTerminal = claim && (claim.status === 'approved' || claim.status === 'rejected');

  return (
    <div className="claims-modal-overlay" onClick={onClose}>
      <div
        className="claims-modal claims-modal--detail"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div className="claims-modal-header">
          <h2 className="claims-modal-title">Claim Details</h2>
          <button onClick={onClose} className="claims-modal-close">
            <FiX size={20} />
          </button>
        </div>

        {loading ? (
          <div className="claims-modal-loading">Loading claim details…</div>
        ) : (
          <div className="claims-modal-body">

            {/* ── Claim Information ── */}
            <section className="claims-detail-section">
              <h3 className="claims-detail-section-title">Claim Information</h3>
              <div className="claims-detail-info-grid">
                <InfoRow label="Claim Number"    value={claim.claim_id} />
                <InfoRow label="Status"          value={<StatusBadge status={claim.status} />} />
                <InfoRow label="Policy Type"     value={claim.policy_type} />
                <InfoRow label="Policy Number"   value={claim.policy_number} />
                <InfoRow label="Incident Type"   value={claim.incident_type} />
                <InfoRow label="Incident / Reported Date" value={claim.incident_date} />
                <InfoRow label="Claim Amount"    value={`$${claim.amount.toLocaleString()}`} />
                <InfoRow label="Submitted Date"  value={claim.submitted_date} />
              </div>
            </section>

            {/* ── User Information ── */}
            <section className="claims-detail-section">
              <h3 className="claims-detail-section-title">User Information</h3>
              <div className="claims-detail-user-list">
                <div className="claims-detail-user-row">
                  <FiUser size={16} className="claims-detail-user-icon" />
                  <span className="claims-detail-user-value">{claim.user.full_name}</span>
                </div>
                <div className="claims-detail-user-row">
                  <FiMail size={16} className="claims-detail-user-icon" />
                  <span className="claims-detail-user-value">{claim.user.email}</span>
                </div>
                <div className="claims-detail-user-row">
                  <FiPhone size={16} className="claims-detail-user-icon" />
                  <span className="claims-detail-user-value">{claim.user.phone}</span>
                </div>
                <div className="claims-detail-user-row">
                  <FiMapPin size={16} className="claims-detail-user-icon" />
                  <span className="claims-detail-user-value">{claim.user.address}</span>
                </div>
              </div>
            </section>

            {/* ── Incident Description ── */}
            <section className="claims-detail-section">
              <h3 className="claims-detail-section-title">Incident Description</h3>
              <p className="claims-detail-description">{claim.incident_description}</p>
            </section>

            {claim.review_notes && (
              <section className="claims-detail-section">
                <h3 className="claims-detail-section-title">Latest Review Notes</h3>
                <p className="claims-detail-description">{claim.review_notes}</p>
              </section>
            )}

            {/* ── Uploaded Documents ── */}
            <section className="claims-detail-section">
              <h3 className="claims-detail-section-title">
                Uploaded Documents ({claim.documents.length})
              </h3>
              <div className="claims-detail-docs">
                {claim.documents.length === 0 ? (
                  <p className="claims-detail-description">
                    No claim-specific documents are available yet from the user claims workflow.
                  </p>
                ) : (
                  claim.documents.map((doc, i) => (
                  <div key={i} className="claims-detail-doc-row">
                    <FiFileText size={16} className="claims-detail-doc-icon" />
                    <div className="claims-detail-doc-info">
                      <span className="claims-detail-doc-name">{doc.name}</span>
                      <span className="claims-detail-doc-meta">
                        {doc.doc_type} • {doc.size_mb} MB • Uploaded {doc.uploaded_date}
                      </span>
                    </div>
                    <button className="claims-detail-doc-download" title="Download">
                      <FiDownload size={16} />
                    </button>
                  </div>
                ))
                )}
              </div>
            </section>

          </div>
        )}

        {/* ── Footer actions ── */}
        {!loading && claim && (
          <div className="claims-modal-footer">
            <button onClick={onClose} className="claims-btn claims-btn--ghost">
              Close
            </button>
            {!isTerminal && (
              <>
                <button
                  onClick={() => { onClose(); onApprove(claim); }}
                  className="claims-btn claims-btn--approve"
                >
                  Approve Claim
                </button>
                <button
                  onClick={() => { onClose(); onReject(claim); }}
                  className="claims-btn claims-btn--reject"
                >
                  Reject Claim
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ClaimDetailModal;
