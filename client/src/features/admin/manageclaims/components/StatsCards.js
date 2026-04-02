import '../styles/manageClaims.css';

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total Claims',
      value: stats.total,
      className: 'claims-stat-card claims-stat-card--total',
      valueClass: 'claims-stat-value',
      labelClass: 'claims-stat-label',
    },
    {
      label: 'Under Review',
      value: stats.under_review,
      className: 'claims-stat-card claims-stat-card--review',
      valueClass: 'claims-stat-value claims-stat-value--review',
      labelClass: 'claims-stat-label claims-stat-label--review',
    },
    {
      label: 'Approved',
      value: stats.approved,
      className: 'claims-stat-card claims-stat-card--approved',
      valueClass: 'claims-stat-value claims-stat-value--approved',
      labelClass: 'claims-stat-label claims-stat-label--approved',
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      className: 'claims-stat-card claims-stat-card--rejected',
      valueClass: 'claims-stat-value claims-stat-value--rejected',
      labelClass: 'claims-stat-label claims-stat-label--rejected',
    },
  ];

  return (
    <div className="claims-stats-grid">
      {cards.map((card) => (
        <div key={card.label} className={card.className}>
          <p className={card.labelClass}>{card.label}</p>
          <p className={card.valueClass}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;