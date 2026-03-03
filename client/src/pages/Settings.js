import React from 'react';
import { Link } from 'react-router-dom';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
          
          <div className="space-y-4">
            <Link
              to="/profile"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile</h2>
              <p className="text-gray-600">Manage your personal information and account details</p>
            </Link>
            
            <Link
              to="/preferences"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Preferences</h2>
              <p className="text-gray-600">Customize your account settings and notification preferences</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
