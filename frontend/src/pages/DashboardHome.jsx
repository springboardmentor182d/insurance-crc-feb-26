import { useNavigate } from "react-router-dom";

function DashboardHome() {
  const navigate = useNavigate();

  const stats = [
    { title: "Total Users", value: "1,248", change: "+12%", path: "/users" },
    { title: "Active Policies", value: "3,456", change: "+8%", path: "/policies" },
    { title: "Pending Claims", value: "89", change: "-3%", path: "/claims" },
    { title: "Revenue", value: "$2.4M", change: "+15%", path: "/analytics" },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage all users",
      path: "/users",
    },
    {
      title: "Add Policy",
      description: "Create a new policy entry",
      path: "/policies",
    },
    {
      title: "View Analytics",
      description: "Detailed reports and insights",
      path: "/analytics",
    },
    {
      title: "Settings",
      description: "Configure system settings",
      path: "/settings",
    },
  ];

  const recentUsers = [
    {
      name: "John Doe",
      email: "john@example.com",
      joined: "2026-01-15",
      policies: "3 policies",
      status: "Active",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      joined: "2026-02-01",
      policies: "5 policies",
      status: "Active",
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      joined: "2026-02-10",
      policies: "2 policies",
      status: "Active",
    },
  ];

  const pendingClaims = [
    {
      name: "Sarah Wilson",
      type: "Health Insurance",
      date: "2026-02-14",
      amount: "$5,000",
      status: "Pending",
    },
    {
      name: "Tom Brown",
      type: "Auto Insurance",
      date: "2026-02-13",
      amount: "$3,500",
      status: "Under Review",
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md hover:bg-blue-50 transition"
          >
            <div className="flex justify-between items-start">
              <p className="text-gray-600 text-lg">{item.title}</p>
              <span
                className={`text-sm font-semibold ${
                  item.change.startsWith("-") ? "text-red-500" : "text-green-500"
                }`}
              >
                {item.change}
              </span>
            </div>
            <h2 className="text-3xl font-bold mt-4 text-slate-900">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <div
            key={index}
            onClick={() => navigate(action.path)}
            className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md hover:bg-green-50 transition"
          >
            <h3 className="text-xl font-bold text-slate-900">{action.title}</h3>
            <p className="text-gray-600 mt-3">{action.description}</p>
          </div>
        ))}
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Users</h2>
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                    <p className="text-sm text-gray-500 mt-1">Joined: {user.joined}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">{user.policies}</p>
                    <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Pending Claims</h2>
          <div className="space-y-4">
            {pendingClaims.map((claim, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{claim.name}</h3>
                    <p className="text-gray-600 mt-1">{claim.type}</p>
                    <p className="text-sm text-gray-500 mt-1">{claim.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">{claim.amount}</p>
                    <span className="inline-block mt-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                      {claim.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;