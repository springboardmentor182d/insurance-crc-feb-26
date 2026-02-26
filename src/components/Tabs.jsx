import React from "react";

function Tabs() {
  return (
    <div className="tabs">
      <button className="active">All Recommendations</button>
      <button>High Priority</button>
      <button>Cost Savings</button>
      <button>Coverage Upgrades</button>
      <button>Additional Coverage</button>
    </div>
  );
}

export default Tabs;