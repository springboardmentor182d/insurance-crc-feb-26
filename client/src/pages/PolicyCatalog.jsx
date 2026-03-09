import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PolicyCatalog.css";

function PolicyCatalog() {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/policies")
      .then(res => setPolicies(res.data.policies))
      .catch(err => console.error("Error fetching policies:", err));
  }, []);

  return (
    <div className="policy-catalog">
      <h2>Policy Catalog</h2>
      {policies.length === 0 ? (
        <p>Loading policies...</p>
      ) : (
        <div className="policy-list">
          {policies.map(p => (
            <div className="card" key={p.id}>
              <h5>{p.name}</h5>
              <p><strong>Provider:</strong> {p.provider}</p>
              <p><strong>Coverage:</strong> {p.coverage}</p>
              <p><strong>Premium:</strong> {p.premium}</p>
              <ul>
                {p.features.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PolicyCatalog;
