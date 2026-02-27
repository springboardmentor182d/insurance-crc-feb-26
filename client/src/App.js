import React, { useState } from 'react';
import PageContainer from './layout/PageContainer';
import FromInput from './components/Form/FromInput'; 
import Formselect from './components/Form/Formselect';
import { 
  FileText, Activity, AlertCircle, CheckCircle, 
  ArrowRight, Plus, ArrowLeft 
} from 'lucide-react';

function App() {
  const [view, setView] = useState('dashboard');

  return (
    <PageContainer currentView={view} onNavigate={setView}>
      {view === 'dashboard' ? (
        <div className="animate-in fade-in duration-700">
          {/* Header Section */}
          <div className="mb-8 text-left">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back, John!</h1>
            <p className="text-gray-500 mt-1 font-medium">Here's an overview of your insurance portfolio</p>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4"><FileText size={24} /></div>
              <h3 className="text-4xl font-bold text-gray-900">5</h3>
              <p className="text-gray-500 font-semibold text-sm">Active Policies</p>
              <p className="text-xs text-blue-600 mt-2 font-bold">+1 this month</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl w-fit mb-4"><Activity size={24} /></div>
              <h3 className="text-4xl font-bold text-gray-900">$2.5M</h3>
              <p className="text-gray-500 font-semibold text-sm">Total Coverage</p>
              <p className="text-xs text-green-600 mt-2 font-bold">+12% from last year</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl w-fit mb-4"><AlertCircle size={24} /></div>
              <h3 className="text-4xl font-bold text-gray-900">2</h3>
              <p className="text-gray-500 font-semibold text-sm">Pending Claims</p>
              <p className="text-xs text-orange-600 mt-2 font-bold">1 requires action</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4"><CheckCircle size={24} /></div>
              <h3 className="text-4xl font-bold text-gray-900">8</h3>
              <p className="text-gray-500 font-semibold text-sm">Resolved Claims</p>
              <p className="text-xs text-gray-400 mt-2 font-bold">All time</p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-600 p-8 rounded-3xl text-white flex justify-between items-center cursor-pointer hover:shadow-xl hover:shadow-blue-200 transition-all group">
              <div className="text-left">
                <h4 className="text-xl font-bold mb-1">Browse Policies</h4>
                <p className="text-blue-100 text-sm opacity-90">Find the perfect coverage for you</p>
              </div>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
            </div>
            <div className="bg-purple-600 p-8 rounded-3xl text-white flex justify-between items-center cursor-pointer hover:shadow-xl hover:shadow-purple-200 transition-all group">
              <div className="text-left">
                <h4 className="text-xl font-bold mb-1">Get Recommendations</h4>
                <p className="text-purple-100 text-sm opacity-90">AI-powered policy suggestions</p>
              </div>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
            </div>
            <div onClick={() => setView('claim')} className="bg-green-600 p-8 rounded-3xl text-white flex justify-between items-center cursor-pointer hover:shadow-xl hover:shadow-green-200 transition-all group">
              <div className="text-left">
                <h4 className="text-xl font-bold mb-1">File a Claim</h4>
                <p className="text-green-100 text-sm opacity-90">Quick and easy claim submission</p>
              </div>
              <Plus className="group-hover:rotate-90 transition-transform" size={28} />
            </div>
          </div>

          {/* Tables Section - Styled to match original UI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            
            {/* Active Policies */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Active Policies</h3>
                <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Home Insurance Premium', sub: 'Home • Renews Jun 2026', price: '$1,200/year', status: 'Active' },
                  { name: 'Auto Comprehensive', sub: 'Auto • Renews Aug 2026', price: '$850/year', status: 'Active' },
                  { name: 'Life Insurance Plus', sub: 'Life • Renews Dec 2026', price: '$2,400/year', status: 'Active' }
                ].map((policy, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-gray-50/50 border border-gray-50 rounded-2xl hover:border-blue-100 transition-colors">
                    <div>
                      <p className="font-bold text-gray-900">{policy.name}</p>
                      <p className="text-xs text-gray-400 font-medium">{policy.sub}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{policy.price}</p>
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-tight">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Claims */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Claims</h3>
                <button className="text-blue-600 font-bold text-sm hover:underline flex items-center">View All <ArrowRight size={14} className="ml-1" /></button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50/50 border border-gray-100 rounded-2xl hover:border-orange-100 transition-colors">
                  <div>
                    <p className="font-bold text-gray-900 uppercase tracking-tighter">CLM-IDENTIFICIATION</p>
                    <p className="text-xs text-gray-400 font-medium">Auto • BIMA-4492-X</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">$3,500</p>
                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-tight italic">In Review</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50/50 border border-gray-100 rounded-2xl hover:border-green-100 transition-colors">
                  <div>
                    <p className="font-bold text-gray-900">CLM-2026-002</p>
                    <p className="text-xs text-gray-400 font-medium">Home • 2026-02-05</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">$1,200</p>
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-tight">Approved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Form View */
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl border border-gray-100 shadow-xl text-left">
          <button onClick={() => setView('dashboard')} className="flex items-center text-blue-600 mb-8 font-bold text-xs tracking-widest">
            <ArrowLeft size={16} className="mr-2" /> BACK TO DASHBOARD
          </button>
          <h2 className="text-3xl font-black text-gray-900 mb-6">File a New Claim</h2>
          <form className="space-y-8">
            <FromInput label="POLICY IDENTIFICATION" placeholder="e.g. BIMA-4492-X" />
            <Formselect label="CLAIM CATEGORY" options={[{ value: 'health', label: 'Health' }, { value: 'auto', label: 'Auto' }]} />
            <button type="button" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
              SUBMIT CLAIM
            </button>
          </form>
        </div>
      )}
    </PageContainer>
  );
}

export default App;