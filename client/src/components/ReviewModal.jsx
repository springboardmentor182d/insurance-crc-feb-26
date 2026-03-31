import React from "react";
import { 
FiAlertTriangle,
FiX,
FiCheckCircle,
FiTrendingUp,
FiXCircle
} from "react-icons/fi";

function ReviewModal({ flag, onClose, updateStatus }) {

if(!flag) return null;

return (

<div className="modal-overlay">

<div className="fraud-modal">

{/* HEADER */}

<div className="fraud-modal-header">

<div className="fraud-header-left">
<FiAlertTriangle className="fraud-header-icon"/>
Fraud Alert Details
</div>

<button className="fraud-close-btn" onClick={onClose}>
<FiX/>
</button>

</div>

{/* ALERT BOX */}

<div className="fraud-alert-box">

<div className="alert-icon">
<FiAlertTriangle/>
</div>

<div>
<h3>High Severity Alert</h3>
<p>{flag.rule_code}</p>
</div>

</div>

{/* INFO GRID */}

<div className="fraud-grid">

<div>
<label>Claim ID</label>
<p>{flag.claim_id}</p>
</div>

<div>
<label>User</label>
<p>John Doe</p>
</div>

<div>
<label>Amount Claimed</label>
<p className="amount">$5,200</p>
</div>

<div>
<label>Detection Date</label>
<p>{new Date(flag.created_at).toLocaleDateString()}</p>
</div>

<div>
<label>Status</label>
<span className={"status "+flag.status}>
{flag.status}
</span>
</div>

</div>

{/* FRAUD DETAILS */}

<div className="fraud-details-box">

<label>Fraud Details</label>

<p>
{flag.details}
</p>

</div>

{/* RECOMMENDED */}

<div className="fraud-recommend-box">

<h4>Recommended Actions:</h4>

<ul>
<li>Verify all submitted documents for authenticity</li>
<li>Cross-check user information with database</li>
<li>Contact user for additional verification</li>
<li>Review claim history and patterns</li>
</ul>

</div>

{/* ACTION BUTTONS */}

<div className="fraud-actions">

<button
className="btn-reviewed"
onClick={()=>updateStatus(flag.id,"reviewed")}
>
<FiCheckCircle/>
Mark Reviewed
</button>

<button
className="btn-escalate"
onClick={()=>updateStatus(flag.id,"escalated")}
>
<FiTrendingUp/>
Escalate Case
</button>

<button
className="btn-reject"
onClick={()=>updateStatus(flag.id,"rejected")}
>
<FiXCircle/>
Reject Claim
</button>

</div>

</div>

</div>

);

}

export default ReviewModal;