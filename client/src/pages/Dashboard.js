import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import FormInput from '../components/Form/FormInput';
import Formselect from '../components/Form/Formselect';
import Sidebar from '../layout/user/Sidebar';
import { ROUTES } from '../data/constants';
import { FileText, Activity, AlertCircle, CheckCircle, ArrowRight, Plus, ArrowLeft } from 'lucide-react';

function DashboardPage() {
  const navigate = useNavigate();
  const [view, setView]         = useState('dashboard');
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims]     = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await apiClient.get("/admin/dashboard/policies");
        const policiesPayload = pRes.data?.data ?? pRes.data;
        setPolicies(Array.isArray(policiesPayload) ? policiesPayload : []);

        const cRes = await apiClient.get("/admin/dashboard/claims");
        const claimsPayload = cRes.data?.data ?? cRes.data;
        setClaims(Array.isArray(claimsPayload) ? claimsPayload : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const totalActivePolicies = policies.length;
  const rawCoverageSum      = policies.reduce((sum, p) => sum + (parseFloat(p.premium_amount) || 0), 0);
  const pendingClaimsCount  = claims.filter(c => c.status === 'Pending').length;
  const resolvedClaimsCount = claims.filter(c => c.status === 'Approved' || c.status === 'Resolved').length;
  const policyTrend         = totalActivePolicies > 0 ? `+${totalActivePolicies} this month` : "No new policies";
  const coverageTrend       = rawCoverageSum > 0 ? `${(rawCoverageSum / 10).toFixed(1)}% vs last year` : "0% growth";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {view === 'dashboard' ? (
            <div className="animate-in fade-in duration-700">
              <div className="mb-8 text-left">
                <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
                <p className="text-gray-500 mt-1 font-medium">Overview of your insurance portfolio</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4"><FileText size={24} /></div>
                  <h3 className="text-4xl font-bold text-gray-900">{totalActivePolicies}</h3>
                  <p className="text-gray-500 font-semibold text-sm">Active Policies</p>
                  <p className="text-xs text-blue-600 mt-2 font-bold">{policyTrend}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl w-fit mb-4"><Activity size={24} /></div>
                  <h3 className="text-4xl font-bold text-gray-900">${rawCoverageSum}M</h3>
                  <p className="text-gray-500 font-semibold text-sm">Total Coverage</p>
                  <p className="text-xs text-green-600 mt-2 font-bold">{coverageTrend}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl w-fit mb-4"><AlertCircle size={24} /></div>
                  <h3 className="text-4xl font-bold text-gray-900">{pendingClaimsCount}</h3>
                  <p className="text-gray-500 font-semibold text-sm">Pending Claims</p>
                  <p className="text-xs text-orange-600 mt-2 font-bold">{pendingClaimsCount > 0 ? "Requires action" : "All clear"}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4"><CheckCircle size={24} /></div>
                  <h3 className="text-4xl font-bold text-gray-900">{resolvedClaimsCount}</h3>
                  <p className="text-gray-500 font-semibold text-sm">Resolved Claims</p>
                  <p className="text-xs text-emerald-600 mt-2 font-bold">Last 30 days</p>
                </div>
              </div>

              {/* Action cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div onClick={() => navigate(ROUTES.BROWSE_POLICIES)} className="bg-blue-600 p-8 rounded-3xl text-white flex justify-between items-center group cursor-pointer">
                  <div className="text-left"><h4 className="text-xl font-bold mb-1">Browse Policies</h4><p className="text-blue-100 text-sm">Find the perfect coverage</p></div>
                  <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
                </div>
                <div onClick={() => navigate(ROUTES.RECOMMENDATIONS)} className="bg-purple-600 p-8 rounded-3xl text-white flex justify-between items-center group cursor-pointer">
                  <div className="text-left"><h4 className="text-xl font-bold mb-1">Recommendations</h4><p className="text-purple-100 text-sm">Smart suggestions</p></div>
                  <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
                </div>
                <div onClick={() => setView('claim')} className="bg-green-600 p-8 rounded-3xl text-white flex justify-between items-center cursor-pointer group">
                  <div className="text-left"><h4 className="text-xl font-bold mb-1">File a Claim</h4><p className="text-green-100 text-sm">Quick submission</p></div>
                  <Plus size={28} className="group-hover:rotate-90 transition-transform" />
                </div>
              </div>

              {/* Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-extrabold text-gray-800">Active Policies</h3>
                    <button onClick={() => navigate(ROUTES.ACTIVE_POLICIES)} className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {policies.map((policy, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                        <div>
                          <p className="font-bold text-gray-900">{policy.policy_type}</p>
                          <p className="text-xs text-gray-400">ID: {policy.policy_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${policy.premium_amount}</p>
                          <span className="text-[10px] font-black text-green-600 uppercase bg-green-100 px-2 py-1 rounded">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-extrabold text-gray-800">Recent Claims</h3>
                    <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {claims.map((claim, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                        <div>
                          <p className="font-bold text-gray-900">{claim.id}</p>
                          <p className="text-xs text-gray-400">{claim.type} • {claim.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{claim.amount}</p>
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${claim.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{claim.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl border border-gray-100 shadow-xl text-left">
              <button onClick={() => setView('dashboard')} className="flex items-center text-blue-600 mb-8 font-bold text-xs"><ArrowLeft size={16} className="mr-2" /> BACK TO DASHBOARD</button>
              <h2 className="text-3xl font-black text-gray-900 mb-6">File a New Claim</h2>
              <form className="space-y-8">
                <FormInput label="POLICY IDENTIFICATION" placeholder="e.g. BIMA-4492-X" />
                <Formselect label="CLAIM CATEGORY" options={[{ value: 'health', label: 'Health' }, { value: 'auto', label: 'Auto' }]} />
                <button type="button" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg">SUBMIT CLAIM</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
