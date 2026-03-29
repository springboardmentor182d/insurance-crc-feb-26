import React, { useEffect, useState } from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function Policies() {
  const [policies, setPolicies] = useState([]);
  const [selected, setSelected] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/policies/")
    fetch(`${BASE_URL}/policies/`)
      .then(res => res.json())
      .then(data => setPolicies(data));
  }, []);

  const toggleSelect = (index) => {
    setSelected(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const compareSelected = () => {
    fetch("http://localhost:8000/policies/compare", {
    fetch(`${BASE_URL}/policies/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected)
    })
      .then(res => res.json())
      .then(data => setComparison(data));
  };

  return (
    <div>
      <h2>Policy Catalog</h2>
      <div className="policy-grid">
        {policies.map((policy, index) => (
          <div key={index} className="policy-card">
          <h3>{policy.name} ({policy.provider})</h3>
          <p><strong>Coverage:</strong> {policy.coverage}</p>
          <p><strong>Premium:</strong> {policy.premium}</p>
          <ul>
            {policy.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
          <button onClick={() => toggleSelect(index)}>
            {selected.includes(index) ? "Unselect" : "Select"}
          </button>
          <button onClick={() => setSelectedPolicy(policy)}>Details</button>
        </div>
      ))}
    </div>


      <button onClick={compareSelected} disabled={selected.length < 2}>
        Compare Selected
      </button>

      {comparison.length > 0 && (
        <div className="comparison">
          <h2>Comparison</h2>
          <div style={{ display: "flex", gap: "20px" }}>
            {comparison.map((policy, i) => (
              <div key={i} className="policy-card">
                <h3>{policy.name}</h3>
                <p><strong>Provider:</strong> {policy.provider}</p>
                <p><strong>Coverage:</strong> {policy.coverage}</p>
                <p><strong>Premium:</strong> {policy.premium}</p>
                <ul>
                  {policy.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPolicy && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedPolicy(null)}>Close</button>
            <h2>{selectedPolicy.name}</h2>
            <p><strong>Provider:</strong> {selectedPolicy.provider}</p>
            <p><strong>Coverage:</strong> {selectedPolicy.coverage}</p>
            <p><strong>Premium:</strong> {selectedPolicy.premium}</p>
            <ul>
              {selectedPolicy.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Policies;
