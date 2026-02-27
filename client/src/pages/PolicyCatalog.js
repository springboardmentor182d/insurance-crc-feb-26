import PolicyCard from "./PolicyCard";

function PolicyCatalog() {

  const policies = [
    {
      id: 1,
      type: "Health",
      popular: true,
      name: "Premium Health Plus",
      provider: "HealthGuard",
      rating: 4.8,
      price: 450,
      coverage: "500K",
      deductible: "$1,000",
      benefits: [
        "Comprehensive coverage",
        "Dental included",
        "Vision care",
        "Wellness benefits"
      ]
    },
    {
      id: 2,
      type: "Life",
      popular: true,
      name: "Secure Life 500K",
      provider: "LifeSecure",
      rating: 4.6,
      price: 120,
      coverage: "500K",
      deductible: "N/A",
      benefits: [
        "Term life coverage",
        "Accidental death benefit",
        "Critical illness rider",
        "Flexible tenure"
      ]
    }
  ];

  return (
    <div className="page">

      {/* Title */}
      <h2>Policy Catalog</h2>
      <p className="subtitle">
        Browse and compare insurance policies from trusted providers
      </p>

      {/* FILTER CARD */}
      <div className="filter-card">

        <input
          className="search"
          placeholder="Search by policy name or provider..."
        />

        <div className="filters">
          <div>
            <label>Policy Type</label>
            <select>
              <option>All Types</option>
              <option>Health</option>
              <option>Life</option>
              <option>Vehicle</option>
            </select>
          </div>

          <div>
            <label>Provider</label>
            <select>
              <option>All Providers</option>
              <option>HealthGuard</option>
              <option>LifeSecure</option>
            </select>
          </div>

          <div>
            <label>Premium Range</label>
            <select>
              <option>All Ranges</option>
              <option>$0 - $200</option>
              <option>$200 - $500</option>
            </select>
          </div>

          <button className="more-btn">More Filters</button>
        </div>

        <p className="count">Showing {policies.length} policies</p>
      </div>

      {/* POLICY CARDS */}
      <div className="catalog">
        {policies.map(p => (
          <PolicyCard key={p.id} policy={p} />
        ))}
      </div>

    </div>
  );
}

export default PolicyCatalog;