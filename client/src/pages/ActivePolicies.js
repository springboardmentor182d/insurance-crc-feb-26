import React, { useEffect, useState } from 'react';
import Sidebar from '../layout/Sidebar';
import { fetchActivePolicies, fetchActivePoliciesSummary } from '../features/policies/services/policiesService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

const SAMPLE_ACTIVE_POLICIES = [
  {
    id: 1,
    policyNumber: 'AUTO-2025-1234',
    status: 'Active',
    category: 'AUTO',
    insurerName: 'SafeDrive Insurance',
    productName: 'Comprehensive Auto Insurance',
    premiumAnnual: 850,
    coverageAmount: 250000,
    deductibleAmount: 500,
    startDate: '2025-01-15',
    endDate: '2026-01-15',
    isExpiringSoon: false,
    warningText: null,
  },
  {
    id: 2,
    policyNumber: 'HOME-2025-5678',
    status: 'Active',
    category: 'HOME',
    insurerName: 'HomeGuard Insurance',
    productName: 'Premium Home Protection',
    premiumAnnual: 1200,
    coverageAmount: 500000,
    deductibleAmount: 1000,
    startDate: '2025-03-01',
    endDate: '2026-03-01',
    isExpiringSoon: false,
    warningText: null,
  },
  {
    id: 3,
    policyNumber: 'LIFE-2031-9012',
    status: 'Active',
    category: 'LIFE',
    insurerName: 'LifeSecure',
    productName: 'Life Insurance Plus',
    premiumAnnual: 2400,
    coverageAmount: 1000000,
    deductibleAmount: null,
    startDate: '2024-02-10',
    endDate: '2026-02-28',
    isExpiringSoon: true,
    warningText:
      'Policy expiring soon! Your policy will expire on 2026-02-28. Consider renewing to maintain coverage.',
  },
];

const computeFallbackSummary = (policies) => {
  const activeCount = policies.length;
  const expiringSoonCount = policies.filter((p) => p.isExpiringSoon).length;
  const totalCoverage = policies.reduce((sum, p) => sum + (p.coverageAmount || 0), 0);
  const annualPremium = policies.reduce((sum, p) => sum + (p.premiumAnnual || 0), 0);

  return { activeCount, expiringSoonCount, totalCoverage, annualPremium };
};

const SummaryCard = ({ label, value, helper, valueClassName = '' }) => (
  <div className="flex-1 min-w-[180px] bg-white rounded-xl shadow-sm px-5 py-4">
    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
    {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
  </div>
);

const StatusPill = ({ text, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    categoryHome: 'bg-blue-50 text-blue-700',
    categoryAuto: 'bg-sky-50 text-sky-700',
    categoryLife: 'bg-purple-50 text-purple-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        variants[variant] || variants.default
      }`}
    >
      {text}
    </span>
  );
};

const ActivePolicyCard = ({ policy }) => {
  const deductibleLabel =
    policy.deductibleAmount !== null && policy.deductibleAmount !== undefined
      ? formatCurrency(policy.deductibleAmount)
      : 'N/A';

  const categoryVariant =
    policy.category === 'HOME'
      ? 'categoryHome'
      : policy.category === 'AUTO'
      ? 'categoryAuto'
      : policy.category === 'LIFE'
      ? 'categoryLife'
      : 'default';

  return (
    <div className="bg-white rounded-xl shadow-sm mb-4 border border-gray-100">
      {/* Top row */}
      <div className="flex items-start p-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 mr-4">
          <span className="text-blue-600 text-xl">🛡️</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-900 truncate">{policy.productName}</h3>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {policy.insurerName} • Policy #{policy.policyNumber}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill text={policy.status || 'Active'} variant="active" />
              <StatusPill text={policy.category} variant={categoryVariant} />
            </div>
          </div>
        </div>
      </div>

      {/* Warning banner */}
      {policy.isExpiringSoon && policy.warningText && (
        <div className="px-5 py-3 bg-yellow-50 border-b border-yellow-100 text-xs text-yellow-800 flex items-start space-x-2">
          <span className="mt-[2px]">⚠️</span>
          <p>{policy.warningText}</p>
        </div>
      )}

      {/* Details */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-gray-600">
          <div>
            <p className="text-gray-500 mb-1">Premium</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(policy.premiumAnnual)}
              <span className="text-gray-500 text-[11px] ml-1">/year</span>
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Coverage</p>
            <p className="font-semibold text-gray-900">{formatCurrency(policy.coverageAmount)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Deductible</p>
            <p className="font-semibold text-gray-900">{deductibleLabel}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Start Date</p>
            <p className="font-semibold text-gray-900 flex items-center space-x-1">
              <span>📅</span>
              <span>{formatDate(policy.startDate)}</span>
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">End Date</p>
            <p className="font-semibold text-gray-900 flex items-center space-x-1">
              <span>📅</span>
              <span>{formatDate(policy.endDate)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          <span className="mr-1">👁️</span> View Details
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          ⬇️ Download Policy
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-full border border-transparent px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
        >
          📝 File Claim
        </button>
      </div>
    </div>
  );
};

const ActivePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [policiesRes, summaryRes] = await Promise.allSettled([
        fetchActivePolicies(),
        fetchActivePoliciesSummary(),
      ]);

      if (policiesRes.status === 'fulfilled' && Array.isArray(policiesRes.value) && policiesRes.value.length > 0) {
        // Normalize field names to match the UI expectations
        const normalized = policiesRes.value.map((p) => ({
          id: p.id,
          policyNumber: p.policy_number,
          status: p.status,
          category: p.category,
          insurerName: p.insurer_name,
          productName: p.product_name,
          premiumAnnual: p.premium_annual,
          coverageAmount: p.coverage_amount,
          deductibleAmount: p.deductible_amount,
          startDate: p.start_date,
          endDate: p.end_date,
          isExpiringSoon: p.is_expiring_soon,
          warningText: p.warning_text,
        }));
        setPolicies(normalized);
      } else {
        setPolicies(SAMPLE_ACTIVE_POLICIES);
      }

      if (summaryRes.status === 'fulfilled' && summaryRes.value) {
        setSummary({
          activeCount: summaryRes.value.active_count,
          expiringSoonCount: summaryRes.value.expiring_soon_count,
          totalCoverage: summaryRes.value.total_coverage,
          annualPremium: summaryRes.value.annual_premium,
        });
      } else {
        setSummary(computeFallbackSummary(SAMPLE_ACTIVE_POLICIES));
      }
    } catch (err) {
      // Fallback to sample data if backend is down
      setPolicies(SAMPLE_ACTIVE_POLICIES);
      setSummary(computeFallbackSummary(SAMPLE_ACTIVE_POLICIES));
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && policies.length === 0) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading active policies...</p>
          </div>
        </div>
      </div>
    );
  }

  const effectiveSummary = summary || computeFallbackSummary(policies.length ? policies : SAMPLE_ACTIVE_POLICIES);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">My Active Policies</h1>
            <p className="text-gray-600 text-sm">View and manage your insurance policies</p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              label="Active Policies"
              value={effectiveSummary.activeCount}
              helper="Policies currently in force"
            />
            <SummaryCard
              label="Expiring Soon"
              value={effectiveSummary.expiringSoonCount}
              helper="Policies expiring in the next 30 days"
              valueClassName="text-yellow-600"
            />
            <SummaryCard
              label="Total Coverage"
              value={formatCurrency(effectiveSummary.totalCoverage)}
              helper="Combined coverage limit"
              valueClassName="text-emerald-600"
            />
            <SummaryCard
              label="Annual Premium"
              value={formatCurrency(effectiveSummary.annualPremium)}
              helper="Total yearly premium"
              valueClassName="text-purple-600"
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Policy list */}
          <div className="mt-2">
            {policies.map((policy) => (
              <ActivePolicyCard key={policy.id} policy={policy} />
            ))}

            {policies.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 text-sm text-gray-600 mt-4">
                You don't have any active policies yet. Browse the catalog to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivePolicies;

