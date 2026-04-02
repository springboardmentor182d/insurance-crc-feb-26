import { FiSearch, FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import '../styles/manageClaims.css';

const STATUS_TABS = [
  { key: 'all',          label: 'All'          },
  { key: 'under_review', label: 'Under Review' },
  { key: 'approved',     label: 'Approved'     },
  { key: 'rejected',     label: 'Rejected'     },
];

const StatusBadge = ({ status }) => {
  const map = {
    under_review: { label: 'under review', className: 'claims-badge claims-badge--review' },
    approved:     { label: 'approved',     className: 'claims-badge claims-badge--approved' },
    rejected:     { label: 'rejected',     className: 'claims-badge claims-badge--rejected' },
  };
  const badge = map[status] || { label: status, className: 'claims-badge' };
  return <span className={badge.className}>{badge.label}</span>;
};

const ClaimsTable = ({
  claims,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onView,
  onApprove,
  onReject,
}) => {
  const isTerminal = (status) => status === 'approved' || status === 'rejected';

  return (
    <div className="claims-table-wrapper admin-surface">

      {/* ── Search + Filter bar ── */}
      <div className="claims-toolbar">
        <div className="claims-search-box">
          <FiSearch className="claims-search-icon" />
          <input
            type="text"
            placeholder="Search by claim number, user name, or policy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="claims-search-input"
          />
        </div>

        <div className="claims-filter-tabs">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`claims-filter-tab ${statusFilter === tab.key ? 'claims-filter-tab--active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="claims-table-scroll">
        <table className="claims-table">
          <thead>
            <tr className="claims-table-head">
              <th className="claims-th">Claim #</th>
              <th className="claims-th">User</th>
              <th className="claims-th">Policy</th>
              <th className="claims-th">Incident Type</th>
              <th className="claims-th">Amount</th>
              <th className="claims-th">Submitted</th>
              <th className="claims-th">Status</th>
              <th className="claims-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.length === 0 ? (
              <tr>
                <td colSpan={8} className="claims-empty-row">
                  No claims found.
                </td>
              </tr>
            ) : (
              claims.map((claim) => (
                <tr key={claim.claim_id} className="claims-table-row">

                  <td className="claims-td claims-td--id">{claim.claim_id}</td>

                  <td className="claims-td">
                    <span className="claims-user-name">{claim.user_name}</span>
                    <span className="claims-user-email">{claim.user_email}</span>
                  </td>

                  <td className="claims-td">
                    <span className="claims-policy-type">{claim.policy_type}</span>
                    <span className="claims-policy-number">{claim.policy_number}</span>
                  </td>

                  <td className="claims-td">{claim.incident_type}</td>

                  <td className="claims-td claims-td--amount">
                    ${claim.amount.toLocaleString()}
                  </td>

                  <td className="claims-td">{claim.submitted_date}</td>

                  <td className="claims-td">
                    <StatusBadge status={claim.status} />
                  </td>

                  <td className="claims-td">
                    <div className="claims-actions">
                      {/* View — always visible */}
                      <button
                        onClick={() => onView(claim.claim_id)}
                        className="claims-action-btn claims-action-btn--view"
                        title="View Details"
                      >
                        <FiEye size={17} />
                      </button>

                      {/* Approve / Reject — only for non-terminal claims */}
                      {!isTerminal(claim.status) && (
                        <>
                          <button
                            onClick={() => onApprove(claim)}
                            className="claims-action-btn claims-action-btn--approve"
                            title="Approve Claim"
                          >
                            <FiCheckCircle size={17} />
                          </button>

                          <button
                            onClick={() => onReject(claim)}
                            className="claims-action-btn claims-action-btn--reject"
                            title="Reject Claim"
                          >
                            <FiXCircle size={17} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ClaimsTable;