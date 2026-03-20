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
import apiClient from "../utils/apiClient";

function Preferences() {
  const navigate = useNavigate();

  const [selectedFor, setSelectedFor] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [budget, setBudget] = useState("");
  const [riskLevel, setRiskLevel] = useState("medium");
  const [income, setIncome] = useState("");
  const [medical, setMedical] = useState("");

  const [aiPlan, setAiPlan] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const userId = localStorage.getItem("userId") || 1;

  /* ================= FETCH USER ================= */
  useEffect(() => {
    apiClient.get(`/admin/users/${userId}`)
      .then((res) => {
        const data = res.data;
        setRiskLevel(data.risk_level || "medium");
        setIncome(data.income || "");
      })
      .catch((err) => console.error("FETCH ERROR:", err));
  }, [userId]);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      await apiClient.put(
        `/admin/users/${userId}/preferences?income=${income}&risk_level=${riskLevel}`
      );

      alert("Preferences Saved ✅");
      navigate("/profile");

    } catch (error) {
      console.error("SAVE ERROR:", error);
      alert("Backend not reachable ❌");
    }
  };

  /* ================= AI ================= */
 const generateAIPlan = async () => {
  try {
    setLoadingAI(true);

    const response = await apiClient.post("/ai/recommendation", {
      selectedFor,
      selectedType,
      riskLevel,
      income: Number(income)
    });

    const result = response.data;

    // ✅ SAVE TO DATABASE
    await apiClient.put(`/admin/users/${userId}`, {
      recommended_plan: result.plan
    });

    // ✅ SHOW IN UI
    setAiPlan(result);

  } catch (err) {
    console.error("AI ERROR:", err);
  } finally {
    setLoadingAI(false);
  }
};

  const OptionCard = ({ label, icon, selected, onClick }) => (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all
        ${selected ? "bg-green-100 border-green-600" : "hover:border-green-500"}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          <div>
            <h2 className="text-3xl font-bold">
              Tell Us Your Insurance Preferences
            </h2>
            <p className="text-gray-500 text-sm">
              Customize recommendations based on your needs
            </p>
          </div>

          {/* POLICY */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Who is this policy for?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <OptionCard label="Myself" icon={<User size={18}/>}
                selected={selectedFor==="myself"} onClick={()=>setSelectedFor("myself")} />
              <OptionCard label="Spouse" icon={<Heart size={18}/>}
                selected={selectedFor==="spouse"} onClick={()=>setSelectedFor("spouse")} />
              <OptionCard label="Parents" icon={<Users size={18}/>}
                selected={selectedFor==="parents"} onClick={()=>setSelectedFor("parents")} />
              <OptionCard label="Whole Family" icon={<Shield size={18}/>}
                selected={selectedFor==="family"} onClick={()=>setSelectedFor("family")} />
            </div>
          </div>

          {/* TYPE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">What type of insurance?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <OptionCard label="Health Insurance" icon={<Activity size={18}/>}
                selected={selectedType==="health"} onClick={()=>setSelectedType("health")} />
              <OptionCard label="Life Insurance" icon={<Shield size={18}/>}
                selected={selectedType==="life"} onClick={()=>setSelectedType("life")} />
              <OptionCard label="Term Plan" icon={<Briefcase size={18}/>}
                selected={selectedType==="term"} onClick={()=>setSelectedType("term")} />
              <OptionCard label="Child Education" icon={<GraduationCap size={18}/>}
                selected={selectedType==="education"} onClick={()=>setSelectedType("education")} />
            </div>
          </div>

          {/* BUDGET */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Budget Preference</h3>
            <div className="flex gap-4">
              {["low","medium","high"].map((b)=>(
                <button key={b} onClick={()=>setBudget(b)}
                  className={`px-5 py-2 border rounded-lg
                  ${budget===b ? "bg-green-600 text-white" : ""}`}>
                  {b} Budget
                </button>
              ))}
            </div>
          </div>

          {/* RISK */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Risk Comfort Level</h3>
            <div className="flex gap-4">
              {["low","medium","high"].map((r)=>(
                <button key={r} onClick={()=>setRiskLevel(r)}
                  className={`px-5 py-2 border rounded-lg
                  ${riskLevel===r ? "bg-green-600 text-white" : ""}`}>
                  {r.toUpperCase()} Risk
                </button>
              ))}
            </div>
          </div>

          {/* ADDITIONAL */}
          <div className="bg-white p-6 rounded-xl shadow">
            <input type="number" value={income}
              onChange={(e)=>setIncome(e.target.value)}
              placeholder="Annual Income"
              className="w-full p-3 border rounded-lg mb-4"/>

            <textarea value={medical}
              onChange={(e)=>setMedical(e.target.value)}
              placeholder="Medical Conditions"
              className="w-full p-3 border rounded-lg"/>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button onClick={generateAIPlan}
              className="flex-1 bg-green-700 text-white py-3 rounded-lg">
              {loadingAI ? "Generating..." : "Generate My Customized Plan"}
            </button>

            <button onClick={handleSave}
              className="px-6 border rounded-lg">
              Save Preferences
            </button>
          </div>

          {/* AI */}
          {aiPlan && (
            <div className="bg-green-50 p-6 rounded-xl">
              <p><b>Plan:</b> {aiPlan.plan}</p>
              <p><b>Strategy:</b> {aiPlan.strategy}</p>
            </div>
          )}

        </div>

        {/* RIGHT SUMMARY */}
        <div className="hidden lg:block">
          <div className="bg-white p-6 rounded-xl shadow sticky top-10">
            <h3 className="font-semibold mb-4">Selection Summary</h3>
            <p>Policy For: {selectedFor || "Not selected"}</p>
            <p>Insurance Type: {selectedType || "Not selected"}</p>
            <p>Budget: {budget || "Not selected"}</p>
            <p>Risk Level: {riskLevel}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Preferences;