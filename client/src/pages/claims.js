import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./claims.css";
import Sidebar from "../layout/user/Sidebar";
import apiClient from "../utils/apiClient";

const formatPolicyType = (value) => {
  if (!value) return "-";
  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadClaims = async () => {
      try {
        const response = await apiClient.get("/claims", {
          params: {
            ...(status ? { status } : {}),
            ...(search ? { search } : {}),
          },
        });

        setClaims(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        setClaims([]);
      }
    };

    loadClaims();
  }, [status, search]);

  const total = claims.length;
  const pending = claims.filter((claim) => claim.status === "IN_REVIEW").length;
  const approved = claims.filter((claim) => claim.status === "APPROVED").length;
  const paid = claims.filter((claim) => claim.status === "PAID").length;

  const statusMap = {
    IN_REVIEW: "In Review",
    APPROVED: "Approved",
    PAID: "Paid",
    REJECTED: "Rejected",
    FRAUDULENT: "Rejected",
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 overflow-y-auto claims-page">
        <div className="header">
          <div>
            <h1>Claims Management</h1>
            <p>Track and manage your insurance claims</p>
          </div>

          <button className="btn" onClick={() => navigate("/claims/new")}>
            + File New Claim
          </button>
        </div>

        {location.state?.message && (
          <div className="flash-message">{location.state.message}</div>
        )}

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

        <div className="search-box">
          <input
            placeholder="Search claims..."
            onChange={(event) => setSearch(event.target.value)}
          />

          <select onChange={(event) => setStatus(event.target.value)}>
            <option value="">All Status</option>
            <option value="in_review">In Review</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

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
              {claims.map((claim) => (
                <tr
                  key={claim.id}
                  onClick={() => navigate(`/claims/${claim.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    {claim.claim_number}
                    <div className="sub">{claim.policy?.policy_number || "-"}</div>
                  </td>

                  <td>
                    <span className="badge gray">
                      {formatPolicyType(claim.policy?.policy_type)}
                    </span>
                  </td>

                  <td>
                    <div>{claim.description || "-"}</div>
                    {claim.admin_message && claim.status !== "IN_REVIEW" && (
                      <div className="decision-note">{claim.admin_message}</div>
                    )}
                  </td>

                  <td>
                    {claim.submitted_at
                      ? new Date(claim.submitted_at).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>${claim.claim_amount || 0}</td>

                  <td>
                    <span className={`status ${claim.status.toLowerCase()}`}>
                      {statusMap[claim.status] || claim.status}
                    </span>
                  </td>

                  <td>
                    {claim.processed_at
                      ? new Date(claim.processed_at).toLocaleDateString()
                      : "-"}
                  </td>

                  <td
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/claims/${claim.id}`);
                    }}
                  >
                    View
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
