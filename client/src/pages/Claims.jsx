function Claims() {
  const claims = [
    { name: "Sarah Wilson", type: "Health Insurance", amount: "$5,000" },
    { name: "Tom Brown", type: "Auto Insurance", amount: "$3,500" },
    { name: "Emily Davis", type: "Life Insurance", amount: "$7,200" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Claims</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          {claims.map((claim, index) => (
            <div key={index} className="border rounded-xl p-4 flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{claim.name}</h3>
                <p className="text-gray-600">{claim.type}</p>
              </div>
              <p className="font-bold">{claim.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Claims;