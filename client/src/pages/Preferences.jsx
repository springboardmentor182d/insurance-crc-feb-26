import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Users, Heart, Shield, Activity, GraduationCap
} from "lucide-react";

function Preferences() {

  const navigate = useNavigate();

  const [selectedFor, setSelectedFor] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [budget, setBudget] = useState("");
  const [riskLevel, setRiskLevel] = useState("medium");

  const [income, setIncome] = useState("");
  const [medicalCondition, setMedicalCondition] = useState("");

  const [aiPlan, setAiPlan] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const userId = localStorage.getItem("userId") || 1;

  // =========================
  // SAVE PREFERENCES
  // =========================
  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://13.61.5.205:8000/preferences/save/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            income: Number(income),
            risk_level: riskLevel,
            insurance_type: selectedType || "health"
          }),
        }
      );

      const data = await res.json();

      if (data.error) throw new Error();

      alert("Saved ✅");

      navigate("/profile");

    } catch {
      alert("Save failed ❌");
    }
  };

  // =========================
  // GENERATE AI PLAN
  // =========================
  const generateAIPlan = async () => {
    try {
      setLoadingAI(true);

      const res = await fetch(
        "http://13.61.5.205:8000/ai/recommendation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            income: Number(income),
            risk_level: riskLevel,
            insurance_type: selectedType || "health",
            policy_for: selectedFor,
            medical_condition: medicalCondition,
            budget
          })
        }
      );

      const data = await res.json();

      console.log("AI RESPONSE:", data);

      setAiPlan(data);

    } catch (err) {
      console.error("AI ERROR:", err);
      alert("AI failed ❌");
    } finally {
      setLoadingAI(false);
    }
  };

  // =========================
  // CARD COMPONENT
  // =========================
  const Card = ({ label, icon, value, selected, onClick }) => (
    <div
      onClick={() => onClick(value)}
      className={`flex items-center gap-3 border p-4 rounded-xl cursor-pointer 
      transition-all duration-300 transform
      ${selected === value
        ? "bg-green-100 border-green-600 scale-105 shadow-md"
        : "hover:border-green-500 hover:scale-105 hover:shadow-md"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-10">

      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">

        {/* LEFT SECTION */}
        <div className="col-span-2 space-y-6">

          <h2 className="text-3xl font-bold">
            Tell Us Your Insurance Preferences
          </h2>

          {/* POLICY FOR */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="mb-4 font-semibold">Who is this policy for?</h3>

            <div className="grid grid-cols-3 gap-4">
              <Card label="Myself" icon={<User />} value="myself"
                selected={selectedFor} onClick={setSelectedFor} />

              <Card label="Spouse" icon={<Heart />} value="spouse"
                selected={selectedFor} onClick={setSelectedFor} />

              <Card label="Parents" icon={<Users />} value="parents"
                selected={selectedFor} onClick={setSelectedFor} />

              <Card label="Whole Family" icon={<Users />} value="family"
                selected={selectedFor} onClick={setSelectedFor} />
            </div>
          </div>

          {/* INSURANCE TYPE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="mb-4 font-semibold">What type of insurance?</h3>

            <div className="grid grid-cols-3 gap-4">
              <Card label="Health Insurance" icon={<Activity />} value="health"
                selected={selectedType} onClick={setSelectedType} />

              <Card label="Life Insurance" icon={<Shield />} value="life"
                selected={selectedType} onClick={setSelectedType} />

              <Card label="Term Plan" icon={<Shield />} value="term"
                selected={selectedType} onClick={setSelectedType} />

              <Card label="Child Education" icon={<GraduationCap />} value="education"
                selected={selectedType} onClick={setSelectedType} />
            </div>
          </div>

          {/* BUDGET */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="mb-4 font-semibold">Budget Preference</h3>

            <div className="flex gap-4">
              {["low", "medium", "high"].map(b => (
                <button key={b}
                  onClick={() => setBudget(b)}
                  className={`px-6 py-2 border rounded-lg transition
                  ${budget === b ? "bg-green-600 text-white" : "hover:bg-green-100"}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* INCOME */}
          <div className="bg-white p-6 rounded-xl shadow">
            <input
              type="number"
              placeholder="Annual Income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* MEDICAL */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="mb-2 font-semibold">Medical Condition</h3>
            <textarea
              placeholder="Any existing conditions..."
              value={medicalCondition}
              onChange={(e) => setMedicalCondition(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* RISK */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="mb-4 font-semibold">Risk Comfort Level</h3>

            <div className="flex gap-4">
              {["low", "medium", "high"].map(r => (
                <button key={r}
                  onClick={() => setRiskLevel(r)}
                  className={`px-6 py-2 border rounded-lg transition
                  ${riskLevel === r ? "bg-green-600 text-white" : "hover:bg-green-100"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={generateAIPlan}
              className="flex-1 bg-green-700 text-white py-3 rounded-lg hover:bg-green-800"
            >
              {loadingAI ? "Generating..." : "Generate My Customized Plan"}
            </button>

            <button
              onClick={handleSave}
              className="px-6 border rounded-lg hover:bg-gray-200"
            >
              Save Preferences
            </button>
          </div>

          {/* AI RESULT */}
          {aiPlan && (
  <div className="mt-4 bg-green-100 p-4 rounded-xl border border-green-400">
    
    <h3 className="font-bold text-lg mb-2">
      AI Recommended Plan
    </h3>

    <p><b>Plan:</b> {aiPlan.plan}</p>
    <p><b>Provider:</b> {aiPlan.provider}</p>
    <p>
      <b>Coverage:</b> ₹
      {aiPlan.coverage ? aiPlan.coverage.toLocaleString() : "N/A"}
    </p>
    <p><b>Match Score:</b> {aiPlan.match_score}%</p>

  </div>
)}

        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <h3 className="font-semibold mb-4">Selection Summary</h3>

          <p>Policy For: {selectedFor || "Not selected"}</p>
          <p>Insurance Type: {selectedType || "Not selected"}</p>
          <p>Budget: {budget || "Not selected"}</p>
          <p>Risk Level: {riskLevel}</p>
        </div>

      </div>
    </div>
  );
}

export default Preferences;