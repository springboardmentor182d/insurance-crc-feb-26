import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Lightbulb, 
  FileText, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';

import { useNavigate } from 'react-router-dom'; // ✅ ADD THIS

const Sidebar = () => {
  const navigate = useNavigate(); // ✅ ADD THIS

  // ✅ ADD PATH HERE
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Policies', icon: <ShieldCheck size={20} />, path: '/policies' },
    { name: 'Recommendations', icon: <Lightbulb size={20} />, path: '/recommendations' },
    { name: 'Claims', icon: <FileText size={20} />, path: '/claims' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
    { name: 'Preferences', icon: <Settings size={20} />, path: '/preferences' },
  ];

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");   // remove login token
    navigate("/login");                 // redirect to login
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-100 p-4">
      
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 mb-10">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <ShieldCheck size={20} />
        </div>
        <span className="text-xl font-bold text-blue-600">BimaVerse</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}   // 🔥 MAIN FIX
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 pt-4 mt-auto">
        <button
          onClick={handleLogout}   // 🔥 LOGOUT FIX
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;