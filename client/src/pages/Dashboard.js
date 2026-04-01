import React, { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import Sidebar from '../layout/user/Sidebar';
import { fetchActivePolicies } from '../features/policies/services/policiesService';
import { TOKEN_KEYS ,ROUTES} from '../data/constants';
import {
  FileText, Activity, AlertCircle, CheckCircle,
  ArrowRight, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [userName, setUserName] = useState('User');
  const navigate = useNavigate();

  useEffect(() => {
    const userRaw = localStorage.getItem(TOKEN_KEYS.USER);
    if (!userRaw || userRaw === 'undefined') return;
    try {
      const user = JSON.parse(userRaw);
      const displayName = user?.name || user?.full_name || user?.first_name || 'User';
      setUserName(displayName);
    } catch {
      setUserName('User');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activePolicies = await fetchActivePolicies();
        const policiesPayload = Array.isArray(activePolicies) ? activePolicies : [];
        const normalizedPolicies = policiesPayload.map((policy) => ({
          id: policy.id,
          policy_type: policy.category || 'Policy',
          policy_number: policy.policy_number,
          premium_amount: Number(policy.premium_annual || 0),
        }));
        setPolicies(normalizedPolicies);

        const cRes = await apiClient.get('/claims');
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
  const policyTrend         = totalActivePolicies > 0 ? `+${totalActivePolicies} this month` : 'No new policies';
  const coverageTrend       = rawCoverageSum > 0 ? `${(rawCoverageSum / 10).toFixed(1)}% vs last year` : '0% growth';

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          <div className="animate-in fade-in duration-700">

            {/* Header */}
            <div className="mb-8 text-left">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {userName}!</h1>
              <p className="text-gray-500 mt-1 font-medium">Overview of your insurance portfolio</p>
            </div>

            {/* Stats Cards */}
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
                <p className="text-xs text-orange-600 mt-2 font-bold">{pendingClaimsCount > 0 ? 'Requires action' : 'All clear'}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4"><CheckCircle size={24} /></div>
                <h3 className="text-4xl font-bold text-gray-900">{resolvedClaimsCount}</h3>
                <p className="text-gray-500 font-semibold text-sm">Resolved Claims</p>
                <p className="text-xs text-emerald-600 mt-2 font-bold">Last 30 days</p>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div
                onClick={() => navigate('/policies/browse')}
                className="bg-blue-600 p-8 rounded-3xl text-white flex justify-between items-center group cursor-pointer"
              >
                <div className="text-left"><h4 className="text-xl font-bold mb-1">Browse Policies</h4><p className="text-blue-100 text-sm">Find the perfect coverage</p></div>
                <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
              </div>
              <div
                onClick={() => navigate(ROUTES.RECOMMENDATIONS)}
                className="bg-purple-600 p-8 rounded-3xl text-white flex justify-between items-center group cursor-pointer"
              >
                <div className="text-left"><h4 className="text-xl font-bold mb-1">Recommendations</h4><p className="text-purple-100 text-sm">AI-powered suggestions</p></div>
                <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
              </div>
              <div
                onClick={() => navigate('/claims')}
                className="bg-green-600 p-8 rounded-3xl text-white flex justify-between items-center cursor-pointer group"
              >
                <div className="text-left"><h4 className="text-xl font-bold mb-1">File a Claim</h4><p className="text-green-100 text-sm">Quick submission</p></div>
                <Plus size={28} className="group-hover:rotate-90 transition-transform" />
              </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-extrabold text-gray-800">Active Policies</h3>
                  <button
                    onClick={() => navigate('/policies/active')}
                    className="text-blue-600 text-sm font-semibold hover:underline"
                  >
                    View All
                  </button>
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
                  {policies.length === 0 && (
                    <p className="text-sm text-gray-400">No active policies yet.</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-extrabold text-gray-800">Recent Claims</h3>
                  <button
                    onClick={() => navigate('/claims')}
                    className="text-blue-600 text-sm font-semibold hover:underline"
                  >
                    View All
                  </button>
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
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${claim.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {claim.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {claims.length === 0 && (
                    <p className="text-sm text-gray-400">No claims yet.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;