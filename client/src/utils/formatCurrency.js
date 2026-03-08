export const formatCurrency = (value, options = {}) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return 'N/A';
  }

  const { currency = 'USD' } = options;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(Number(value));
  } catch {
    return `$${Number(value).toLocaleString()}`;
  }
};

