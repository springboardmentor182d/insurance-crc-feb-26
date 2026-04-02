import React, { useEffect, useState } from "react";
import "./claims.css";
import Sidebar from "../layout/user/Sidebar";
import { useNavigate } from "react-router-dom";

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [status, setStatus] = useState("");   // ✅ filter
  const [search, setSearch] = useState("");   // ✅ search

  const navigate = useNavigate();

  // ✅ API CALL (FILTER + SEARCH)
  useEffect(() => {
    let url = "http://localhost:8000/api/v1/claims";

    const params = [];

    if (status) params.push(`status=${status}`);
    if (search) params.push(`search=${search}`);

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setClaims(data))
      .catch(err => console.error(err));

  }, [status, search]);

  // ✅ STATS (FIXED)
  const total = claims.length;
  const pending = claims.filter(c => c.status === "IN_REVIEW").length;
  const approved = claims.filter(c => c.status === "APPROVED").length;
  const paid = claims.filter(c => c.status === "PAID").length;

  // ✅ STATUS LABEL
  const statusMap = {
    IN_REVIEW: "In Review",
    APPROVED: "Approved",
    PAID: "Paid",
    REJECTED: "Rejected",
    FRAUDULENT: "Rejected"
  };

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 ml-64 overflow-y-auto claims-page">

        {/* HEADER */}
        <div className="header">
          <div>
            <h1>Claims Management</h1>
            <p>Track and manage your insurance claims</p>
          </div>

          <button
            className="btn"
            onClick={() => navigate("/claims/new")}
          >
            + File New Claim
          </button>
        </div>

        {/* CARDS */}
        <div className="cards">
          <div className="card">
            <p>Total Claims</p>
            <h2 className="blue">{total}</h2>
          </div>

          <div className="card">
            <p>In Review</p>
            <h2 className="orange">{pending}</h2>
          </div>

          <div className="card">
            <p>Approved</p>
            <h2 className="green">{approved}</h2>
          </div>

          <div className="card">
            <p>Paid</p>
            <h2 className="blue">{paid}</h2>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="search-box">
          <input
            placeholder="Search claims..."
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="in_review">In Review</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Date Filed</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Last Update</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {claims.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/claims/${c.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Claim ID */}
                  <td>
                    {c.claim_number}
                    <div className="sub">
                      {c.policy?.policy_number || "-"}
                    </div>
                  </td>

                  {/* TYPE */}
                  <td>
                    <span className="badge gray">
                      {c.policy?.policy_type || "-"}
                    </span>
                  </td>

                  {/* DESCRIPTION */}
                  <td>{c.description || "-"}</td>

                  {/* DATE */}
                  <td>
                    {c.submitted_at
                      ? new Date(c.submitted_at).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* AMOUNT */}
                  <td>${c.claim_amount || 0}</td>

                  {/* STATUS */}
                  <td>
                    <span className={`status ${c.status.toLowerCase()}`}>
                      {statusMap[c.status] || c.status}
                    </span>
                  </td>

                  {/* LAST UPDATE */}
                  <td>
                    {c.processed_at
                      ? new Date(c.processed_at).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* ARROW */}
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/claims/${c.id}`);
                    }}
                  >
                    ➡️
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}