import React, { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar";
import PolicyCard from "../components/PolicyCard";
import "../styles/styles.css";
import { FaFilter } from "react-icons/fa";

function PolicyCatalogPage() {
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [provider, setProvider] = useState("");
  const [range, setRange] = useState("");
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/policy/")
      .then(res => res.json())
      .then(data => setPolicies(data));
  }, []);

  const filtered = policies
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => (category ? p.category === category : true))
    .filter(p => (provider ? p.company === provider : true))
    .filter(p => {
      if (!range) return true;
      if (range === "low") return p.price < 200;
      if (range === "mid") return p.price >= 200 && p.price <= 500;
      if (range === "high") return p.price > 500;
      return true;
    });

  return (
    <div className="layout">

      <Sidebar />

      <div className="main">
        <h1>Policy Catalog</h1>
        <p className="sub-text">
          Browse and compare insurance policies from trusted providers
        </p>

        {/* SEARCH + FILTER BOX */}
        <div className="search-container">

          {/* SEARCH */}
          <input
            className="search-box"
            placeholder="Search by policy name or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* FILTER ROW */}
          <div style={{
            display: "flex",
            gap: "15px",
            marginTop: "15px",
            alignItems: "center",
            flexWrap: "wrap"
          }}>

            {/* POLICY TYPE */}
            <div>
              <p style={{ fontSize: "12px" }}>Policy Type</p>
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Types</option>
                <option value="Health">Health</option>
                <option value="Life">Life</option>
                <option value="Vehicle">Vehicle</option>
              </select>
            </div>

            {/* PROVIDER */}
            <div>
              <p style={{ fontSize: "12px" }}>Provider</p>
              <select onChange={(e) => setProvider(e.target.value)}>
                <option value="">All Providers</option>
                <option value="HealthGuard">HealthGuard</option>
                <option value="LifeSecure">LifeSecure</option>
              </select>
            </div>

            {/* PREMIUM */}
            <div>
              <p style={{ fontSize: "12px" }}>Premium Range</p>
              <select onChange={(e) => setRange(e.target.value)}>
                <option value="">All Ranges</option>
                <option value="low">Below ₹200</option>
                <option value="mid">₹200 - ₹500</option>
                <option value="high">Above ₹500</option>
              </select>
            </div>

            {/* MORE FILTER BUTTON */}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "10px 15px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                background: "white",
                cursor: "pointer",
                marginTop: "15px"
              }}
            >
              <FaFilter /> More Filters
            </button>

          </div>

          {/* COMPARE BUTTON */}
          {compareList.length > 0 && (
            <button
              style={{
                marginTop: "15px",
                padding: "10px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px"
              }}
            >
              Compare Selected ({compareList.length})
            </button>
          )}

        </div>

        {/* GRID */}
        <div className="grid">
          {filtered.map(p => (
            <PolicyCard
              key={p.id}
              policy={p}
              compareList={compareList}
              setCompareList={setCompareList}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PolicyCatalogPage;