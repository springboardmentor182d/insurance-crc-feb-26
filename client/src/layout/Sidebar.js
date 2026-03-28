import React from "react";
import {
  FileText,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";


const menuItems = [
  { key: "dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { key: "policies", name: "Policies", icon: <ShieldCheck size={20} /> },
  { key: "recommendations", name: "Recommendations", icon: <Lightbulb size={20} /> },
  { key: "claims", name: "Claims", icon: <FileText size={20} /> },
  { key: "profile", name: "Profile", icon: <User size={20} /> },
  { key: "preferences", name: "Preferences", icon: <Settings size={20} /> },
];


const Sidebar = ({ currentView = "dashboard", onNavigate = () => {} }) => {
  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-100 p-4">
      <div className="flex items-center gap-2 px-4 mb-10">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <ShieldCheck size={20} />
        </div>
        <span className="text-xl font-bold text-blue-600">BimaVerse</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              currentView === item.key
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-gray-100 pt-4 mt-auto">
        <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};


export default Sidebar;
