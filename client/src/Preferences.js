import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Heart,
  Users,
  Shield,
  Briefcase,
  GraduationCap,
  Activity,
} from "lucide-react";

function Preferences() {
  /* eslint-disable no-unused-vars */

  const navigate = useNavigate();

  const [selectedFor, setSelectedFor] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [budget, setBudget] = useState("");
  const [riskLevel, setRiskLevel] = useState("medium");
  const [income, setIncome] = useState("");
  const [existingPolicy, setExistingPolicy] = useState("no");
  const [medical, setMedical] = useState("");

  /* ✅ AI RESULT STATE */
  const [aiPlan, setAiPlan] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    fetch("http://localhost:8000/users/1")
      .then((res) => res.json())
      .then((data) => {
        setRiskLevel(data.risk_level || "medium");
        setIncome(data.income || "");
      });
  }, []);

  /* ================= SAVE ================= */
 const handleSave = async () => {
  try {

    const res = await fetch(
      `http://127.0.0.1:8000/users/1/preferences?income=${income}&risk_level=medium`,
      {
        method: "PUT",
      }
    );

    if (!res.ok) {
      throw new Error("Backend error");
    }

    alert("Preferences Saved ✅");
    navigate("/profile");

  } catch (error) {
    console.error("SAVE ERROR:", error);
    alert("Backend not reachable ❌");
  }
};

  /* ================= AI GENERATE ================= */
const generateAIPlan = async () => {
  try {
    setLoadingAI(true);

    const response = await fetch(
      "http://127.0.0.1:8000/ai/recommendation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          selectedFor,
          selectedType,
          riskLevel,
          income: Number(income)
        })
      }
    );

    const result = await response.json();

    console.log("AI RESPONSE 👉", result);   // ⭐ IMPORTANT

    setAiPlan({
      plan: result.plan,
      strategy: result.strategy,
      suggested_coverage: result.suggested_coverage
    });

  } catch (err) {
    console.error("AI ERROR:", err);
  } finally {
    setLoadingAI(false);
  }
};
  /* ================= OPTION CARD ================= */
  const OptionCard = ({ label, icon, selected, onClick }) => (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 border rounded-xl p-4 cursor-pointer
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-1
        ${
          selected
            ? "bg-green-100 border-green-600 shadow-md"
            : "hover:border-green-500"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ================= LEFT FORM ================= */}
        <div className="lg:col-span-2 space-y-8 overflow-y-auto">

          <div>
            <h2 className="text-3xl font-bold">
              Tell Us Your Insurance Preferences
            </h2>
            <p className="text-gray-500 text-sm">
              Customize recommendations based on your needs
            </p>
          </div>

          {/* POLICY FOR */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <h3 className="font-semibold mb-4">Who is this policy for?</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <OptionCard label="Myself" icon={<User size={18}/>}
                selected={selectedFor==="myself"}
                onClick={()=>setSelectedFor("myself")}
              />
              <OptionCard label="Spouse" icon={<Heart size={18}/>}
                selected={selectedFor==="spouse"}
                onClick={()=>setSelectedFor("spouse")}
              />
              <OptionCard label="Parents" icon={<Users size={18}/>}
                selected={selectedFor==="parents"}
                onClick={()=>setSelectedFor("parents")}
              />
              <OptionCard label="Whole Family" icon={<Shield size={18}/>}
                selected={selectedFor==="family"}
                onClick={()=>setSelectedFor("family")}
              />
            </div>
          </div>

          {/* INSURANCE TYPE */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <h3 className="font-semibold mb-4">What type of insurance?</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <OptionCard label="Health Insurance"
                icon={<Activity size={18}/>}
                selected={selectedType==="health"}
                onClick={()=>setSelectedType("health")}
              />
              <OptionCard label="Life Insurance"
                icon={<Shield size={18}/>}
                selected={selectedType==="life"}
                onClick={()=>setSelectedType("life")}
              />
              <OptionCard label="Term Plan"
                icon={<Briefcase size={18}/>}
                selected={selectedType==="term"}
                onClick={()=>setSelectedType("term")}
              />
              <OptionCard label="Child Education"
                icon={<GraduationCap size={18}/>}
                selected={selectedType==="education"}
                onClick={()=>setSelectedType("education")}
              />
            </div>
          </div>

          {/* BUDGET */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <h3 className="font-semibold mb-4">Budget Preference</h3>

            <div className="flex gap-4">
              {["low","medium","high"].map((b)=>(
                <button
                  key={b}
                  onClick={()=>setBudget(b)}
                  className={`px-5 py-2 rounded-lg border transition
                  ${budget===b
                    ? "bg-green-600 text-white"
                    : "hover:border-green-500"}`}
                >
                  {b.charAt(0).toUpperCase()+b.slice(1)} Budget
                </button>
              ))}
            </div>
          </div>

          {/* RISK */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <h3 className="font-semibold mb-4">Risk Comfort Level</h3>

            <div className="flex gap-4">
              {["low","medium","high"].map((r)=>(
                <button
                  key={r}
                  onClick={()=>setRiskLevel(r)}
                  className={`px-5 py-2 rounded-lg border
                  ${riskLevel===r
                    ? "bg-green-600 text-white"
                    : "hover:border-green-500"}`}
                >
                  {r.toUpperCase()} Risk
                </button>
              ))}
            </div>
          </div>

          {/* ADDITIONAL */}
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h3 className="font-semibold">Additional Information</h3>

            <input
              type="number"
              value={income}
              onChange={(e)=>setIncome(e.target.value)}
              placeholder="Annual Income"
              className="w-full p-3 border rounded-lg"
            />

            <textarea
              value={medical}
              onChange={(e)=>setMedical(e.target.value)}
              placeholder="Medical Conditions"
              rows="3"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* ✅ BUTTONS */}
          <div className="flex gap-4">

            <button
              onClick={generateAIPlan}
              className="flex-1 bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition"
            >
              {loadingAI ? "Generating AI Plan..." :
              "Generate My Customized Plan"}
            </button>

            <button
              onClick={handleSave}
              className="px-6 border rounded-lg hover:bg-gray-100"
            >
              Save Preferences
            </button>
          </div>

          {/* ✅ AI RESULT CARD */}
          {aiPlan && (
            <div className="bg-green-50 border border-green-300 p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-2">
                🤖 AI Recommended Plan
              </h3>

              <p><b>Plan:</b> {aiPlan.plan}</p>
              <p><b>Strategy:</b> {aiPlan.strategy}</p>
              <p>
                <b>Suggested Coverage:</b>
                ₹{aiPlan.suggested_coverage?.toLocaleString()}
              </p>

              <p className="text-sm text-gray-600 mt-2">
                {aiPlan.message}
              </p>
            </div>
          )}

        </div>

        {/* ================= STICKY SUMMARY ================= */}
        <div className="hidden lg:block">
          <div className="sticky top-10">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-4">
                Selection Summary
              </h3>

              <p>Policy For: {selectedFor || "Not selected"}</p>
              <p>Insurance Type: {selectedType || "Not selected"}</p>
              <p>Budget: {budget || "Not selected"}</p>
              <p className="capitalize">Risk Level: {riskLevel}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Preferences;