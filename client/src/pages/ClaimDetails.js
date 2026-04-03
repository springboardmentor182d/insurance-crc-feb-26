import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../layout/user/Sidebar";
import apiClient from "../utils/apiClient";

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const formatPolicyType = (value) => {
  if (!value) return "-";
  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusBadgeClass = (status) => {
  if (status === "APPROVED") return "bg-green-100 text-green-700";
  if (status === "IN_REVIEW") return "bg-yellow-100 text-yellow-700";
  if (status === "PAID") return "bg-blue-100 text-blue-700";
  return "bg-red-100 text-red-700";
};

export default function ClaimDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClaim = async () => {
      try {
        setError("");
        const response = await apiClient.get(`/claims/${id}`);
        setClaim(response.data);
      } catch (requestError) {
        console.error(requestError);
        setError("Unable to load claim details.");
      }
    };

    loadClaim();
  }, [id]);

  const statusLabel = useMemo(() => {
    if (!claim?.status) return "-";
    return claim.status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }, [claim?.status]);

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <p>Loading claim details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="mb-6">
          <button onClick={() => navigate("/claims")} className="text-blue-600 mb-2">
            Back to Claims
          </button>

          <div className="flex justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Claim {claim.claim_number || claim.id}</h1>
              <p className="text-gray-500">
                Filed on {claim.submitted_at ? new Date(claim.submitted_at).toLocaleDateString() : "-"}
              </p>
            </div>

            <span className={`px-4 py-2 rounded-full font-medium ${getStatusBadgeClass(claim.status)}`}>
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Claim Overview</h3>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <p><b>Policy Number:</b> {claim.policy_number || "-"}</p>
                <p><b>Claim Type:</b> {formatPolicyType(claim.policy_type)}</p>
                <p className="text-blue-600 font-bold text-lg">{formatCurrency(claim.claim_amount)}</p>
                <p><b>Deductible:</b> {claim.deductible ? formatCurrency(claim.deductible) : "-"}</p>
              </div>

              <hr className="my-4" />

              <h4 className="font-semibold mb-2">Incident Details</h4>
              <p>{claim.incident_date ? new Date(claim.incident_date).toLocaleDateString() : "-"}</p>
              <p>{claim.location || "Not available"}</p>
              <p>{claim.report_number || "-"}</p>

              <p className="mt-4 whitespace-pre-line">
                <b>Description:</b> {claim.description || "-"}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Claim Timeline</h3>

              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="font-semibold">Claim Filed</p>
                  <p className="text-gray-500">
                    {claim.submitted_at ? new Date(claim.submitted_at).toLocaleDateString() : "-"}
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Status</p>
                  <p className="text-gray-500">{statusLabel}</p>
                </div>

                {claim.processed_at && (
                  <div>
                    <p className="font-semibold">Processed</p>
                    <p className="text-gray-500">
                      {new Date(claim.processed_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Supporting Documents</h3>

              {claim.documents && claim.documents.length > 0 ? (
                claim.documents.map((document, index) => (
                  <div key={index} className="flex justify-between bg-gray-100 p-3 rounded mb-2">
                    <span>{document.name}</span>
                    <a href={document.url} target="_blank" rel="noreferrer" className="text-blue-600">
                      Download
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No documents available</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Admin Decision</h3>
              <p className="text-sm font-medium text-gray-900">{claim.admin_message}</p>
              {claim.review_notes && claim.review_notes !== claim.admin_message && (
                <p className="mt-3 text-sm text-gray-600 whitespace-pre-line">{claim.review_notes}</p>
              )}
            </div>

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

            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Fraud Detection</h3>

              {claim.fraud_score !== undefined ? (
                <>
                  <p className="text-green-600 font-bold text-lg">{claim.fraud_score}%</p>
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
