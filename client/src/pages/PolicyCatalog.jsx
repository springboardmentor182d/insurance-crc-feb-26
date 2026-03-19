import React, { useState } from "react";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PolicyCard from "../features/policy-catalog/components/PolicyCard";
import PolicyFilters from "../features/policy-catalog/components/PolicyFilters";
import usePolicies from "../features/policy-catalog/hooks/usePolicies";

export default function PolicyCatalog() {
  const navigate = useNavigate();
  const { policies, loading, error } = usePolicies();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPolicies = policies.filter((policy) => {
    const matchesCategory =
      activeCategory === "All" || policy.category === activeCategory;
    const matchesSearch =
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F4F5F7]">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#FCFCFD] p-6 shadow-sm border-r border-gray-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="InsureLogic Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold text-gray-800">InsureLogic</h1>
          </div>
          <nav className="flex flex-col gap-1">
            {[
              { name: "Dashboard", path: "/dashboard" },
              { name: "Browse Policies", path: "/policy-catalog" },
              { name: "My Policies", path: "/" },
              { name: "Claims", path: "/" },
              { name: "Profile", path: "/" },
            ].map((item) => (
              <div
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                  item.name === "Browse Policies"
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md shadow-purple-200"
                    : "hover:bg-purple-50 text-gray-600 hover:text-purple-600"
                }`}
              >
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 px-10 py-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-800">Policy Catalog</h2>
            <p className="text-sm text-gray-500 mt-1">Browse all available insurance plans</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <FiUser className="text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Active User</span>
            </div>
            <button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-md hover:opacity-90 transition-opacity"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <PolicyFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 text-sm">
            ⚠️ Could not load policies: {error}
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-20 text-gray-400 text-sm">Loading policies...</div>
        )}

        {/* POLICY GRID */}
        {!loading && (
          <>
            {filteredPolicies.length === 0 ? (
              <div className="text-center py-20 text-gray-400 text-sm">
                No policies found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPolicies.map((policy) => (
                  <PolicyCard
                    key={policy.id}
                    policy={policy}
                    onViewDetails={(p) => alert(`Viewing details for: ${p.name}`)}
                  />
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-6 text-right">
              Showing {filteredPolicies.length} of {policies.length} policies
            </p>
          </>
        )}
      </div>
    </div>
  );
}
