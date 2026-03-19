// PolicyCard.jsx
// Reusable card component for displaying a single insurance policy in the catalog

const PolicyCard = ({ policy, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{policy.name}</h3>
          <p className="text-sm text-gray-500">{policy.provider}</p>
        </div>
        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
          {policy.category}
        </span>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{policy.description}</p>

      <div className="flex justify-between items-center pt-2 border-t border-gray-50">
        <div>
          <p className="text-xs text-gray-400">Coverage</p>
          <p className="text-sm font-bold text-gray-800">{policy.coverage}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Premium</p>
          <p className="text-sm font-bold text-gray-800">{policy.premium}/mo</p>
        </div>
        <button
          onClick={() => onViewDetails && onViewDetails(policy)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PolicyCard;
