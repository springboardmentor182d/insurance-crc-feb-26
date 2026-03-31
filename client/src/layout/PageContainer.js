import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const PageContainer = ({ children, currentView, onNavigate }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Navigation */}
      <Sidebar currentView={currentView} onNavigate={onNavigate} />

      {/* Right Side Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
export default PageContainer;