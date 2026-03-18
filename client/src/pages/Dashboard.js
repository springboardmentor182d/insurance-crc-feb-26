import React, { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient'; // Note the '../' because we are now in the 'pages' folder
import FromInput from '../components/Form/FromInput'; 
import Formselect from '../components/Form/Formselect'; 
import {
  FileText, Activity, AlertCircle, CheckCircle,
  ArrowRight, Plus, ArrowLeft
} from 'lucide-react';

function DashboardPage() {
  const [view, setView] = useState('dashboard');
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await apiClient.get("/api/v1/admin/policies");
        const cRes = await apiClient.get("/api/v1/admin/claims");
        setPolicies(pRes.data);
        setClaims(cRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // --- CALCULATIONS ---
  const totalActivePolicies = policies.length;
  const totalCoverage = policies.reduce((sum, policy) => {
    const value = parseFloat(policy.price.replace(/[^0-9.]/g, '')) || 0;
    return sum + value;
  }, 0);
  const pendingClaimsCount = claims.filter(c => c.status === 'Pending').length;
  const resolvedClaimsCount = claims.filter(c => c.status === 'Approved' || c.status === 'Resolved').length;

  return (
    <div className="w-full">
      {view === 'dashboard' ? (
        <div className="animate-in fade-in duration-700">
          {/* Header */}
          <div className="mb-8 text-left">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back, John!</h1>
            <p className="text-gray-500 mt-1 font-medium">Overview of your insurance portfolio</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {/* Active Policies */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4"><FileText size={24} /></div>
              <h3 className="text-4xl font-bold text-gray-900">{totalActivePolicies}</h3>
              <p className="text-gray-500 font-semibold text-sm">Active Policies</p>
            </div>
            {/* Total Coverage */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl w-fit mb-4"><Activity size={24} /></div>
              <h3 className="text-4xl font-bold text-gray-900">${totalCoverage.toFixed(1)}</h3>
              <p className="text-gray-500 font-semibold text-sm">Total Coverage</p>
            </div>
            {/* Pending Claims */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl w-fit mb-4"><AlertCircle size={24} /></div>
              <h3 className="text-4xl font-bold text-gray-900">{pendingClaimsCount}</h3>
              <p className="text-gray-500 font-semibold text-sm">Pending Claims</p>
            </div>
            {/* Resolved Claims */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4"><CheckCircle size={24} /></div>
              <h3 className="text-4xl font-bold text-gray-900">{resolvedClaimsCount}</h3>
              <p className="text-gray-500 font-semibold text-sm">Resolved Claims</p>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
               <h3 className="text-xl font-extrabold text-gray-800 mb-6">Active Policies</h3>
               <div className="space-y-3 max-h-96 overflow-y-auto">
                 {policies.length > 0 ? (
                   policies.map((policy, idx) => (
                     <div key={idx} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                       <div className="flex justify-between items-start">
                         <div>
                           <p className="font-semibold text-gray-900">{policy.name}</p>
                           <p className="text-sm text-gray-500">{policy.sub}</p>
                         </div>
                         <span className="text-green-600 font-bold">{policy.price}</span>
                       </div>
                     </div>
                   ))
                 ) : (
                   <p className="text-gray-400 text-sm">No policies found</p>
                 )}
               </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
               <h3 className="text-xl font-extrabold text-gray-800 mb-6">Recent Claims</h3>
               <div className="space-y-3 max-h-96 overflow-y-auto">
                 {claims.length > 0 ? (
                   claims.map((claim, idx) => (
                     <div key={idx} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                       <div className="flex justify-between items-start mb-2">
                         <div>
                           <p className="font-semibold text-gray-900">{claim.id}</p>
                           <p className="text-sm text-gray-600">{claim.type}</p>
                         </div>
                         <span className={`font-bold text-sm ${claim.status === 'Resolved' ? 'text-green-600' : claim.status === 'Pending' ? 'text-orange-600' : 'text-gray-600'}`}>
                           {claim.status}
                         </span>
                       </div>
                       <div className="flex justify-between items-center text-xs text-gray-500">
                         <span>{claim.date}</span>
                         <span className="font-semibold text-gray-900">{claim.amount}</span>
                       </div>
                     </div>
                   ))
                 ) : (
                   <p className="text-gray-400 text-sm">No claims found</p>
                 )}
               </div>
            </div>
          </div>
        </div>
      ) : (
        /* Form View */
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl border border-gray-100 shadow-xl text-left">
          <button onClick={() => setView('dashboard')} className="flex items-center text-blue-600 mb-8 font-bold text-xs"><ArrowLeft size={16} /> BACK</button>
          <FromInput label="POLICY IDENTIFICATION" placeholder="e.g. BIMA-4492-X" />
          <Formselect label="CLAIM CATEGORY" options={[{ value: 'health', label: 'Health' }]} />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;