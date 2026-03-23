import React from "react";

function InsuranceCard({data}){

return(

<div className="card">

<h2>{data.title}</h2>

<h3>{data.policy}</h3>

<p><b>Premium:</b> {data.premium}</p>
<p><b>Coverage:</b> {data.coverage}</p>

<h4>Why we recommend this:</h4>

<ul>

{data.benefits.map((b,i)=>(
<li key={i}>{b}</li>
))}

</ul>

<div className="match">
Match Score : {data.match}
</div>

<div className="buttons">

<button className="quote">
Get Quote
</button>

<button className="learn">
Learn More
</button>

<button className="not">
Not Interested
</button>

</div>

</div>

)

}

export default InsuranceCard