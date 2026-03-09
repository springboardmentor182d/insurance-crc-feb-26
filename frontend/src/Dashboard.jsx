import { useState } from "react";

function Dashboard() {
  const [selectedSection, setSelectedSection] = useState("Dashboard");

  const menuItems = [
    "Dashboard",
    "Users",
    "Policies",
    "Claims",
    "Analytics",
    "Settings",
  ];

  const statCards = [
    { title: "Total Users", value: "120", section: "Users" },
    { title: "Active Policies", value: "85", section: "Policies" },
    { title: "Pending Claims", value: "12", section: "Claims" },
    { title: "Revenue", value: "$25,000", section: "Analytics" },
  ];

  const quickActions = [
    { title: "Manage Users", description: "View and manage all users" },
    { title: "Add Policy", description: "Create a new policy" },
    { title: "View Analytics", description: "Check reports and insights" },
    { title: "Settings", description: "Update dashboard settings" },
  ];

  const recentUsers = [
    { name: "John Doe", email: "john@example.com", joined: "2026-01-15" },
    { name: "Jane Smith", email: "jane@example.com", joined: "2026-02-01" },
    { name: "Mike Johnson", email: "mike@example.com", joined: "2026-02-10" },
  ];

  const pendingClaims = [
    { name: "Sarah Wilson", type: "Health Insurance", amount: "$5,000" },
    { name: "Tom Brown", type: "Auto Insurance", amount: "$3,500" },
    { name: "Emily Davis", type: "Life Insurance", amount: "$7,200" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedSection(item)}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                selectedSection === item
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Selected Section:{" "}
          <span className="font-semibold">{selectedSection}</span>
        </p>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              onClick={() => setSelectedSection(card.section)}
              className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-md hover:bg-blue-50 transition"
            >
              <h2 className="text-gray-500">{card.title}</h2>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Action Cards */}
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={() => setSelectedSection(action.title)}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md cursor-pointer hover:bg-green-50 transition"
            >
              <h3 className="text-xl font-bold">{action.title}</h3>
              <p className="text-gray-600 mt-2">{action.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">Joined: {user.joined}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Pending Claims</h2>
            <div className="space-y-4">
              {pendingClaims.map((claim, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{claim.name}</h3>
                  <p className="text-gray-600">{claim.type}</p>
                  <p className="text-sm font-medium mt-2">{claim.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;