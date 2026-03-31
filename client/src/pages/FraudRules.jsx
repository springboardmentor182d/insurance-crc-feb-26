import React, { useEffect, useState } from "react";

const API = "http://localhost:8000/fraud";

function FraudRules(){

const [rules,setRules] = useState([]);
const [editingId,setEditingId] = useState(null);

const [form,setForm] = useState({
rule_name:"",
field_name:"",
operator:">",
rule_value:"",
severity:"LOW",
recommendation:"Review Case"
});


const fetchRules = async()=>{
const res = await fetch(`${API}/rules`);
const data = await res.json();
setRules(data);
};

useEffect(()=>{
fetchRules();
},[]);


const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};


const resetForm = ()=>{
setEditingId(null);

setForm({
rule_name:"",
field_name:"",
operator:">",
rule_value:"",
severity:"LOW",
recommendation:"Review Case"
});
};


const addRule = async()=>{

await fetch(`${API}/rules`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
});

resetForm();
fetchRules();

};


const updateRule = async()=>{

await fetch(`${API}/rules/${editingId}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
});

resetForm();
fetchRules();

};


const deleteRule = async(id)=>{

await fetch(`${API}/rules/${id}`,{
method:"DELETE"
});

fetchRules();

};


const startEdit=(rule)=>{

setEditingId(rule.id);

setForm({
rule_name:rule.rule_name,
field_name:rule.field_name,
operator:rule.operator,
rule_value:rule.rule_value,
severity:rule.severity,
recommendation:rule.recommendation
});

};


return(

<div className="rules-container">

<h2 className="rules-title">Fraud Rules Management</h2>


{/* RULE FORM */}

<div className="rules-card">

<div className="rules-form">

<input
className="rules-input"
name="rule_name"
placeholder="Rule Name"
value={form.rule_name}
onChange={handleChange}
/>

<input
className="rules-input"
name="field_name"
placeholder="Field (ex: claim_amount)"
value={form.field_name}
onChange={handleChange}
/>

<select
className="rules-input"
name="operator"
value={form.operator}
onChange={handleChange}
>
<option value=">">Greater Than</option>
<option value="<">Less Than</option>
<option value="=">Equals</option>
</select>

<input
className="rules-input"
name="rule_value"
placeholder="Value"
value={form.rule_value}
onChange={handleChange}
/>

<select
className="rules-input"
name="severity"
value={form.severity}
onChange={handleChange}
>
<option>LOW</option>
<option>MEDIUM</option>
<option>HIGH</option>
</select>

<select
className="rules-input"
name="recommendation"
value={form.recommendation}
onChange={handleChange}
>
<option>Review Case</option>
<option>Escalate Case</option>
<option>Reject Claim</option>
</select>

{editingId ? (

<button className="btn-update" onClick={updateRule}>
Update Rule
</button>

):(

<button className="btn-add" onClick={addRule}>
Add Rule
</button>

)}

<button className="btn-reset" onClick={resetForm}>
Reset
</button>

</div>

</div>


{/* RULE TABLE */}

<div className="rules-table-card">

<table className="rules-table">

<thead>

<tr>
<th>ID</th>
<th>Rule Name</th>
<th>Field</th>
<th>Operator</th>
<th>Value</th>
<th>Severity</th>
<th>Recommendation</th>
<th>Actions</th>
</tr>

</thead>

<tbody>

{rules.map(rule=>(

<tr key={rule.id}>

<td>{rule.id}</td>
<td>{rule.rule_name}</td>
<td>{rule.field_name}</td>
<td>{rule.operator}</td>
<td>{rule.rule_value}</td>

<td>
<span className={`severity-badge ${rule.severity.toLowerCase()}`}>
{rule.severity}
</span>
</td>

<td>{rule.recommendation}</td>

<td>

<button
className="btn-edit"
onClick={()=>startEdit(rule)}
>
Edit
</button>

<button
className="btn-delete"
onClick={()=>deleteRule(rule.id)}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}

export default FraudRules;