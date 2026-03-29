import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FormInput from '../components/Form/FormInput';
import {
  createExternalActivePolicy,
  fetchPolicies,
  fetchActivePolicies,
} from '../features/policies/services/policiesService';
import Sidebar from '../layout/user/Sidebar';
import { formatCurrency } from '../utils/formatCurrency';

const CATEGORY_FILTERS = [
  { id: 'ALL', label: 'All' },
  { id: 'HOME', label: 'Home' },
  { id: 'AUTO', label: 'Auto' },
  { id: 'LIFE', label: 'Life' },
  { id: 'HEALTH', label: 'Health' },
];

const formatAsIsoDate = (date) => date.toISOString().split('T')[0];

const oneYearFrom = (date) => {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + 1);
  return next;
};

const normalizeFeatures = (features) => {
  if (Array.isArray(features)) return features;
  if (typeof features === 'string') {
    return features
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const PolicyCard = ({ policy, selected, onToggleSelect, onGetQuote, isAdded  }) => {
  const deductibleLabel =
    policy.deductible_amount != null
      ? formatCurrency(policy.deductible_amount)
      : 'N/A';

  const keyFeatures = useMemo(
    () => normalizeFeatures(policy.key_features),
    [policy.key_features],
  );

  const categoryLabel = policy.category?.toUpperCase() || '';

  return (
    <div
      className={`relative flex flex-col border-2 rounded-xl bg-white shadow-sm transition-all ${
        selected
          ? 'border-blue-600 ring-2 ring-blue-100'
          : 'border-gray-200 hover:border-blue-300'
      }`}
    >
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
            <p className="text-xs font-semibold text-gray-500 mb-1">
              {policy.insurer_name}
            </p>
            <h3 className="text-base font-bold text-gray-900">{policy.name}</h3>
            {policy.tagline && (
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                {policy.tagline}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleSelect}
          className={`w-6 h-6 flex items-center justify-center rounded-md border ${
            selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
          }`}
          aria-label={selected ? 'Deselect policy' : 'Select policy'}
        >
          {selected && <span className="text-white text-xs">OK</span>}
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 mb-3">
          <div>
            <p className="text-gray-500">Premium</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(policy.premium_annual)}/year
            </p>
          </div>
          <div>
            <p className="text-gray-500">Coverage</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(policy.coverage_amount)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Deductible</p>
            <p className="font-semibold text-gray-900">{deductibleLabel}</p>
          </div>
        </div>

        {policy.average_rating != null && (
          <div className="flex items-center text-xs text-gray-600 mb-3">
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
                  <span className="text-green-500 mt-[2px]">+</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto pt-2">
          {isAdded ? (
            <button
              type="button"
              disabled
              className="w-full inline-flex items-center justify-center rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 cursor-not-allowed"
            >
              ✓ Already in My Policies
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onGetQuote(policy)}
              className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Get Quote <span className="ml-1">{'>'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const BrowsePolicies = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [policies, setPolicies] = useState([]);
  const [selectedPolicyIds, setSelectedPolicyIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectionError, setSelectionError] = useState('');

  const [quotePolicy, setQuotePolicy] = useState(null);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [alreadyAddedIds, setAlreadyAddedIds] = useState(new Set());

  const loadPolicies = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchPolicies({ search, category: activeCategory });
      setPolicies(Array.isArray(data) ? data : []);
    } catch {
      setPolicies([]);
      setError('Unable to load catalog policies from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  useEffect(() => {
    const loadAlreadyAdded = async () => {
      try {
        const active = await fetchActivePolicies();
        const ids = new Set(active.map((p) => p.policy_id).filter(Boolean));
        setAlreadyAddedIds(ids);
      } catch {
        // silently ignore
      }
    };
    loadAlreadyAdded();
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    loadPolicies();
  };

  const handleToggleSelect = (policyId) => {
    setSelectionError('');
    setSelectedPolicyIds((prev) =>
      prev.includes(policyId)
        ? prev.filter((id) => id !== policyId)
        : [...prev, policyId],
    );
  };

  const handleClearSelection = () => {
    setSelectionError('');
    setSelectedPolicyIds([]);
  };

  const filteredPolicies = useMemo(() => {
    if (activeCategory === 'ALL') return policies;
    return policies.filter(
      (policy) => policy.category && policy.category.toUpperCase() === activeCategory,
    );
  }, [policies, activeCategory]);

  const selectedPolicies = useMemo(
    () => policies.filter((policy) => selectedPolicyIds.includes(policy.id)),
    [policies, selectedPolicyIds],
  );

  const openCompare = () => {
    if (selectedPolicies.length < 2) {
      setSelectionError('Select at least 2 policies to compare.');
      return;
    }
    setSelectionError('');
    setIsCompareOpen(true);
  };

  const closeCompare = () => setIsCompareOpen(false);

  const openQuote = (policy) => {
    setQuoteError('');
    setQuotePolicy(policy);
  };

  const closeQuote = () => {
    setQuotePolicy(null);
    setQuoteError('');
    setQuoteSubmitting(false);
  };

  const handleAddQuoteToActive = async () => {
    if (!quotePolicy) return;

    try {
      setQuoteSubmitting(true);
      setQuoteError('');

      const startDate = new Date();
      const endDate = oneYearFrom(startDate);
      const uniqueSuffix = Date.now().toString().slice(-6);

      const payload = {
        policy_id: quotePolicy.id,
        policy_number: `Q-${quotePolicy.id}-${uniqueSuffix}`,
        status: 'ACTIVE',
        category: (quotePolicy.category || 'AUTO').toUpperCase(),
        insurer_name: quotePolicy.insurer_name || 'BimaVerse Insurance',
        product_name: quotePolicy.name || 'Insurance Policy',
        premium_annual: Number(quotePolicy.premium_annual || 0),
        coverage_amount: Number(quotePolicy.coverage_amount || 0),
        deductible_amount:
          quotePolicy.deductible_amount != null
            ? Number(quotePolicy.deductible_amount)
            : null,
        start_date: formatAsIsoDate(startDate),
        end_date: formatAsIsoDate(endDate),
        tags: 'Added from policy catalog quote',
        warning_text: null,
      };

      await createExternalActivePolicy(payload);
      setAlreadyAddedIds((prev) => new Set(prev).add(quotePolicy.id));
      closeQuote();
      navigate('/policies/active');
    } catch (requestError) {
      if (requestError?.response?.status === 409) {
        setAlreadyAddedIds((prev) => new Set(prev).add(quotePolicy.id));
        setQuoteError('This policy is already in your active policies.');
      } else {
        setQuoteError(
          requestError?.response?.data?.detail ||
            'Failed to add quote to active policies.',
        );
      }
    } finally {
      setQuoteSubmitting(false);
    }
  };

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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Policy Catalog</h1>
            <p className="text-gray-600 text-sm">
              Browse admin-side active policies, compare options, and get quotes.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center space-x-3">
              <div className="flex-1">
                <FormInput
                  type="text"
                  name="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
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
                  onClick={openCompare}
                  className="inline-flex items-center rounded-lg bg-white text-blue-600 px-3 py-1.5 text-sm font-semibold shadow hover:bg-blue-50"
                >
                  Compare Selected
                </button>
              </div>
            </div>
          )}

          {selectionError && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
              {selectionError}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPolicies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                selected={selectedPolicyIds.includes(policy.id)}
                onToggleSelect={() => handleToggleSelect(policy.id)}
                onGetQuote={openQuote}
                isAdded={alreadyAddedIds.has(policy.id)}
              />
            ))}
          </div>

          {!loading && filteredPolicies.length === 0 && !error && (
            <div className="mt-8 text-center text-gray-500 text-sm">
              No policies found. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>

      {isCompareOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Policy Comparison</h2>
              <button
                type="button"
                onClick={closeCompare}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <div className="overflow-auto p-6">
              <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 border-b border-gray-200 w-48">Metric</th>
                    {selectedPolicies.map((policy) => (
                      <th key={policy.id} className="text-left px-4 py-3 border-b border-gray-200 min-w-[220px]">
                        <div className="font-semibold text-gray-900">{policy.name}</div>
                        <div className="text-xs text-gray-500">{policy.insurer_name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-700">Category</td>
                    {selectedPolicies.map((policy) => (
                      <td key={`cat-${policy.id}`} className="px-4 py-3 text-gray-700">{policy.category}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-700">Annual Premium</td>
                    {selectedPolicies.map((policy) => (
                      <td key={`premium-${policy.id}`} className="px-4 py-3 text-gray-700">
                        {formatCurrency(policy.premium_annual)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-700">Estimated Monthly</td>
                    {selectedPolicies.map((policy) => (
                      <td key={`monthly-${policy.id}`} className="px-4 py-3 text-gray-700">
                        {formatCurrency(Number(policy.premium_annual || 0) / 12)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-700">Coverage Amount</td>
                    {selectedPolicies.map((policy) => (
                      <td key={`coverage-${policy.id}`} className="px-4 py-3 text-gray-700">
                        {formatCurrency(policy.coverage_amount)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-700">Deductible</td>
                    {selectedPolicies.map((policy) => (
                      <td key={`deductible-${policy.id}`} className="px-4 py-3 text-gray-700">
                        {policy.deductible_amount != null
                          ? formatCurrency(policy.deductible_amount)
                          : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">Key Features</td>
                    {selectedPolicies.map((policy) => (
                      <td key={`features-${policy.id}`} className="px-4 py-3 text-gray-700">
                        {normalizeFeatures(policy.key_features).slice(0, 4).join(', ') || 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {quotePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Quote Summary</h2>
              <button
                type="button"
                onClick={closeQuote}
                className="text-gray-500 hover:text-gray-700"
                disabled={quoteSubmitting}
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">{quotePolicy.name}</h3>
                <p className="text-sm text-gray-500">{quotePolicy.insurer_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500">Category</p>
                  <p className="font-semibold text-gray-900">{quotePolicy.category}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500">Annual Premium</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(quotePolicy.premium_annual)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500">Estimated Monthly Premium</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(Number(quotePolicy.premium_annual || 0) / 12)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500">Coverage Amount</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(quotePolicy.coverage_amount)}
                  </p>
                </div>
              </div>

              {quoteError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {quoteError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeQuote}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                  disabled={quoteSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddQuoteToActive}
                  className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                  disabled={quoteSubmitting}
                >
                  {quoteSubmitting ? 'Adding...' : 'Add To My Active Policies'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowsePolicies;
