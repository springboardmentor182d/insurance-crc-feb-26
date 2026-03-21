import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  // Keep Policies submenu open whenever we are on any /policies route
  const isPoliciesRoute = location.pathname.startsWith('/policies');
  const [policiesOpen, setPoliciesOpen] = useState(isPoliciesRoute);

  useEffect(() => {
    if (isPoliciesRoute) {
      setPoliciesOpen(true);
    }
  }, [isPoliciesRoute]);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { 
      path: '/policies', 
      label: 'Policies', 
      icon: '📄',
      hasSubmenu: true,
      submenu: [
        { path: '/policies/browse', label: 'Browse Policies', icon: '🔍' },
        { path: '/policies/active', label: 'Active Policies', icon: '✓' },
      ]
    },
    { path: '/recommendations', label: 'Recommendations', icon: '💡' },
    { path: '/claims', label: 'Claims', icon: '📋' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/preferences', label: 'Preferences', icon: '⚙️' },
  ];

  const isActive = (path) => {
    if (path === '/policies') {
      return isPoliciesRoute;
    }
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-lg font-bold">🛡️</span>
          </div>
          <span className="text-xl font-bold text-gray-900">BimaVerse</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              {item.hasSubmenu ? (
                <div>
                  <button
                    onClick={() => setPoliciesOpen(!policiesOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path) || policiesOpen
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className={`transform transition-transform ${policiesOpen ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {policiesOpen && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.path}>
                          <Link
                            to={subItem.path}
                            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                              isActive(subItem.path)
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>{subItem.icon}</span>
                            <span>{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <button className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 font-medium py-2">
          <span>Logout</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
