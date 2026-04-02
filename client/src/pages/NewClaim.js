import React, { useState } from "react";
import Sidebar from "../layout/user/Sidebar";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000/api/v1/claims/";

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

  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // FILE HANDLING
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // ✅ FINAL SUBMIT
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("policy_id", form.policy_id);
      formData.append("claim_amount", form.amount);
      formData.append("description", form.description || "");

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(API, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert("Submission Failed ❌");
        return;
      }

      // ✅ SUCCESS → navigate instead of warning
      alert("Claim Submitted Successfully ✅");
      navigate("/claims");

    } catch (error) {
      console.error(error);
      alert("Error submitting claim ❌");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-1">File New Claim</h1>
        <p className="text-gray-500 mb-6">
          Complete the form below to submit your claim
        </p>

        {/* STEPPER */}
        <div className="bg-white p-6 rounded-xl border mb-6 flex items-center">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
              1
            </div>
            <span>Claim Details</span>
          </div>

          <div className="flex-1 h-[2px] bg-gray-300 mx-4"></div>

          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
              2
            </div>
            <span>Incident Information</span>
          </div>

          <div className="flex-1 h-[2px] bg-gray-300 mx-4"></div>

          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
              3
            </div>
            <span>Documents & Review</span>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold mb-4">Claim Details</h3>

            <label>Select Policy *</label>
            <select
              name="policy_id"
              value={form.policy_id}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
              required
            >
              <option value="">Choose</option>
              <option value="1">Auto</option>
              <option value="2">Home</option>
            </select>

            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
            />

            <label>Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
            />

            <label>Amount *</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
              required
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

            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
            />

            <textarea
              name="additional"
              placeholder="Additional Info"
              value={form.additional}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
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

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed p-10 text-center mb-6 rounded-lg bg-gray-50"
            >
              Drag & Drop or
              <label className="text-blue-600 cursor-pointer ml-2">
                Choose Files
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {files.map((file, i) => (
              <div key={i} className="flex justify-between bg-gray-100 p-2 mb-2 rounded">
                <span>{file.name}</span>
                <button onClick={() => handleRemove(i)}>Remove</button>
              </div>
            ))}

            <div className="bg-gray-50 p-4 rounded mb-4">
              <p>Policy: {form.policy_id}</p>
              <p>Amount: {form.amount}</p>
              <p>Description: {form.description}</p>
            </div>

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