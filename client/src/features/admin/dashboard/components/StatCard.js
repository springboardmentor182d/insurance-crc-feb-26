const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <div className="mt-3">
        <h2 className="text-3xl font-semibold text-gray-800 mt-3">
          {value}
        </h2>
      </div>

    </div>
  );
};

export default StatCard;