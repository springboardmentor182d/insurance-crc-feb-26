const TopAdjusters = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Top Adjusters</h2>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.approvalRate}% approval • {item.avgProcessingDays} days avg
              </p>
            </div>
            <p className="font-semibold">{item.totalClaims} claims</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopAdjusters;
