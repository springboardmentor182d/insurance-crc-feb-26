import React, { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import { Link } from "react-router-dom";
import PageContainer from "../layout/PageContainer";
import {
  FileText, Activity, AlertCircle, CheckCircle,
  ArrowRight, Plus
} from 'lucide-react';

function DashboardPage() {

  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);

  // 🔥 Helper mappings
  const policyNames = {
    HOME: "Home Insurance Premium",
    AUTO: "Auto Comprehensive",
    LIFE: "Life Insurance Plus"
  };

  const statusMap = {
    PENDING: "In Review",
    APPROVED: "Approved"
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString('default', {
      month: 'short',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await apiClient.get("/admin/policies");
        setPolicies(pRes.data);

        const cRes = await apiClient.get("/admin/claims");
        setClaims(cRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // --- CALCULATIONS ---
  const totalActivePolicies = policies.length;

  const rawCoverageSum = policies.reduce((sum, p) => {
    return sum + (parseFloat(p.coverage_amount) || 0);
  }, 0);

  const pendingClaimsCount = claims.filter(
    c => c.status?.toUpperCase() === 'PENDING'
  ).length;

  const resolvedClaimsCount = claims.filter(
    c => c.status?.toUpperCase() === 'APPROVED'
  ).length;

  // Last 30 days
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const resolvedLast30Days = claims.filter(c => {
    const date = new Date(c.created_at);
    return c.status?.toUpperCase() === 'APPROVED' && date >= last30Days;
  }).length;

  // Policy trend
  const currentMonth = new Date().getMonth();
  const newPoliciesThisMonth = policies.filter(p => {
    return new Date(p.created_at).getMonth() === currentMonth;
  }).length;

  const policyTrend = newPoliciesThisMonth > 0
    ? `+${newPoliciesThisMonth} this month`
    : "No new policies";

  const coverageTrend = rawCoverageSum > 0
    ? `${(rawCoverageSum / 1000000).toFixed(1)}M vs last year`
    : "No data";

  return (
    <PageContainer>
    <div className="w-full animate-in fade-in duration-700">

      {/* Header */}
      <div className="mb-8 text-left">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back, John!</h1>
        <p className="text-gray-500 mt-1 font-medium">
          Overview of your insurance portfolio
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <FileText className="mb-3 text-blue-600" />
          <h3 className="text-4xl font-bold">{totalActivePolicies}</h3>
          <p className="text-gray-500 text-sm">Active Policies</p>
          <p className="text-xs text-blue-600 mt-2 font-bold">{policyTrend}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <Activity className="mb-3 text-green-600" />
          <h3 className="text-4xl font-bold">
            ${(rawCoverageSum / 1000000).toFixed(1)}M
          </h3>
          <p className="text-gray-500 text-sm">Total Coverage</p>
          <p className="text-xs text-green-600 mt-2 font-bold">{coverageTrend}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <AlertCircle className="mb-3 text-orange-600" />
          <h3 className="text-4xl font-bold">{pendingClaimsCount}</h3>
          <p className="text-gray-500 text-sm">Pending Claims</p>
          <p className="text-xs text-orange-600 mt-2 font-bold">
            {pendingClaimsCount > 0
              ? `${pendingClaimsCount} requires action`
              : "All clear"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <CheckCircle className="mb-3 text-emerald-600" />
          <h3 className="text-4xl font-bold">{resolvedClaimsCount}</h3>
          <p className="text-gray-500 text-sm">Resolved Claims</p>
          <p className="text-xs text-emerald-600 mt-2 font-bold">
            {resolvedLast30Days} in last 30 days
          </p>
        </div>

      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <Link to="/policies" className="bg-blue-600 p-8 rounded-3xl text-white flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold">Browse Policies</h4>
            <p className="text-sm">Find the perfect coverage</p>
          </div>
          <ArrowRight />
        </Link>

        <Link to="/recommendations" className="bg-purple-600 p-8 rounded-3xl text-white flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold">Recommendations</h4>
            <p className="text-sm">AI-powered suggestions</p>
          </div>
          <ArrowRight />
        </Link>

        <Link to="/claims" className="bg-green-600 p-8 rounded-3xl text-white flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold">File a Claim</h4>
            <p className="text-sm">Quick submission</p>
          </div>
          <Plus />
        </Link>

      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Policies */}
       <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
  
  {/* Header */}
  <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
    <h3 className="text-lg font-bold text-gray-900">Active Policies</h3>
    <Link 
  to="/Activepolicies" 
  className="text-blue-600 text-sm font-semibold hover:underline"
>
  View All
</Link>
  </div>

  {/* List */}
  <div className="p-6 space-y-4">
    {policies.map((policy, i) => (
      <div
        key={i}
        className="flex justify-between items-center bg-gray-50 p-4 rounded-xl"
      >
        <div>
          <p className="font-semibold text-gray-900">
            {policyNames[policy.policy_type?.toUpperCase()] || policy.policy_type}
          </p>
          <p className="text-sm text-gray-500">
            {policy.policy_type?.toLowerCase()} • Renews {formatDate(policy.end_date)}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold text-gray-900">
            ${policy.premium_amount}/year
          </p>
          <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
            Active
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
  

        {/* Claims */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
  
  {/* Header */}
  <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
    <h3 className="text-lg font-bold text-gray-900">Recent Claims</h3>
    <Link 
  to="/claims" 
  className="text-blue-600 text-sm font-semibold hover:underline"
>
  View All →
</Link>
  </div>

  {/* List */}
  <div className="p-6 space-y-4">
    {claims.map((claim, i) => (
      <div
        key={i}
        className="flex justify-between items-center bg-gray-50 p-4 rounded-xl"
      >
        <div>
          <p className="font-semibold text-gray-900">
            {claim.claim_number}
          </p>
          <p className="text-sm text-gray-500">
            {claim.description} • {formatDate(claim.created_at)}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold text-gray-900">
            ${claim.claim_amount}
          </p>

          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              claim.status?.toUpperCase() === "APPROVED"
                ? "bg-green-100 text-green-600"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            {statusMap[claim.status?.toUpperCase()] || claim.status}
          </span>
        </div>
      </div>
       ))}
     </div>
    </div>
   </div>
   </div>
  </PageContainer>
  );
}

export default DashboardPage;