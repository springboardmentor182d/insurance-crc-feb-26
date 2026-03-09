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
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`block w-full text-left px-4 py-3 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1 p-8">
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