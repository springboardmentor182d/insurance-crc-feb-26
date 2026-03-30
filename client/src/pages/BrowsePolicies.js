import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../layout/user/Sidebar';
import FromInput from '../components/Form/FormInput';
import { fetchPolicies } from '../features/policies/services/policiesService';

const CATEGORY_FILTERS = [
  { id: 'ALL', label: 'All' },
  { id: 'HOME', label: 'Home' },
  { id: 'AUTO', label: 'Auto' },
  { id: 'LIFE', label: 'Life' },
  { id: 'HEALTH', label: 'Health' },
];

const SAMPLE_POLICIES = [
  {
    id: 1,
    category: 'HOME',
    insurer_name: 'SafeGuard Insurance',
    name: 'Premium Home Protection',
    tagline: 'Comprehensive coverage for your home and belongings.',
    premium_annual: 1200,
    coverage_amount: 500000,
    deductible_amount: 1000,
    average_rating: 4.8,
    rating_count: 124,
    key_features: ['Fire & theft coverage', 'Natural disaster protection', 'Liability coverage'],
  },
  {
    id: 2,
    category: 'AUTO',
    insurer_name: 'DriveSecure',
    name: 'Comprehensive Auto Coverage',
    tagline: 'Peace of mind for every drive.',
    premium_annual: 850,
    coverage_amount: 250000,
    deductible_amount: 500,
    average_rating: 4.6,
    rating_count: 201,
    key_features: ['Collision coverage', 'Comprehensive coverage', 'Roadside assistance'],
  },
  {
    id: 3,
    category: 'LIFE',
    insurer_name: 'LifeGuard',
    name: 'Life Insurance Plus',
    tagline: 'Protect your family’s future.',
    premium_annual: 2400,
    coverage_amount: 1000000,
    deductible_amount: null,
    average_rating: 4.9,
    rating_count: 89,
    key_features: ['Term life coverage', 'Cash value accumulation', 'Living benefits'],
  },
  {
    id: 4,
    category: 'HEALTH',
    insurer_name: 'HealthFirst',
    name: 'Family Health Plan',
    tagline: 'Complete protection for your family.',
    premium_annual: 3600,
    coverage_amount: 2000000,
    deductible_amount: 2500,
    average_rating: 4.7,
    rating_count: 142,
    key_features: ['Preventive care', 'Emergency services', 'Prescription coverage'],
  },
  {
    id: 5,
    category: 'HOME',
    insurer_name: 'HomeShield',
    name: 'Basic Home Insurance',
    tagline: 'Essential coverage at an affordable price.',
    premium_annual: 800,
    coverage_amount: 300000,
    deductible_amount: 2000,
    average_rating: 4.4,
    rating_count: 76,
    key_features: ['Fire coverage', 'Theft protection', 'Liability coverage'],
  },
  {
    id: 6,
    category: 'AUTO',
    insurer_name: 'AutoProtect',
    name: 'Auto Essentials',
    tagline: 'Solid coverage for everyday driving.',
    premium_annual: 650,
    coverage_amount: 150000,
    deductible_amount: 1000,
    average_rating: 4.3,
    rating_count: 58,
    key_features: ['Liability coverage', 'Medical payments', 'Uninsured motorist'],
  },
];

const PolicyCard = ({ policy, selected, onToggleSelect }) => {
  const deductibleLabel =
    policy.deductible_amount != null ? `$${Number(policy.deductible_amount).toLocaleString()}` : 'N/A';

  const keyFeatures = useMemo(() => {
    if (Array.isArray(policy.key_features)) return policy.key_features;
    if (typeof policy.key_features === 'string') {
      return policy.key_features.split(',').map((f) => f.trim()).filter(Boolean);
    }
    return [];
  }, [policy.key_features]);

  const categoryLabel = policy.category?.toUpperCase() || '';

  return (
    <div
      className={`relative flex flex-col border-2 rounded-xl bg-white shadow-sm transition-all ${
        selected ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-gray-100">
        <div className="flex items-start space-x-3">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-[10px] font-semibold tracking-wide text-blue-600 uppercase text-center leading-tight px-1">
                {categoryLabel}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">{policy.insurer_name}</p>
            <h3 className="text-base font-bold text-gray-900">{policy.name}</h3>
            {policy.tagline && (
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">{policy.tagline}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleSelect}
          className={`w-6 h-6 flex items-center justify-center rounded-md border ${
            selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
          }`}
        >
          {selected && <span className="text-white text-xs">✓</span>}
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 mb-3">
          <div>
            <p className="text-gray-500">Premium</p>
            <p className="font-semibold text-gray-900">
              ${Number(policy.premium_annual).toLocaleString()}/year
            </p>
          </div>
          <div>
            <p className="text-gray-500">Coverage</p>
            <p className="font-semibold text-gray-900">
              ${Number(policy.coverage_amount).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Deductible</p>
            <p className="font-semibold text-gray-900">{deductibleLabel}</p>
          </div>
        </div>

        {policy.average_rating != null && (
          <div className="flex items-center text-xs text-gray-600 mb-3">
            <div className="flex text-yellow-400 mr-1">
              {'★★★★★'.slice(0, Math.round(Number(policy.average_rating)) || 0)}
            </div>
            <span className="font-semibold text-gray-900 mr-1">
              {Number(policy.average_rating).toFixed(1)}
            </span>
            {policy.rating_count != null && (
              <span className="text-gray-400">({policy.rating_count} reviews)</span>
            )}
          </div>
        )}

        {keyFeatures.length > 0 && (
          <div className="mt-1 mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1">Key Features:</p>
            <ul className="space-y-1 text-xs text-gray-600">
              {keyFeatures.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start space-x-1">
                  <span className="text-green-500 mt-[2px]">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-2">
          <button
            type="button"
            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Get Quote <span className="ml-1">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const BrowsePolicies = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [policies, setPolicies] = useState([]);
  const [selectedPolicyIds, setSelectedPolicyIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPolicies({ search, category: activeCategory });
      if (data && data.length > 0) {
        setPolicies(data);
      } else {
        setPolicies(SAMPLE_POLICIES);
      }
    } catch (err) {
      // If the backend is not available, fall back to demo data
      setPolicies(SAMPLE_POLICIES);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPolicies();
  };

  const handleToggleSelect = (policyId) => {
    setSelectedPolicyIds((prev) =>
      prev.includes(policyId) ? prev.filter((id) => id !== policyId) : [...prev, policyId],
    );
  };

  const handleClearSelection = () => setSelectedPolicyIds([]);

  // Apply category filter on the client as well so that
  // the All / Home / Auto / Life / Health buttons always
  // affect what the user sees, even when using demo data.
  const filteredPolicies = useMemo(() => {
    if (activeCategory === 'ALL') return policies;
    return policies.filter(
      (policy) => policy.category && policy.category.toUpperCase() === activeCategory,
    );
  }, [policies, activeCategory]);

  const selectedCount = selectedPolicyIds.length;

  if (loading && policies.length === 0) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading policies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Policy Catalog</h1>
            <p className="text-gray-600 text-sm">
              Browse and compare insurance policies
            </p>
          </div>

          {/* Search + Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center space-x-3">
              <div className="flex-1">
                <FromInput
                  type="text"
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search policies..."
                  className="mb-0"
                />
              </div>
            </form>

            <div className="flex items-center space-x-2">
              {CATEGORY_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveCategory(filter.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    activeCategory === filter.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selection Bar */}
          {selectedCount > 0 && (
            <div className="bg-blue-600 text-white rounded-xl px-4 py-3 mb-4 flex items-center justify-between shadow-sm">
              <span className="text-sm font-medium">
                {selectedCount} {selectedCount === 1 ? 'policy' : 'policies'} selected
              </span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-sm font-medium text-white/90 hover:text-white underline"
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg bg-white text-blue-600 px-3 py-1.5 text-sm font-semibold shadow hover:bg-blue-50"
                >
                  Compare Selected
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPolicies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                selected={selectedPolicyIds.includes(policy.id)}
                onToggleSelect={() => handleToggleSelect(policy.id)}
              />
            ))}
          </div>

          {!loading && policies.length === 0 && !error && (
            <div className="mt-8 text-center text-gray-500 text-sm">
              No policies found. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePolicies;

