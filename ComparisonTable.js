import React from 'react';

const ComparisonTable = ({ plans }) => {
  if (!plans || plans.length === 0) {
    return <p>No plans selected for comparison</p>;
  }

  // Get all keys from all plans
  const allKeys = new Set();
  plans.forEach(plan => {
    Object.keys(plan).forEach(key => allKeys.add(key));
  });

  const keys = Array.from(allKeys).filter(key => key !== 'features');

  return (
    <div className="comparison-table-container">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Feature</th>
            {plans.map((plan, index) => (
              <th key={index}>{plan.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key}>
              <td className="feature-name">{key.replace(/_/g, ' ').toUpperCase()}</td>
              {plans.map((plan, index) => (
                <td key={index}>
                  {typeof plan[key] === 'number' && (key === 'price' || key === 'coverage' || key === 'deductible') 
                    ? `$${plan[key]}` 
                    : String(plan[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
