function Policies() {
  const policies = [
    { name: "Health Insurance", holder: "John Doe", status: "Active" },
    { name: "Auto Insurance", holder: "Jane Smith", status: "Active" },
    { name: "Life Insurance", holder: "Mike Johnson", status: "Pending" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Policies</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          {policies.map((policy, index) => (
            <div key={index} className="border rounded-xl p-4 flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{policy.name}</h3>
                <p className="text-gray-600">{policy.holder}</p>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm h-fit">
                {policy.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Policies;