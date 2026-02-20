const RecentActivity = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-gray-500">
              {item.description}
            </p>
            <p className="text-xs text-gray-400">
              {item.timestamp}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
