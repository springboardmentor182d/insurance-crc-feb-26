import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Lightbulb, 
  FileText, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react'; // Using lucide-react for the icons shown in your UI

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, active: true },
    { name: 'Policies', icon: <ShieldCheck size={20} />, active: false },
    { name: 'Recommendations', icon: <Lightbulb size={20} />, active: false },
    { name: 'Claims', icon: <FileText size={20} />, active: false },
    { name: 'Profile', icon: <User size={20} />, active: false },
    { name: 'Preferences', icon: <Settings size={20} />, active: false },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-100 p-4">
      {/* Logo Section */}
      <div className="flex items-center gap-2 px-4 mb-10">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <ShieldCheck size={20} />
        </div>
        <span className="text-xl font-bold text-blue-600">BimaVerse</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              item.active 
                ? 'bg-blue-50 text-blue-600 font-semibold' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="border-t border-gray-100 pt-4 mt-auto">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;