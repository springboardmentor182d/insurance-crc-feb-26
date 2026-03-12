import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import DashboardHome from "./pages/DashboardHome";
import Users from "./pages/Users";
import Policies from "./pages/Policies";
import Claims from "./pages/Claims";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function Layout() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Users", path: "/users" },
    { name: "Policies", path: "/policies" },
    { name: "Claims", path: "/claims" },
    { name: "Analytics", path: "/analytics" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white text-gray-800 p-6 border-r border-gray-200">
        <h1 className="text-3xl font-bold mb-10 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          InsureLogic
        </h1>

        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`block w-full text-left px-4 py-3 rounded-2xl transition font-medium ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-purple-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900">Admin Dashboard</h2>
            <p className="text-gray-500 mt-2">Organization ID: ORG-12345</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-5 py-3 rounded-2xl bg-gray-100 text-gray-700 font-medium">
              Admin
            </div>
            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium shadow-md">
              Logout
            </button>
          </div>
        </div>

        <div className="p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/users" element={<Users />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;