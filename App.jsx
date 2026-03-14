import {
  LayoutDashboard,
  FileText,
  ShieldAlert,
  Users,
  BarChart3,
  ClipboardList,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const pieData = [
  { name: "Approved", value: 1847 },
  { name: "Pending", value: 342 },
  { name: "Rejected", value: 210 },
];

const barData = [
  { month: "Jan", claims: 400 },
  { month: "Feb", claims: 300 },
  { month: "Mar", claims: 500 },
  { month: "Apr", claims: 200 },
  { month: "May", claims: 450 },
];

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

export default function App() {
  return (
    <div className="h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-10">
          InsureAdmin
        </h1>

        <div className="space-y-6 text-gray-700">
          <div className="flex items-center gap-3 font-semibold text-blue-600">
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className="flex items-center gap-3">
            <FileText size={20} /> Policy Management
          </div>
          <div className="flex items-center gap-3">
            <ClipboardList size={20} /> Claims Management
          </div>
          <div className="flex items-center gap-3">
            <ShieldAlert size={20} /> Fraud Detection
          </div>
          <div className="flex items-center gap-3">
            <Users size={20} /> User Management
          </div>
          <div className="flex items-center gap-3">
            <BarChart3 size={20} /> Reports & Analytics
          </div>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col items-center overflow-y-auto p-10">

        {/* CENTERED DASHBOARD TITLE */}
        <div className="w-full max-w-6xl text-center mb-12">
          <h2 className="text-3xl font-bold">
            Dashboard Overview
          </h2>
          <p className="text-gray-500 mt-2">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>

        {/* CONTENT WRAPPER */}
        <div className="w-full max-w-6xl">

          {/* STAT CARDS */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h3 className="text-gray-500">Total Users</h3>
              <p className="text-3xl font-bold mt-2">12,458</p>
              <p className="text-green-500 text-sm mt-1">
                +12.5% vs last month
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h3 className="text-gray-500">Total Policies</h3>
              <p className="text-3xl font-bold mt-2">8,234</p>
              <p className="text-green-500 text-sm mt-1">
                +8.2% vs last month
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h3 className="text-gray-500">Pending Claims</h3>
              <p className="text-3xl font-bold mt-2">342</p>
              <p className="text-red-500 text-sm mt-1">
                -5.4% vs last month
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h3 className="text-gray-500">Approved Claims</h3>
              <p className="text-3xl font-bold mt-2">1,847</p>
              <p className="text-green-500 text-sm mt-1">
                +18.7% vs last month
              </p>
            </div>
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">
                Claims Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={100} label>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">
                Monthly Claims
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="claims" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}