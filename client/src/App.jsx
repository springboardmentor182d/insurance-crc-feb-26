import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Claims from './pages/Claims'; 
import { 
  LayoutDashboard, 
  FileText, 
  ArrowLeftRight, 
  ClipboardList, 
  ShieldCheck, 
  User, 
  LogOut,
  Zap
} from "lucide-react";
const ComingSoon = ({ title }) => (
  <div className="p-10 min-h-screen flex items-center justify-center bg-[#f8fafc]">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-500 mt-2">This page content was removed or is under development.</p>
    </div>
  </div>
);
const DashboardHome = () => (
  <div className="p-10 bg-[#f8fafc] min-h-screen font-sans text-gray-900">
    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link to="/claims" className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all no-underline group">
        <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#14532d]">Go to Claims</h4>
        <p className="text-sm text-gray-500">Submit and manage your insurance claims here.</p>
      </Link>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
        <div className="w-64 bg-[#14532d] flex flex-col text-white flex-shrink-0">
          <div className="p-8 mb-4">
            <h1 className="text-2xl font-bold tracking-tight">InsureHub</h1>
            <p className="text-[10px] text-green-300/80 uppercase tracking-widest font-bold mt-1">Client Portal</p>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem to="/claims" icon={<ClipboardList size={20} />} label="Claims" />
            <NavItem to="/policies" icon={<FileText size={20} />} label="Policies" />
            <NavItem to="/compare" icon={<ArrowLeftRight size={20} />} label="Compare" />
            <NavItem to="/recommendations" icon={<Zap size={20} />} label="Recommendations" />
            <NavItem to="/active-plan" icon={<ShieldCheck size={20} />} label="Active Plan" />
            <NavItem to="/profile" icon={<User size={20} />} label="Profile" />
          </nav>
          <div className="p-6 border-t border-white/10">
            <div className="mb-6 px-2">
              <p className="text-[10px] text-green-300/50 font-bold uppercase tracking-widest mb-1">Logged in as</p>
              <p className="text-sm font-bold text-white">Durga Mundkar</p>
            </div>
            <button className="w-full flex items-center gap-3 p-3 text-sm font-bold text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/policies" element={<ComingSoon title="Policies Page" />} />
            <Route path="/compare" element={<ComingSoon title="Compare Page" />} />
            <Route path="/recommendations" element={<ComingSoon title="Recommendations Page" />} />
            <Route path="/active-plan" element={<ComingSoon title="Active Plan Page" />} />
            <Route path="/profile" element={<ComingSoon title="Profile Page" />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

const NavItem = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all no-underline ${
        isActive ? 'bg-white/15 text-white font-bold' : 'text-green-100/60 hover:text-white hover:bg-white/5'
      }`}>
      <span className={isActive ? 'text-white' : 'text-green-300/70'}>{icon}</span>
      <span className="text-sm tracking-wide">{label}</span>
    </Link>
  );
};