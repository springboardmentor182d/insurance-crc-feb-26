function Analytics() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-gray-500">Monthly Revenue</h2>
          <p className="text-3xl font-bold mt-2">$25,000</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-gray-500">Active Customers</h2>
          <p className="text-3xl font-bold mt-2">1,248</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-gray-500">Pending Claims</h2>
          <p className="text-3xl font-bold mt-2">89</p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;