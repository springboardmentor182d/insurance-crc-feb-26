import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import {
getFraudFlags,
getFraudStats,
updateFraudStatus
} from "../services/fraudApi";

import FraudRules from "./FraudRules";

import {
FiHome,
FiUsers,
FiFileText,
FiAlertTriangle,
FiBarChart2,
FiPlusCircle,
FiClipboard,
FiSettings,
FiLogOut,
FiShield,
FiFlag,
FiTrendingUp,
FiUser,
FiEye,
FiX,
FiCheckCircle,
FiArrowUpCircle,
FiXCircle
} from "react-icons/fi";

function FraudDashboard(){

const[flags,setFlags]=useState([]);
const[stats,setStats]=useState({});
const[search,setSearch]=useState("");
const[filter,setFilter]=useState("all");
const[selectedFlag,setSelectedFlag]=useState(null);

/* NEW TAB STATE */
const[activeTab,setActiveTab]=useState("cases");

const loadData=async()=>{

try{

const flagData=await getFraudFlags();
const statsData=await getFraudStats();

setFlags(flagData);
setStats(statsData);

}catch(err){
console.error(err);
}

};

useEffect(()=>{
loadData();
},[]);

const updateStatus=async(id,status)=>{
await updateFraudStatus(id,status);
setSelectedFlag(null);
loadData();
};

const filteredFlags=flags
.filter(f=>filter==="all"||f.severity===filter)
.filter(f=>f.claim_id.toLowerCase().includes(search.toLowerCase()));

return(

<div className="dashboard">

{/* SIDEBAR */}

<aside className="sidebar">

<h2 className="logo">
<FiShield className="logo-icon"/>
Admin Panel
</h2>

<ul>

<li>
<FiHome className="menu-icon"/>
Dashboard
</li>

<li>
<FiUsers className="menu-icon"/>
Manage Users
</li>

<li>
<FiFileText className="menu-icon"/>
Manage Policies
</li>

<li>
<FiClipboard className="menu-icon"/>
Claims Management
</li>

<li className="active">
<FiAlertTriangle className="menu-icon"/>
Fraud Detection
</li>

<li>
<FiBarChart2 className="menu-icon"/>
Analytics
</li>

<li>
<FiPlusCircle className="menu-icon"/>
Add Policy Manually
</li>

<li>
<FiClipboard className="menu-icon"/>
Admin Logs
</li>

<li>
<FiSettings className="menu-icon"/>
Settings
</li>

<li>
<FiLogOut className="menu-icon"/>
Logout
</li>

</ul>

</aside>

{/* MAIN */}

<main className="main">

{/* HEADER */}

<div className="header">

<div>

<h1>Fraud Detection</h1>
<p>Organization ID: ORG-12345</p>

{/* MODERN TABS */}

<div className="fraud-tabs">

<button
className={activeTab==="cases" ? "tab-btn active":"tab-btn"}
onClick={()=>setActiveTab("cases")}
>
Fraud Cases
</button>

<button
className={activeTab==="rules" ? "tab-btn active":"tab-btn"}
onClick={()=>setActiveTab("rules")}
>
Fraud Rules
</button>

</div>

</div>

<div className="header-actions">

<button className="admin-btn">
<FiUser/> Admin
</button>

<button className="logout-btn">
Logout
</button>

</div>

</div>

{/* ===========================
   FRAUD CASES TAB
=========================== */}

{activeTab==="cases" &&(

<>

{/* STATS */}

<div className="stats">

<div className="card">
<div>
<p>Total Flags</p>
<h2>{stats.total_flags}</h2>
</div>
<div className="card-icon purple">
<FiShield/>
</div>
</div>

<div className="card">
<div>
<p>High Severity</p>
<h2>{stats.high_severity}</h2>
</div>
<div className="card-icon red">
<FiAlertTriangle/>
</div>
</div>

<div className="card">
<div>
<p>New Cases</p>
<h2>{stats.new_cases}</h2>
</div>
<div className="card-icon blue">
<FiFlag/>
</div>
</div>

<div className="card">
<div>
<p>Escalated</p>
<h2>{stats.escalated}</h2>
</div>
<div className="card-icon violet">
<FiTrendingUp/>
</div>
</div>

</div>

{/* SEARCH */}

<div className="search-bar">

<div className="search-input">

<span className="search-icon">🔍</span>

<input
type="text"
placeholder="Search by claim ID, user name, or fraud rule..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>

<div className="filters">

<button
className={filter==="all" ? "filter-btn active":"filter-btn"}
onClick={()=>setFilter("all")}
>
All
</button>

<button
className={filter==="low" ? "filter-btn active":"filter-btn"}
onClick={()=>setFilter("low")}
>
Low
</button>

<button
className={filter==="medium" ? "filter-btn active":"filter-btn"}
onClick={()=>setFilter("medium")}
>
Medium
</button>

<button
className={filter==="high" ? "filter-btn active":"filter-btn"}
onClick={()=>setFilter("high")}
>
High
</button>

</div>

</div>

{/* TABLE */}

<div className="table-container">

<table>

<thead>
<tr>
<th>Claim ID</th>
<th>User</th>
<th>Fraud Rule Triggered</th>
<th>Severity</th>
<th>Details</th>
<th>Date</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{filteredFlags.map(flag=>(

<tr key={flag.id}>

<td className="claim-id">{flag.claim_id}</td>

<td className="user-name">John Doe</td>

<td>{flag.rule_code}</td>

<td>
<span className={"severity "+flag.severity}>
{flag.severity}
</span>
</td>

<td className="details">{flag.details}</td>

<td>{new Date(flag.created_at).toLocaleDateString()}</td>

<td>
<span className={"status "+flag.status}>
{flag.status}
</span>
</td>

<td>

<button
className="review-btn"
onClick={()=>setSelectedFlag(flag)}
>
<FiEye/> Review
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</>

)}

{/* ===========================
   FRAUD RULES TAB
=========================== */}

{activeTab==="rules" &&(
<FraudRules/>
)}

</main>

{/* ===========================
   REVIEW MODAL
=========================== */}

{selectedFlag &&(

<div className="modal-overlay">

<div className="review-modal">

<div className="review-header">

<div className="review-title">
<FiAlertTriangle className="review-icon"/>
Fraud Alert Details
</div>

<button
className="close-btn"
onClick={()=>setSelectedFlag(null)}
>
<FiX/>
</button>

</div>

<div className="severity-box">

<h3>High Severity Alert</h3>

<p className="rule-name">
{selectedFlag.rule_code}
</p>

</div>

<div className="claim-grid">

<div className="claim-item">
<label>Claim ID</label>
<p>{selectedFlag.claim_id}</p>
</div>

<div className="claim-item">
<label>User</label>
<p>John Doe</p>
</div>

<div className="claim-item">
<label>Amount Claimed</label>
<p>$5200</p>
</div>

<div className="claim-item">
<label>Detection Date</label>
<p>{new Date(selectedFlag.created_at).toLocaleDateString()}</p>
</div>

<div className="claim-item">
<label>Status</label>
<span className={"status "+selectedFlag.status}>
{selectedFlag.status}
</span>
</div>

</div>

<div className="fraud-description">

<h4>Fraud Details</h4>

<p>{selectedFlag.details}</p>

</div>

<div className="recommendations">

<h4>Recommended Actions</h4>

<ul>
<li>Verify all submitted documents</li>
<li>Cross-check user information with database</li>
<li>Contact user for additional verification</li>
<li>Review previous claim history</li>
</ul>

</div>

<div className="modal-buttons">

<button
className="btn-review"
onClick={()=>updateStatus(selectedFlag.id,"reviewed")}
>
<FiCheckCircle className="btn-icon"/>
Mark Reviewed
</button>

<button
className="btn-escalate"
onClick={()=>updateStatus(selectedFlag.id,"escalated")}
>
<FiArrowUpCircle className="btn-icon"/>
Escalate Case
</button>

<button
className="btn-reject"
onClick={()=>updateStatus(selectedFlag.id,"rejected")}
>
<FiXCircle className="btn-icon"/>
Reject Claim
</button>

</div>

</div>

</div>

)}

</div>

);

}

export default FraudDashboard;