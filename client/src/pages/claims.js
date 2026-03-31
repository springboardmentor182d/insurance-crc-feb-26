import React, { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000/claims";

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API)
.then(res => res.json())
    .then(data => setClaims(Array.isArray(data) ? data : []))
    .catch(() => setClaims([]));

  }, []);

  // FILTER + SEARCH
  const filteredClaims = claims.filter((c) => {
    const matchesFilter =
      filter === "all" || c.status === filter;

    const matchesSearch =
      c.claim_number?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // COUNTS
  const total = claims.length;
  const inReview = claims.filter(c => c.status === "pending").length;
  const approved = claims.filter(c => c.status === "approved").length;
  const paid = claims.filter(c => c.status === "paid").length;

  // STATUS STYLE
  const statusUI = (status) => {
    if (status === "pending")
      return "bg-yellow-100 text-yellow-700";
    if (status === "approved")
      return "bg-green-100 text-green-700";
    if (status === "paid")
      return "bg-blue-100 text-blue-700";
    return "bg-gray-100";
  };

  const statusLabel = (status) => {
    if (status === "pending") return "In Review";
    if (status === "approved") return "Approved";
    if (status === "paid") return "Paid";
    return status;
  };

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">
              Claims Management
            </h1>
            <p className="text-gray-500">
              Track and manage your insurance claims
            </p>
          </div>

          <button
            onClick={() => navigate("/claims/new")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + File New Claim
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card title="Total Claims" value={total} color="text-blue-600" />
          <Card title="In Review" value={inReview} color="text-yellow-600" />
          <Card title="Approved" value={approved} color="text-green-600" />
          <Card title="Paid" value={paid} color="text-blue-500" />
        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-white p-4 rounded-xl border mb-4 flex items-center gap-4">
          <input
            placeholder="🔍 Search claims..."
            className="flex-1 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-3 py-2 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">In Review</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">

            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4 text-left">Claim ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Date Filed</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredClaims.map((c) => (
                <tr
                  key={c.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <div className="font-medium">
                      {c.claim_number}
                    </div>
                    <div className="text-xs text-gray-400">
                      AUTO-12345
                    </div>
                  </td>

                  <td>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      Auto
                    </span>
                  </td>

                  <td>{c.description}</td>

                  <td>{c.submitted_at?.slice(0, 10)}</td>

                  <td className="font-medium">
                    ${c.claim_amount}
                  </td>

                  <td>
                    <span className={`px-3 py-1 rounded-full text-sm ${statusUI(c.status)}`}>
                      {statusLabel(c.status)}
                    </span>
                  </td>

                  {/* 🔥 BLUE ARROW */}
                  <td>
                    <button
                      onClick={() => navigate(`/claims/${c.id}`)}
                      className="text-blue-600 text-xl hover:translate-x-1 transition"
                    >
                      →
                    </button>
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

const Card = ({ title, value, color }) => (
  <div className="bg-white p-5 rounded-xl border">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className={`text-xl font-semibold mt-1 ${color}`}>
      {value}
    </h2>
  </div>
);