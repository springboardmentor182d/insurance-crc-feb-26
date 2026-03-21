const http = require('http');

const POLICIES = [
  {
    id: 1,
    category: 'HOME',
    insurer_name: 'SafeGuard Insurance',
    name: 'Premium Home Protection',
    tagline: 'Comprehensive coverage for your home and belongings.',
    premium_annual: 1200,
    coverage_amount: 500000,
    deductible_amount: 1000,
    average_rating: 4.8,
    rating_count: 124,
    is_active: true,
    key_features: ['Fire & theft coverage', 'Natural disaster protection', 'Liability coverage'],
  },
  {
    id: 2,
    category: 'AUTO',
    insurer_name: 'DriveSecure',
    name: 'Comprehensive Auto Coverage',
    tagline: 'Peace of mind for every drive.',
    premium_annual: 850,
    coverage_amount: 250000,
    deductible_amount: 500,
    average_rating: 4.6,
    rating_count: 201,
    is_active: true,
    key_features: ['Collision coverage', 'Comprehensive coverage', 'Roadside assistance'],
  },
  {
    id: 3,
    category: 'HEALTH',
    insurer_name: 'HealthFirst',
    name: 'Family Health Plan',
    tagline: 'Complete health coverage for your entire family.',
    premium_annual: 3600,
    coverage_amount: 2000000,
    deductible_amount: 2500,
    average_rating: 4.7,
    rating_count: 156,
    is_active: true,
    key_features: ['Preventive care', 'Emergency services', 'Prescription coverage'],
  },
  {
    id: 4,
    category: 'HOME',
    insurer_name: 'HomeShield',
    name: 'Basic Home Insurance',
    tagline: 'Essential protection for renters and basic coverage.',
    premium_annual: 800,
    coverage_amount: 300000,
    deductible_amount: 2000,
    average_rating: 4.4,
    rating_count: 89,
    is_active: true,
    key_features: ['Fire coverage', 'Theft protection', 'Basic liability'],
  },
  {
    id: 5,
    category: 'AUTO',
    insurer_name: 'AutoProtect',
    name: 'Auto Essentials',
    tagline: 'Affordable auto insurance for budget-conscious drivers.',
    premium_annual: 650,
    coverage_amount: 150000,
    deductible_amount: 1000,
    average_rating: 4.3,
    rating_count: 172,
    is_active: true,
    key_features: ['Liability coverage', 'Medical payments', 'Uninsured motorist'],
  },
  {
    id: 6,
    category: 'LIFE',
    insurer_name: 'LifeGuard',
    name: 'Term Life Coverage',
    tagline: 'Affordable term life insurance for peace of mind.',
    premium_annual: 450,
    coverage_amount: 500000,
    deductible_amount: 0,
    average_rating: 4.9,
    rating_count: 267,
    is_active: true,
    key_features: ['Term life coverage', 'Cash value accumulation', 'Living benefits'],
  },
  {
    id: 7,
    category: 'HOME',
    insurer_name: 'ProHome Insurance',
    name: 'Deluxe Home Protection',
    tagline: 'Premium home coverage with additional living expenses.',
    premium_annual: 1600,
    coverage_amount: 750000,
    deductible_amount: 750,
    average_rating: 4.8,
    rating_count: 98,
    is_active: true,
    key_features: ['Extended coverage', 'Water damage protection', 'Emergency repair'],
  },
  {
    id: 8,
    category: 'AUTO',
    insurer_name: 'FastCover Auto',
    name: 'Premium Auto Shield',
    tagline: 'Maximum protection with all-inclusive auto coverage.',
    premium_annual: 1200,
    coverage_amount: 500000,
    deductible_amount: 250,
    average_rating: 4.7,
    rating_count: 145,
    is_active: true,
    key_features: ['Full coverage', '24/7 roadside assistance', 'Rental car coverage'],
  },
  {
    id: 9,
    category: 'HEALTH',
    insurer_name: 'WellCare',
    name: 'Individual Health Plan',
    tagline: 'Flexible health coverage tailored for individuals.',
    premium_annual: 2400,
    coverage_amount: 1500000,
    deductible_amount: 1500,
    average_rating: 4.5,
    rating_count: 203,
    is_active: true,
    key_features: ['Doctor visits', 'Lab work coverage', 'Specialist referrals'],
  },
  {
    id: 10,
    category: 'LIFE',
    insurer_name: 'SecureLife',
    name: 'Whole Life Insurance',
    tagline: 'Lifetime protection with guaranteed benefits.',
    premium_annual: 950,
    coverage_amount: 250000,
    deductible_amount: 0,
    average_rating: 4.6,
    rating_count: 112,
    is_active: true,
    key_features: ['Lifetime coverage', 'Surrender value', 'Policy loans available'],
  },
];

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', service: 'Mock Backend' }));
    return;
  }

  // Policies endpoint
  if (req.url.startsWith('/api/v1/policies')) {
    const url = new URL(req.url, `http://localhost:8000`);
    const searchParam = url.searchParams.get('search');
    const categoryParam = url.searchParams.get('category');

    let filtered = POLICIES;

    // Filter by category
    if (categoryParam && categoryParam !== 'ALL') {
      filtered = filtered.filter(p => p.category === categoryParam);
    }

    // Filter by search
    if (searchParam) {
      const lowerSearch = searchParam.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.insurer_name.toLowerCase().includes(lowerSearch) ||
          p.tagline.toLowerCase().includes(lowerSearch)
      );
    }

    res.writeHead(200);
    res.end(JSON.stringify(filtered));
    return;
  }

  // 404 for unknown routes
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(8000, () => {
  console.log('Mock backend server listening on http://localhost:8000');
});
