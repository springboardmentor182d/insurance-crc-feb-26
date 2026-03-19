// PolicyFilters.jsx
// Filter bar component for the policy catalog (by category, coverage type, price range)

const CATEGORIES = ["All", "Health", "Auto", "Home", "Life", "Travel"];

const PolicyFilters = ({ activeCategory, onCategoryChange, searchQuery, onSearchChange }) => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search policies by name or provider..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
      />

      {/* Category filter pills */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md shadow-purple-200"
                : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PolicyFilters;
