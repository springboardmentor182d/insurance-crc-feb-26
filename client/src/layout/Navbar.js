import React from 'react';
import { Bell, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-8 shrink-0">
      {/* Right Side Icons - Realigned to the right */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg relative">
          <Bell size={20} />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        {/* Divider */}
        <div className="h-8 w-px bg-gray-100 mx-2"></div>
        
        {/* User Profile Info */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-none">John Doe</p>
            <p className="text-xs text-gray-500 mt-1">Premium Member</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm group-hover:bg-blue-200 transition-colors">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;