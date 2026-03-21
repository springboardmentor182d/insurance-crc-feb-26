import { useEffect, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";
const fallbackDashboard = {
  profile: {
    name: "John Doe",
    age: "35 years",
    occupation: "Software Engineer",
    location: "New York, NY",
    coverage: ["Home Insurance", "Auto Insurance", "Life Insurance"]
  },
  tabs: [
    "All Recommendations",
    "High Priority",
    "Cost Savings",
    "Coverage Upgrades",
    "Additional Coverage"
  ],
  recommendations: [
    {
      icon: "heart",
      accent: "health",
      category: "High Priority",
      title: "Health Insurance Coverage Gap",
      description:
        "Based on your profile, we noticed you don't have health insurance. This is critical for comprehensive protection.",
      score: "95%",
      scoreLabel: "Match",
      policyLabel: "Recommended Policy",
      policyName: "Family Health Plan",
      provider: "HealthFirst",
      premium: "$3600/year",
      coverage: "$2,000,000",
      highlight: "Up to 15% discount for new customers",
      reasons: [
        "Age-appropriate coverage",
        "Covers pre-existing conditions",
        "Includes preventive care",
        "Family coverage available"
      ]
    },
    {
      icon: "car",
      accent: "auto",
      category: "Cost Savings",
      title: "Save on Auto Insurance",
      description:
        "We found a comparable auto policy that could save you $200/year while maintaining similar coverage.",
      score: "88%",
      scoreLabel: "Match",
      policyLabel: "Recommended Policy",
      policyName: "Auto Comprehensive Plus",
      provider: "DriveSecure",
      premium: "$850/year",
      coverage: "$250,000",
      highlight: "$200/year compared to current policy",
      reasons: [
        "Same coverage limits",
        "Better claim satisfaction rating",
        "Includes roadside assistance",
        "Lower deductible options"
      ]
    },
    {
      icon: "shield",
      accent: "life",
      category: "Coverage Upgrades",
      title: "Increase Life Insurance Coverage",
      description:
        "Your current life insurance may be insufficient. Consider increasing coverage to match your income.",
      score: "82%",
      scoreLabel: "Match",
      policyLabel: "Recommended Policy",
      policyName: "Life Insurance Premium",
      provider: "LifeGuard",
      premium: "$2800/year",
      coverage: "$1,500,000",
      highlight: "Better value per $100k coverage",
      reasons: [
        "Matches 10x annual income rule",
        "Cash value accumulation",
        "Living benefits included",
        "Premium guaranteed for 20 years"
      ]
    },
    {
      icon: "briefcase",
      accent: "disability",
      category: "Additional Coverage",
      title: "Consider Disability Insurance",
      description:
        "Protect your income in case of illness or injury. Essential for primary earners.",
      score: "78%",
      scoreLabel: "Match",
      policyLabel: "Recommended Policy",
      policyName: "Income Protection Plan",
      provider: "SecureIncome",
      premium: "$1200/year",
      coverage: "60% of income",
      highlight: "Tax-free benefits",
      reasons: [
        "Covers up to 60% of income",
        "Short and long-term options",
        "Covers partial disability",
        "No waiting period for accidents"
      ]
    }
  ],
  steps: [
    {
      number: "1",
      title: "Analyze Your Profile",
      text: "Our AI analyzes your age, location, occupation, and current coverage."
    },
    {
      number: "2",
      title: "Match Policies",
      text: "Compare thousands of policies to find the best matches for your needs."
    },
    {
      number: "3",
      title: "Personalized Results",
      text: "Get tailored recommendations with match scores and savings potential."
    }
  ]
};

function App() {
  const [dashboard, setDashboard] = useState(fallbackDashboard);
  const [activeTab, setActiveTab] = useState("All Recommendations");
  const [loading, setLoading] = useState(true);
  const [apiMode, setApiMode] = useState("loading");

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setApiMode("loading");

        const response = await fetch(`${API_BASE_URL}/api/recommendations`);
        if (!response.ok) {
          throw new Error("Unable to load recommendations");
        }

        const data = await response.json();
        if (!ignore) {
          setDashboard(data);
          setActiveTab(data.tabs[0] || "All Recommendations");
          setApiMode("connected");
        }
      } catch {
        if (!ignore) {
          setDashboard(fallbackDashboard);
          setActiveTab(fallbackDashboard.tabs[0]);
          setApiMode("fallback");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredRecommendations = dashboard
    ? dashboard.recommendations.filter((item) => {
        if (activeTab === "All Recommendations") return true;
        return item.category === activeTab;
      })
    : [];

  return (
    <div className="app-shell">
      <main className="page">
        <TopBar />
        <Hero />
        {loading && apiMode === "loading" ? (
          <section className="status-card">
            <h2>Loading recommendations...</h2>
            <p>Fetching profile and policy matches from the AI recommendation API.</p>
          </section>
        ) : (
          <>
            <ProfileCard profile={dashboard.profile} />
            <FilterTabs
              tabs={dashboard.tabs}
              activeTab={activeTab}
              onSelect={setActiveTab}
            />
            <div className="recommendations-list">
              {filteredRecommendations.map((item) => (
                <RecommendationCard key={item.title} item={item} />
              ))}
            </div>
            <HowItWorks steps={dashboard.steps} />
          </>
        )}
      </main>
    </div>
  );
}

function TopBar() {
  return (
    <header className="topbar">
      <button className="icon-button" aria-label="Open menu">
        <MenuIcon />
      </button>
      <div className="brand">
        <ShieldLogo className="brand-logo" />
        <span>BimaVerse</span>
      </div>
      <div className="topbar-spacer" />
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-card">
      <div className="hero-icon">
        <SparklesIcon />
      </div>
      <div>
        <h1>AI-Powered Recommendations</h1>
        <p>Personalized insurance suggestions based on your profile</p>
      </div>
    </section>
  );
}

function ProfileCard({ profile }) {
  return (
    <section className="profile-card">
      <div className="profile-header">
        <div>
          <h2>Your Profile</h2>
          <div className="profile-grid">
            <ProfileField label="Name" value={profile.name} />
            <ProfileField label="Age" value={profile.age} />
            <ProfileField label="Occupation" value={profile.occupation} />
            <ProfileField label="Location" value={profile.location} />
          </div>
        </div>
        <div className="profile-score">
          <span>Match Score</span>
          <strong>AI Analyzed</strong>
        </div>
      </div>
      <div className="coverage-row">
        <p>Current Coverage</p>
        <div className="coverage-tags">
          {profile.coverage.map((item) => (
            <span key={item} className="coverage-tag">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="profile-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FilterTabs({ tabs, activeTab, onSelect }) {
  return (
    <section className="filters-card">
      <div className="brand brand-inline">
        <ShieldLogo className="brand-logo" />
        <span>BimaVerse</span>
      </div>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "tab-active" : ""}`}
            type="button"
            onClick={() => onSelect(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </section>
  );
}

function RecommendationCard({ item }) {
  return (
    <article className="recommendation-card">
      <div className={`recommendation-icon recommendation-icon-${item.accent}`}>
        <FeatureIcon type={item.icon} />
      </div>
      <div className="recommendation-content">
        <div className="recommendation-head">
          <div>
            <div className="brand brand-inline">
              <ShieldLogo className="brand-logo small" />
              <span>BimaVerse</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
          <div className="match-badge">
            <TrendingIcon />
            <div>
              <strong>{item.score}</strong>
              <span>{item.scoreLabel}</span>
            </div>
          </div>
        </div>

        <div className="recommendation-body">
          <div className="policy-card">
            <span className="muted">{item.policyLabel}</span>
            <h4>{item.policyName}</h4>
            <p className="provider-name">{item.provider}</p>
            <div className="policy-grid">
              <span>Premium</span>
              <strong>{item.premium}</strong>
              <span>Coverage</span>
              <strong>{item.coverage}</strong>
            </div>
            <div className="policy-highlight">
              <CoinIcon />
              <span>{item.highlight}</span>
            </div>
          </div>

          <div className="reasons">
            <h5>Why we recommend this:</h5>
            <ul>
              {item.reasons.map((reason) => (
                <li key={reason}>
                  <CheckIcon />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="actions">
          <button className="button button-primary" type="button">
            Get Quote
            <ArrowRightIcon />
          </button>
          <button className="button button-secondary" type="button">
            Learn More
          </button>
          <button className="button button-ghost" type="button">
            Not Interested
          </button>
        </div>
      </div>
    </article>
  );
}

function HowItWorks({ steps }) {
  return (
    <section className="how-card">
      <h2>How AI Recommendations Work</h2>
      <div className="steps-grid">
        {steps.map((step) => (
          <div className="step-card" key={step.number}>
            <div className="step-badge">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ShieldLogo({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.5 18.5 5v5.9c0 4.6-2.8 8.8-6.5 10.6C8.3 19.7 5.5 15.5 5.5 10.9V5L12 2.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M19 3v4M21 5h-4M5 15l.9 2.1L8 18l-2.1.9L5 21l-.9-2.1L2 18l2.1-.9L5 15Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 15 4-4 3 3 7-7M14 7h5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8.3v7.4M14.5 10.2c0-.9-1.1-1.7-2.5-1.7s-2.5.8-2.5 1.7 1.1 1.6 2.5 1.6 2.5.8 2.5 1.7-1.1 1.7-2.5 1.7-2.5-.8-2.5-1.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12 4.2 4.2L19 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 20s-7-4.7-7-10.2C5 6.6 7.3 5 9.7 5c1.4 0 2.7.7 3.3 1.9C13.6 5.7 14.9 5 16.3 5 18.7 5 21 6.6 21 9.8 21 15.3 12 20 12 20Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 14h14l-1.4-4.1a2 2 0 0 0-1.9-1.4H8.3a2 2 0 0 0-1.9 1.4L5 14Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 14v3h2M18 17h2v-3M7 17a1 1 0 1 0 0 .01M17 17a1 1 0 1 0 0 .01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProtectionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5 18 6v5.2c0 4.1-2.5 7.8-6 9.3-3.5-1.5-6-5.2-6-9.3V6l6-2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 7V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8V7M4 9.5h16v8.7A1.8 1.8 0 0 1 18.2 20H5.8A1.8 1.8 0 0 1 4 18.2V9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 11.5c2.2 1.2 5 1.8 8 1.8s5.8-.6 8-1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FeatureIcon({ type }) {
  if (type === "heart") return <HeartIcon />;
  if (type === "car") return <CarIcon />;
  if (type === "shield") return <ProtectionIcon />;
  return <BriefcaseIcon />;
}

export default App;
saadhika