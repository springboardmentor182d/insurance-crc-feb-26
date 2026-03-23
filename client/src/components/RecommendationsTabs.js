import React from "react";

function RecommendationTabs({selected,setSelected}){

const tabs = [
"All Recommendations",
"Additional Coverage",
"High Priority",
"Cost Savings",
"Coverage Upgrades"
]

return(

<div className="tabs">

{tabs.map((tab,index)=>(
<button
key={index}
className={selected===index?"active":""}
onClick={()=>setSelected(index)}
>
{tab}
</button>
))}

</div>

)

}

export default RecommendationTabs