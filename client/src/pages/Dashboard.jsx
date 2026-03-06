import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

import { FiSearch, FiBell, FiDownload, FiFilter } from "react-icons/fi";

/* MAIN */

export default function Dashboard() {
   const [stats, setStats] = useState({
     active_policies: 0,
     total_claims: 0,
     monthly_revenue: 0,
     satisfaction: 0,
     revenue_data: [],
     radar_data: [],
     pie_data: [],
     claims_data: [],
     top_performers: [],
     top_stats: [],
     kpi_growth: {
       active_policies: "0%",
       total_claims: "0%",
       monthly_revenue: "0%",
       satisfaction: "0%"
     }
   });
   
   const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:8000"}/api/dashboard-data`)
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
  
  return (
    <div className="flex min-h-screen bg-[#F4F2F8]">
      {errorMsg && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white p-3 z-50 text-center font-bold shadow-md">
          ⚠️ Fetch Error: {errorMsg}
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-64 bg-white p-6 shadow-xl">
       <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 bg-[#27465E] rounded-md flex items-center justify-center">
          <img
             src="/logo.png"
             alt="InsureLogic"
             className="w-8 h-8 object-contain"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            InsureLogic
          </h1>
          <p className="text-sm text-gray-500">Insurance Management</p>
        </div>
      </div>
        {[
          "🏠 Dashboard",
          "📚 Policy Catalog",
          "🤖 Recommendations",
          "📊 Claims & Analytics",
          "⚙️ Provider Settings",
          "👤 Profile"
        ].map((item, i) => (
          <div key={i}
            className={`p-3 mb-3 rounded-xl cursor-pointer ${
              i === 0
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow"
                : "hover:bg-purple-50 text-gray-600"
            }`}>
            {item}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-white px-5 py-2 rounded-full shadow text-gray-600">📅 Last 6 Months</div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow">
              <FiSearch />
              <input className="ml-2 outline-none" placeholder="Search..." />
            </div>
            <FiFilter size={20} className="text-gray-500" />
            <FiBell size={20} className="text-gray-500" />
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full flex gap-2 items-center shadow">
              <FiDownload /> Export
            </button>
          </div>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-6 gap-4">
          {stats.top_stats.map((s, i) => (
            <Stat key={i} {...s} />
          ))}
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          {[
            ["🛡", "Active Policies", stats.active_policies, stats.kpi_growth?.active_policies || "0%"],
            ["📄", "Total Claims", stats.total_claims, stats.kpi_growth?.total_claims || "0%"],
            ["💰", "Monthly Revenue", "$" + stats.monthly_revenue, stats.kpi_growth?.monthly_revenue || "0%"],
            ["📈", "Satisfaction Score", stats.satisfaction + "%", stats.kpi_growth?.satisfaction || "0%"]
          ].map((d, i) => (
            <Kpi key={i} {...d} />
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-3 gap-6 mt-8">

          <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">📊 Revenue & Performance Trends</h3>

              {/* ✅ ADDED TABS */}
              <div className="flex gap-2">
                <button className="px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm">Revenue</button>
                <button className="px-4 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">Claims</button>
                <button className="px-4 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">Policies</button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.revenue_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" />
                <YAxis />
                <Tooltip />
                <Line dataKey="v" stroke="#8B5CF6" strokeWidth={4} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-4">🎯 Performance Metrics</h3>
            <ResponsiveContainer height={300}>
              <RadarChart data={stats.radar_data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LOWER SECTION */}
        <div className="grid grid-cols-3 gap-6 mt-8">

          {/* POLICY DISTRIBUTION */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-4">🥧 Policy Distribution</h3>

            <ResponsiveContainer height={250}>
              <PieChart>
                <Pie data={stats.pie_data} dataKey="value" innerRadius={60}>
                  {stats.pie_data.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* ✅ COLOR LEGEND FIX */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {stats.pie_data.map((p, i) => (
                <div key={i} className="flex justify-between bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                    {p.name}
                  </div>
                  <span className="font-semibold">{p.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CLAIM STATUS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-4">📊 Claims Status</h3>
            <ResponsiveContainer height={250}>
              <BarChart data={stats.claims_data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="v">
                  {stats.claims_data.map((c, i) => <Cell key={i} fill={c.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 bg-purple-50 p-4 rounded-xl text-center">
              <div className="text-gray-600">Total Processed</div>
              <div className="text-xl font-bold">{stats.total_claims} claims</div>
            </div>
          </div>

          {/* TOP PERFORMERS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-4">🏆 Top Performers</h3>
            {stats.top_performers.map((p,i)=>(
              <div key={i} className="flex justify-between items-center bg-gray-50 p-4 mb-3 rounded-xl">
                <div>
                  <p className="font-medium">{p[0]}</p>
                  <p className="text-sm text-gray-500">{p[1]}</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-600 font-semibold">{p[2]}</p>
                  <p className="text-green-600 text-sm">{p[3]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* COMPONENTS */

const Stat = ({ 0: title, 1: value, 2: color }) => {
  const map = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    pink: "bg-pink-100 text-pink-700",
    red: "bg-red-100 text-red-700"
  };

  return (
    <div className={`p-4 rounded-xl border ${map[color]}`}>
      <p className="text-sm">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
};

const Kpi = ({ 0: icon, 1: title, 2: value, 3: growth }) => (
  <div className="bg-white p-6 rounded-2xl shadow relative">
    <span className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">↑ {growth}</span>
    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl mb-4 text-white text-xl shadow">
      {icon}
    </div>
    <p className="text-gray-500">{title}</p>
    <h2 className="text-3xl font-bold mt-2">{value}</h2>
    <div className="bg-gray-200 h-2 rounded-full mt-4">
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 w-3/4 rounded-full" />
    </div>
  </div>
);