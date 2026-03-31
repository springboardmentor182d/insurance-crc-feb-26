import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000/api/v1/claims";

export default function NewClaim() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    policy_id: "",
    date: "",
    time: "",
    amount: "",
    location: "",
    description: "",
    report_number: "",
    witnesses: "",
    additional: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policy_id: Number(form.policy_id),
          claim_amount: Number(form.amount),
          description: form.description,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      alert("✅ Claim Submitted!");
      navigate("/claims");
    } catch (err) {
      alert("❌ Submission Failed");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-1">File New Claim</h1>
        <p className="text-gray-500 mb-6">
          Complete the form below to submit your claim
        </p>

        {/* STEPPER */}
        <div className="bg-white p-6 rounded-xl border mb-6 flex items-center justify-between">
          
          {/* STEP 1 */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
              1
            </div>
            <span className="text-sm">Claim Details</span>
          </div>

          <div className="flex-1 h-[2px] bg-gray-300 mx-4"></div>

          {/* STEP 2 */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
              2
            </div>
            <span className="text-sm">Incident Information</span>
          </div>

          <div className="flex-1 h-[2px] bg-gray-300 mx-4"></div>

          {/* STEP 3 */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
              3
            </div>
            <span className="text-sm">Documents & Review</span>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold mb-4">Claim Details</h3>

            <label className="block mb-2">Select Policy *</label>
            <select
              name="policy_id"
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
            >
              <option value="">Choose a policy</option>
              <option value="1">Auto Policy</option>
              <option value="2">Home Policy</option>
            </select>

            <label className="block mb-2">Incident Date *</label>
            <input
              type="date"
              name="date"
              className="w-full border p-3 rounded mb-4"
              onChange={handleChange}
            />

            <label className="block mb-2">Incident Time</label>
            <input
              type="time"
              name="time"
              className="w-full border p-3 rounded mb-4"
              onChange={handleChange}
            />

            <label className="block mb-2">Estimated Claim Amount *</label>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              className="w-full border p-3 rounded mb-4"
              onChange={handleChange}
            />

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold mb-4">Incident Information</h3>

            <label className="block mb-2">Incident Location *</label>
            <input
              name="location"
              placeholder="Street address, city, state"
              className="w-full border p-3 rounded mb-4"
              onChange={handleChange}
            />

            <label className="block mb-2">Description of Incident *</label>
            <textarea
              name="description"
              placeholder="Please provide details..."
              className="w-full border p-3 rounded mb-4"
              onChange={handleChange}
            />

            <label className="block mb-2">
              <input type="checkbox" className="mr-2" />
              Police report filed for this incident
            </label>

            <label className="block mb-2">Police Report Number</label>
            <input
              name="report_number"
              className="w-full border p-3 rounded mb-4"
              onChange={handleChange}
            />

            <label className="block mb-2">Witnesses (if any)</label>
            <textarea
              name="witnesses"
              className="w-full border p-3 rounded mb-4"
              onChange={handleChange}
            />

            <label className="block mb-2">Additional Information</label>
            <textarea
              name="additional"
              className="w-full border p-3 rounded mb-4"
              onChange={handleChange}
            />

            <div className="flex justify-between">
              <button onClick={() => setStep(1)}>Previous</button>
              <button
                onClick={() => setStep(3)}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold mb-4">Documents & Review</h3>

            <p className="text-gray-500 mb-4">
              Review your claim before submitting
            </p>

            <pre className="bg-gray-100 p-4 rounded mb-4">
              {JSON.stringify(form, null, 2)}
            </pre>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)}>Previous</button>

              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded"
              >
                Submit Claim
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}