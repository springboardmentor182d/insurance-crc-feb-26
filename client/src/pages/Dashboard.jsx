import React, { useEffect, useState } from "react";
import { 
  FiGrid, FiFileText, FiList, FiStar, FiFile, FiAlertCircle, 
  FiPlusCircle, FiUser, FiSliders, FiLogOut 
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

/* MAIN */

export default function Dashboard() {
   const navigate = useNavigate();
   const [stats, setStats] = useState({
     total_policies: 0,
     active_claims: 0,
     recommended_policies: 0,
     claim_status: "-",
     recent_policies: [],
     recent_claims: []
   });
   
   const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:8000"}/api/dashboard-data`)
       .then(res => {
         if (!res.ok) throw new Error("API HTTP Error: " + res.status);
         return res.json();
       })
       .then(data => {
         console.log("API DATA:", data);
         setStats(data);
       })
       .catch(err => {
         console.error("API Error:", err);
         setErrorMsg(err.toString());
       });
  }, []);
  
  const sidebarItems = [
    { name: "Dashboard", icon: <FiGrid /> },
    { name: "Browse Policies", icon: <FiFileText /> },
    { name: "Compare Policies", icon: <FiList /> },
    { name: "Recommendations", icon: <FiStar /> },
    { name: "My Policies", icon: <FiFile /> },
    { name: "Claims", icon: <FiAlertCircle /> },
    { name: "Add Policy Manually", icon: <FiPlusCircle /> },
    { name: "Profile", icon: <FiUser /> },
    { name: "Preferences", icon: <FiSliders /> },
    { name: "Logout", icon: <FiLogOut /> }
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F5F7]">
      {errorMsg && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white p-3 z-50 text-center font-bold shadow-md">
          ⚠️ Fetch Error: {errorMsg}
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-64 bg-[#FCFCFD] p-6 shadow-sm border-r border-gray-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <img 
              src="/logo.png" 
              alt="InsureLogic Logo" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl font-bold text-gray-800">
              InsureLogic
            </h1>
          </div>
          
          <div className="flex flex-col gap-1">
            {sidebarItems.map((item, i) => (
              <div key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                  item.name === "Dashboard"
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md shadow-purple-200"
                    : "hover:bg-purple-50 text-gray-600 hover:text-purple-600"
                }`}>
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 px-10 py-8 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-800">Dashboard</h2>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50">
              <FiUser className="text-gray-500" />
              <span className="text-sm font-medium text-gray-600">John Doe</span>
            </div>
            <button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-md shadow-indigo-200 hover:opacity-90 transition-opacity"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <KpiCard icon="🛡️" title="Total Policies" value={stats.total_policies || 8} color="blue" />
          <KpiCard icon="🕒" title="Active Claims" value={stats.active_claims || 2} color="red" />
          <KpiCard icon="📈" title="Recommended Policies" value={stats.recommended_policies || 5} color="green" />
        </div>

        {/* DATA TABLES */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          
          {/* RECENT POLICIES TABLE */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Recent Policies</h3>
              <button 
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-full text-xs font-medium shadow-md shadow-purple-200 hover:opacity-90 transition-opacity"
                onClick={() => alert("Add New Policy clicked!")}
              >
                + Add Policy
              </button>
            </div>
            
            <div className="w-full flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-100">
                    <th className="pb-4 font-medium pr-4">Provider</th>
                    <th className="pb-4 font-medium pr-4">Type</th>
                    <th className="pb-4 font-medium text-right">Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.recent_policies || []).map((policy, idx) => (
                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 text-sm font-medium text-gray-700 pr-4">{policy.provider}</td>
                      <td className="py-4 text-sm text-gray-500 pr-4">{policy.type}</td>
                      <td className="py-4 text-sm font-medium text-gray-700 text-right">{policy.coverage}</td>
                    </tr>
                  ))}
                  {(!stats.recent_policies || stats.recent_policies.length === 0) && (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-gray-400 text-sm">
                        No recent policies found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ACTIVE CLAIMS TABLE */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Active Claims</h3>
              <button 
                className="bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-purple-100 transition-colors"
                onClick={() => alert("View All Claims")}
              >
                View All
              </button>
            </div>
            
            <div className="w-full flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-100">
                    <th className="pb-4 font-medium pr-4">Claim ID</th>
                    <th className="pb-4 font-medium pr-4">Date</th>
                    <th className="pb-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.recent_claims || []).map((claim, idx) => (
                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 text-sm font-bold text-gray-800 pr-4">{claim.id}</td>
                      <td className="py-4 text-sm text-gray-500 pr-4">{claim.date}</td>
                      <td className="py-4 text-sm text-right">
                        <span className={`inline-block px-3 py-1 text-[11px] font-bold tracking-wide rounded-full text-center ${
                          claim.status === "Approved" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {claim.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!stats.recent_claims || stats.recent_claims.length === 0) && (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-gray-400 text-sm">
                        No active claims found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* BOTTOM ACTION CARDS */}
        <div className="grid grid-cols-3 gap-6">
          <ActionCard 
            icon="⚖️" 
            title="Compare Policies" 
            description="Find the best insurance deals for your needs" 
            color="blue"
          />
          <ActionCard 
            icon="✨" 
            title="Get Recommendations" 
            description="AI-powered policy suggestions for you" 
            color="purple"
          />
          <ActionCard 
            icon="❗" 
            title="File a Claim" 
            description="Submit and track your insurance claims" 
            color="orange"
          />
        </div>

      </div>
    </div>
  );
}

/* COMPONENTS */

const KpiCard = ({ icon, title, value, color, isText }) => {
  const bgColors = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    purple: "bg-gradient-to-r from-pink-500 to-purple-500"
  };

  const iconColors = {
    blue: "bg-blue-400",
    red: "bg-red-400",
    green: "bg-green-400",
    purple: "bg-purple-400"
  };

  return (
    <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-50 flex flex-col justify-between">
      <div className={`w-12 h-12 flex items-center justify-center rounded-2xl mb-6 text-xl shadow-sm ${bgColors[color]} text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h2 className={`font-bold ${isText ? 'text-2xl text-gray-700' : 'text-3xl text-gray-800'}`}>
          {value}
        </h2>
      </div>
    </div>
  );
};

const ActionCard = ({ icon, title, description, color }) => {
  const colorMap = {
    blue: "bg-blue-500 text-white",
    purple: "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
    orange: "bg-orange-500 text-white"
  };

  return (
    <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-50 flex flex-col items-start hover:shadow-md transition-shadow cursor-pointer">
      <div className={`w-12 h-12 flex items-center justify-center rounded-2xl mb-4 text-xl shadow-sm ${colorMap[color]}`}>
        {icon}
      </div>
      <h4 className="font-bold text-gray-800 mb-2">{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
};