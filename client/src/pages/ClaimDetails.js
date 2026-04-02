import React, { useEffect, useState } from "react";
import Sidebar from "../layout/user/Sidebar";
import { useParams, useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000/api/v1/claims";

export default function ClaimDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);

  useEffect(() => {
    fetch(`${API}/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("DB DATA:", data); // 🔥 debug
        setClaim(data);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!claim) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 overflow-y-auto">

        {/* HEADER */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/claims")}
            className="text-blue-600 mb-2"
          >
            ← Back to Claims
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                Claim {claim.claim_number || claim.id}
              </h1>
              <p className="text-gray-500">
                Filed on{" "}
                {claim.submitted_at
                  ? new Date(claim.submitted_at).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            {/* STATUS */}
            <span
              className={`px-4 py-2 rounded-full ${
                claim.status === "APPROVED"
                  ? "bg-green-100 text-green-600"
                  : claim.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {claim.status}
            </span>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="col-span-2 space-y-6">

            {/* CLAIM OVERVIEW */}
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Claim Overview</h3>

              <div className="grid grid-cols-2 gap-4">
                <p><b>Policy Number:</b> {claim.policy_number || "-"}</p>
                <p><b>Claim Type:</b> {claim.policy_type || "-"}</p>

                <p className="text-blue-600 font-bold text-lg">
                  ${claim.claim_amount || 0}
                </p>

                <p><b>Deductible:</b> ${claim.deductible || "-"}</p>
              </div>

              <hr className="my-4" />

              <h4 className="font-semibold mb-2">Incident Details</h4>

              <p>
                📅 {claim.incident_date || "-"}
              </p>

              <p>
                📍 {claim.location || "Not available"}
              </p>

              <p>
                📄 {claim.report_number || "-"}
              </p>

              <p className="mt-4">
                <b>Description:</b> {claim.description || "-"}
              </p>
            </div>

            {/* TIMELINE (Dynamic basic version) */}
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Claim Timeline</h3>

              <div className="space-y-4">

                <div>
                  <p className="font-semibold">Claim Filed</p>
                  <p className="text-gray-500 text-sm">
                    {claim.submitted_at
                      ? new Date(claim.submitted_at).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Status</p>
                  <p className="text-gray-500 text-sm">
                    {claim.status}
                  </p>
                </div>

                {claim.processed_at && (
                  <div>
                    <p className="font-semibold">Processed</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(claim.processed_at).toLocaleDateString()}
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* DOCUMENTS (if available in DB) */}
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Supporting Documents</h3>

              {claim.documents && claim.documents.length > 0 ? (
                claim.documents.map((doc, i) => (
                  <div key={i} className="flex justify-between bg-gray-100 p-3 rounded mb-2">
                    <span>{doc.name}</span>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600"
                    >
                      Download
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No documents available</p>
              )}
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* ADJUSTER */}
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Assigned Adjuster</h3>

              {claim.adjuster ? (
                <>
                  <p className="font-semibold">{claim.adjuster.name}</p>
                  <p className="text-gray-500">{claim.adjuster.email}</p>
                  <p>{claim.adjuster.phone}</p>
                </>
              ) : (
                <p className="text-gray-500">Not assigned</p>
              )}
            </div>

            {/* FRAUD */}
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Fraud Detection</h3>

              {claim.fraud_score !== undefined ? (
                <>
                  <p className="text-green-600 font-bold text-lg">
                    {claim.fraud_score}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {claim.fraud_message || "No fraud indicators"}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">No data</p>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}