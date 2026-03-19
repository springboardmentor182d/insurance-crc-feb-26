import React, { useEffect, useState } from "react";
import "./FraudDetection.css";

function FraudDetection() {

const [fraudCases,setFraudCases] = useState([])
const [rules,setRules] = useState([])
const [activeTab,setActiveTab] = useState("cases")
const [search,setSearch] = useState("")
const [showModal,setShowModal] = useState(false)

const [newRule,setNewRule] = useState({
rule_id:"",
rule_name:"",
description:"",
severity:"Medium",
detections:0,
created_date:"",
status:"Active"
})

const [currentPage,setCurrentPage] = useState(1)
const rowsPerPage = 5


useEffect(()=>{

fetch(`${process.env.REACT_APP_BASE_URL}/fraud/cases`)
.then(res=>res.json())
.then(data=>setFraudCases(data))

fetch(`${process.env.REACT_APP_BASE_URL}/fraud/rules`)
.then(res=>res.json())
.then(data=>setRules(data))

},[])



const filteredCases = fraudCases.filter(c =>
(c.claimant || "").toLowerCase().includes(search.toLowerCase())
)



const indexOfLast = currentPage * rowsPerPage
const indexOfFirst = indexOfLast - rowsPerPage

const currentCases = filteredCases.slice(indexOfFirst,indexOfLast)

const totalPages = Math.ceil(filteredCases.length / rowsPerPage)



const handleView = (id)=>{
alert("Viewing Case "+id)
}

const handleApprove = (id)=>{
alert("Approved Case "+id)
}

const handleReject = (id)=>{
alert("Rejected Case "+id)
}

const handleEditRule = (id)=>{
alert("Edit Rule "+id)
}

const handleDeleteRule = (id)=>{
if(window.confirm("Delete this rule?")){
setRules(prev => prev.filter(rule => rule.rule_id !== id))
}
}



const handleAddRule = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/fraud/rules`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRule)
      }
    );

    const data = await response.json();

    console.log("Created rule:", data);

     if (!response.ok) {
      alert(data.detail || "Server error while creating rule");
      return;
    }

    setRules([...rules, data]);

    setNewRule({
      rule_id: "",
      rule_name: "",
      description: "",
      severity: "Medium",
      detections: 0,
      created_date: "",
      status: "Active",
    });

    setShowAddRule(false);
    alert("Rule created successfully");
  } catch (error) {
    console.error("Create rule error:", error);
    alert("Server error while creating rule");
  }
};

return (

<div className="fraud-container">

<h1>Fraud Detection & Prevention</h1>

<p className="subtitle">
Monitor suspicious activities and manage fraud detection rules
</p>



{/* DASHBOARD CARDS */}

<div className="fraud-cards">

<div className="card">
<div className="card-top">
<span>Active Cases</span>
<div className="icon warning">⚠</div>
</div>
<h2>{fraudCases.length}</h2>
</div>

<div className="card">
<div className="card-top">
<span>Confirmed Fraud</span>
<div className="icon danger">✖</div>
</div>
<h2>142</h2>
</div>

<div className="card">
<div className="card-top">
<span>Amount Saved</span>
<div className="icon success">✔</div>
</div>
<h2>$1.2M</h2>
</div>

<div className="card">
<div className="card-top">
<span>Active Rules</span>
<div className="icon shield">🛡</div>
</div>
<h2>{rules.length}</h2>
</div>

</div>



{/* TABS */}

<div className="tabs">

<button
className={activeTab==="cases"?"active-tab":""}
onClick={()=>setActiveTab("cases")}
>
Fraud Cases
</button>

<button
className={activeTab==="rules"?"active-tab":""}
onClick={()=>setActiveTab("rules")}
>
Detection Rules
</button>

</div>



{/* SEARCH */}

{activeTab==="cases" && (

<div className="filters">

<input
type="text"
placeholder="Search cases..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select>
<option>All Risk Levels</option>
<option>Critical</option>
<option>High</option>
<option>Medium</option>
</select>

<select>
<option>All Statuses</option>
<option>Under Review</option>
<option>Confirmed Fraud</option>
<option>Dismissed</option>
</select>

</div>

)}



{/* FRAUD CASES TABLE */}

{activeTab==="cases" && (

<>

<table className="fraud-table">

<thead>

<tr>
<th>Case ID</th>
<th>Claim Details</th>
<th>Claimant</th>
<th>Amount</th>
<th>Risk Level</th>
<th>Confidence</th>
<th>Triggered Rules</th>
<th>Status</th>
<th>Actions</th>
</tr>

</thead>

<tbody>

{currentCases.map((item,index)=>(

<tr key={index}>

<td>{item.case_id}</td>

<td>
{item.claim_id}
<br/>
<span className="policy">{item.policy_id}</span>
</td>

<td>{item.claimant}</td>

<td>${item.amount}</td>

<td>
<span className={(item.risk_level || "medium").toLowerCase()}>
{item.risk_level || "Medium"}
</span>
</td>

<td>

<div className="confidence">

<div className="progress">

<div
className="progress-bar"
style={{width:(item.confidence || 0)+"%"}}
></div>

</div>

<span>{item.confidence || 0}%</span>

</div>

</td>

<td className="rules">

<ul>
{(item.rules || "").split(",").map((rule,i)=>(
<li key={i}>{rule}</li>
))}
</ul>

</td>

<td>

<span className={
"status "+
((item.status || "Under Review").replace(" ","-").toLowerCase())
}>
{item.status || "Under Review"}
</span>

</td>

<td className="actions">

<button onClick={()=>handleView(item.case_id)}>👁</button>
<button onClick={()=>handleReject(item.case_id)}>❌</button>
<button onClick={()=>handleApprove(item.case_id)}>✔</button>

</td>

</tr>

))}

</tbody>

</table>



<div className="pagination">

<button
disabled={currentPage===1}
onClick={()=>setCurrentPage(currentPage-1)}
>
Previous
</button>

<span>
Page {currentPage} of {totalPages}
</span>

<button
disabled={currentPage===totalPages}
onClick={()=>setCurrentPage(currentPage+1)}
>
Next
</button>

</div>

</>

)}



{/* DETECTION RULES */}

{activeTab==="rules" && (

<div>

<div className="rules-header">

<h3>Detection Rules</h3>

<button
className="add-rule"
onClick={()=>setShowModal(true)}
>
+ Add New Rule
</button>

</div>



<table className="fraud-table">

<thead>

<tr>
<th>Rule ID</th>
<th>Rule Name</th>
<th>Description</th>
<th>Severity</th>
<th>Detections</th>
<th>Created Date</th>
<th>Status</th>
<th>Actions</th>
</tr>

</thead>

<tbody>

{rules.map((rule,index)=>(

<tr key={index}>

<td>{rule.rule_id}</td>

<td>{rule.rule_name}</td>

<td>{rule.description}</td>

<td>
<span className={(rule.severity || "medium").toLowerCase()}>
{rule.severity}
</span>
</td>

<td>{rule.detections}</td>

<td>{rule.created_date}</td>

<td>{rule.status}</td>

<td className="actions">

<button onClick={()=>handleEditRule(rule.rule_id)}>✏</button>
<button onClick={()=>handleDeleteRule(rule.rule_id)}>🗑</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)}



{/* ADD RULE MODAL */}

{showModal && (

<div className="modal">

<div className="modal-content">

<h2>Add Detection Rule</h2>

<input
placeholder="Rule ID"
onChange={(e)=>setNewRule({...newRule,rule_id:e.target.value})}
/>

<input
placeholder="Rule Name"
onChange={(e)=>setNewRule({...newRule,rule_name:e.target.value})}
/>

<textarea
placeholder="Description"
onChange={(e)=>setNewRule({...newRule,description:e.target.value})}
/>
  <select
    value={newRule.severity}
    onChange={(e) => setNewRule({ ...newRule, severity: e.target.value })}
  >
    <option value="Critical">Critical</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  </select>
<input
  type="number"
  placeholder="Detections"
  value={newRule.detections}
  onChange={(e) =>
    setNewRule({ ...newRule, detections: Number(e.target.value) })
  }
/>

<input
  type="date"
  value={newRule.created_date}
  onChange={(e) =>
    setNewRule({ ...newRule, created_date: e.target.value })
  }
/>

<select
  value={newRule.status}
  onChange={(e) => setNewRule({ ...newRule, status: e.target.value })}
>
  <option value="Active">Active</option>
  <option value="Inactive">Inactive</option>
</select>
<button className="create-btn" onClick={handleAddRule}>
Create Rule
</button>

<button
className="cancel"
onClick={()=>setShowModal(false)}
>
Cancel
</button>

</div>

</div>

)}

</div>

)

}

export default FraudDetection