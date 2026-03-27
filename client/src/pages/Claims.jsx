import React from 'react';
import { Upload, Info, CheckCircle, Clock, ClipboardList } from 'lucide-react';

const Claims = () => {
  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        
     
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Claims Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6">File a New Claim</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Select Policy</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer">
                      <option>Choose a policy</option>
                      <option>Comprehensive Health Shield</option>
                      <option>Smart Drive Insurance</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Claim Type</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer">
                      <option>Select claim type</option>
                      <option>Accident</option>
                      <option>Medical Emergency</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Claim Amount (₹)</label>
                  <input type="number" placeholder="Enter claim amount" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Description</label>
                  <textarea rows="3" placeholder="Describe your claim..." className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"></textarea>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Upload Documents</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                    <Upload size={20} className="text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-gray-600">Upload File</p>
                  </div>
                </div>

                <button className="w-full py-3.5 bg-[#14532d] text-white rounded-xl font-bold text-sm hover:bg-green-800 transition-all shadow-lg shadow-green-900/10 mt-4">
                  Submit Claim
                </button>
              </form>
            </div>
          </div>

       
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Claim Statistics</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Claims</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pending</p>
                    <p className="text-xl font-bold text-orange-500 flex items-center gap-2"><Clock size={16} /> 0</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Approved</p>
                    <p className="text-xl font-bold text-green-600 flex items-center gap-2"><CheckCircle size={16} /> 0</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100/50">
              <div className="flex items-center gap-2 mb-4">
                <Info size={16} className="text-green-700" />
                <h3 className="text-sm font-bold text-green-800">Required Documents</h3>
              </div>
              <ul className="space-y-3">
                {['Medical bills and receipts', 'Discharge summary', 'Diagnostic reports'].map((doc, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-green-700/80 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0"></div>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[350px] flex flex-col">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-bold text-gray-800">Claim Tracking</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ClipboardList className="text-gray-300" size={40} />
            </div>
            <p className="text-base font-semibold text-gray-500">No claims filed yet.</p>
            <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
              Your submitted claims will appear here for real-time tracking and status updates.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Claims;