import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../layout/Sidebar";

const API = "http://127.0.0.1:8000/claims";

export default function ClaimDetails() {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);

  useEffect(() => {
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => setClaim(data));
  }, [id]);

  if (!claim) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            Claim {claim.claim_number}
          </h1>
          <p className="text-gray-500">
            Filed on {claim.submitted_at?.slice(0, 10)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="col-span-2 space-y-6">

            {/* OVERVIEW */}
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-semibold mb-4">Claim Overview</h2>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><b>Policy:</b> AUTO-12345</p>
                <p><b>Type:</b> Auto</p>
                <p><b>Amount:</b> ${claim.claim_amount}</p>
                <p><b>Status:</b> {claim.status}</p>
              </div>

              <p className="mt-4 text-gray-600">
                {claim.description}
              </p>
            </div>

            {/* TIMELINE */}
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-semibold mb-4">Claim Timeline</h2>

              <TimelineItem
                title="Claim Filed"
                date={claim.submitted_at}
              />
              <TimelineItem
                title="Documents Verified"
                date={claim.submitted_at}
              />
              <TimelineItem
                title="Under Review"
                date={claim.processed_at || claim.submitted_at}
              />
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* FRAUD */}
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold">Fraud Score</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {claim.fraud_score || 0}%
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

const TimelineItem = ({ title, date }) => (
  <div className="flex gap-3 mb-3">
    <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-xs text-gray-400">
        {date?.slice(0, 10)}
      </p>
    </div>
  </div>
);