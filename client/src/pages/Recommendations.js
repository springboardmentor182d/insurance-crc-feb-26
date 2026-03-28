import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import Sidebar from "../layout/user/Sidebar";
import { ROUTES } from "../data/constants";
// ── Use the exact same service as ActivePolicies.js ───────────────────────────
import { fetchActivePolicies } from "../features/policies/services/policiesService";
import "./Recommendations.css";

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  HEALTH: "🩺",
  LIFE:   "🛡️",
  AUTO:   "🚗",
  HOME:   "🏠",
};

const PRIORITY_META = {
  high:   { label: "High Priority",   cls: "badge-high"   },
  medium: { label: "Medium Priority", cls: "badge-medium" },
  low:    { label: "Low Priority",    cls: "badge-low"    },
};

const TABS = [
  { label: "All Recommendations", value: null                  },
  { label: "High Priority",       value: "high_priority"       },
  { label: "Cost Savings",        value: "cost_savings"        },
  { label: "Coverage Upgrades",   value: "coverage_upgrades"   },
  { label: "Additional Coverage", value: "additional_coverage" },
];

// ── Dummy fallback recommendations ────────────────────────────────────────────
const DUMMY_RECOMMENDATIONS = [
  {
    id: "dummy-1",
    title: "Health Insurance Coverage Gap",
    policy: "Family Health Plan",
    provider: "BimaVerse Insurance",
    premium: "$3,600/year",
    coverage: "$500,000",
    match: "95%",
    priority: "high",
    category: "high_priority",
    policyCategory: "HEALTH",
    benefits: [
      "Age-appropriate coverage",
      "Covers pre-existing conditions",
      "Includes preventive care",
      "Family coverage available",
    ],
  },
  {
    id: "dummy-2",
    title: "Save on Auto Insurance",
    policy: "Comprehensive Auto Plan",
    provider: "Shield General Insurance",
    premium: "$1,200/year",
    coverage: "$150,000",
    match: "88%",
    priority: "medium",
    category: "cost_savings",
    policyCategory: "AUTO",
    benefits: [
      "Same coverage limits as your current plan",
      "Better claim satisfaction rating",
      "Includes roadside assistance",
      "Lower deductible options",
    ],
  },
  {
    id: "dummy-3",
    title: "Increase Life Insurance Coverage",
    policy: "Term Life 20-Year Plan",
    provider: "SecureLife Insurance",
    premium: "$2,400/year",
    coverage: "$1,000,000",
    match: "82%",
    priority: "high",
    category: "coverage_upgrades",
    policyCategory: "LIFE",
    benefits: [
      "Matches 10x annual income rule",
      "Cash value accumulation",
      "Living benefits included",
      "Premium guaranteed for 20 years",
    ],
  },
  {
    id: "dummy-4",
    title: "Home Contents Protection",
    policy: "Home Contents Shield",
    provider: "HomeSafe Insurance",
    premium: "$900/year",
    coverage: "$200,000",
    match: "74%",
    priority: "low",
    category: "additional_coverage",
    policyCategory: "HOME",
    benefits: [
      "Covers theft and damage",
      "Includes electronics and jewellery",
      "No-claims discount available",
      "24/7 claims support",
    ],
  },
];

// ── API helpers ───────────────────────────────────────────────────────────────
async function fetchRecommendations(category) {
  const params = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await apiClient.get(`/recommendations${params}`);
  return res.data;
}

async function fetchUserProfile() {
  try {
    const res = await apiClient.get("/users/profile");
    return res.data;
  } catch {
    return null;
  }
}

// ── Coverage Score Badge ──────────────────────────────────────────────────────
function ScoreBadge({ covered, total }) {
  const pct = total > 0 ? Math.round((covered / total) * 100) : 0;
  return (
    <div className="profile-score-box">
      <p className="score-label">Coverage Score</p>
      <p className="score-value">{pct}%</p>
      <p className="score-sub">{covered} of {total} areas covered</p>
    </div>
  );
}

// ── Profile Banner ────────────────────────────────────────────────────────────
// ActivePolicies normalizes fields to camelCase:
//   category, insurerName, productName, premiumAnnual, coverageAmount …
function ProfileBanner({ user, activePolicies }) {
  const firstName = user?.first_name || "";
  const lastName  = user?.last_name  || "";
  const name      = firstName || lastName
    ? `${firstName} ${lastName}`.trim()
    : "User";

  const age = user?.date_of_birth
    ? Math.floor((new Date() - new Date(user.date_of_birth)) / 3.156e10)
    : null;

  const occupation = user?.occupation || "—";
  const city       = user?.city  || "";
  const state      = user?.state || "";
  const location   = city && state
    ? `${city}, ${state}`
    : city || state || "—";

  const ALL_TYPES = ["Home", "Auto", "Life", "Health"];

  // ActivePolicies.js normalizes to camelCase: p.category ("AUTO"|"HOME"|"LIFE"|"HEALTH")
  // and p.productName — use same fields here
  let coveragePills = [];
  if (activePolicies && activePolicies.length > 0) {
    coveragePills = activePolicies.map((p) => {
      if (p.category) {
        const label =
          p.category.charAt(0).toUpperCase() + p.category.slice(1).toLowerCase();
        return `${label} Insurance`;
      }
      return p.productName || p.product_name || "Policy";
    });
  } else {
    coveragePills = ["Home Insurance", "Auto Insurance", "Life Insurance"];
  }

  const coveredCount = ALL_TYPES.filter((t) =>
    coveragePills.some((pill) => pill.toLowerCase().includes(t.toLowerCase()))
  ).length;

  return (
    <div className="profile-banner">
      <div className="profile-details">
        <h2 className="profile-heading">Your Profile</h2>
        <div className="profile-fields">
          <div>
            <span className="field-label">NAME</span>
            <strong>{name}</strong>
          </div>
          {age !== null && (
            <div>
              <span className="field-label">AGE</span>
              <strong>{age} years</strong>
            </div>
          )}
          <div>
            <span className="field-label">OCCUPATION</span>
            <strong>{occupation}</strong>
          </div>
          <div>
            <span className="field-label">LOCATION</span>
            <strong>{location}</strong>
          </div>
        </div>
        <div className="profile-coverage-row">
          <span className="field-label">CURRENT COVERAGE</span>
          <div className="coverage-pills">
            {coveragePills.map((c, i) => (
              <span key={i} className="coverage-pill">{c}</span>
            ))}
          </div>
        </div>
      </div>
      <ScoreBadge covered={coveredCount} total={ALL_TYPES.length} />
    </div>
  );
}

// ── Recommendation Card ───────────────────────────────────────────────────────
function RecommendationCard({ rec, index }) {
  const navigate                  = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (!rec || dismissed) return null;

  const typeKey  = (rec.policy || rec.title || "").split(" ")[0].toUpperCase();
  const icon     = CATEGORY_ICONS[typeKey] || "📋";
  const priority = PRIORITY_META[rec.priority] || PRIORITY_META.low;

  // Navigate to Browse Policies pre-filtered by category
  // Backend GET /browse-policies accepts ?category=HEALTH|AUTO|LIFE|HOME
  const handleGetQuote = () => {
    const cat = rec.policyCategory || typeKey;
    const validCats = ["HEALTH", "AUTO", "LIFE", "HOME"];
    const dest = validCats.includes(cat)
      ? `${ROUTES.BROWSE_POLICIES}?category=${cat}`
      : ROUTES.BROWSE_POLICIES;
    navigate(dest);
  };

  return (
    <div className="rec-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="rec-card-top">
        <div className="rec-icon-wrap">{icon}</div>
        <div className="rec-main">

          <div className="rec-header-row">
            <div className="rec-header-text">
              <h3 className="rec-title">{rec.title || "Recommended Coverage"}</h3>
              <p className="rec-subtitle">
                {rec.priority === "high"
                  ? `Based on your profile, you may benefit from additional ${typeKey.toLowerCase()} coverage for comprehensive protection.`
                  : "Consider upgrading your coverage for better protection."}
              </p>
            </div>
            <div className={`rec-priority-badge ${priority.cls}`}>
              {priority.label}
            </div>
            {rec.match && (
              <span className="match-badge">
                <span className="match-arrow">↑</span>
                {rec.match} Match
              </span>
            )}
          </div>

          <div className="rec-details-grid">
            <div className="rec-policy-info">
              <p className="detail-label">Recommended Policy</p>
              <p className="detail-policy-name">{rec.policy}</p>
              <p className="detail-provider">{rec.provider}</p>
              <div className="detail-row">
                <span className="detail-label">Premium</span>
                <span className="detail-value">{rec.premium}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Coverage</span>
                <span className="detail-value">{rec.coverage}</span>
              </div>
              <p className="rec-promo">🔥 Up to 15% discount for new customers</p>
            </div>
            <div className="rec-benefits">
              <p className="detail-label">Why we recommend this:</p>
              <ul className="benefits-list">
                {(rec.benefits || []).map((b, i) => (
                  <li key={i}>
                    <span className="benefit-tick">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rec-actions">
            <button type="button" className="btn-quote" onClick={handleGetQuote}>
              Get Quote →
            </button>
            <button
              type="button"
              className="btn-dismiss"
              onClick={() => setDismissed(true)}
            >
              Not Interested
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RecommendationsPage() {
  const [activeTab,       setActiveTab]       = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [user,            setUser]            = useState(null);
  const [activePolicies,  setActivePolicies]  = useState([]);
  const [loading,         setLoading]         = useState(true);

  const load = async (category) => {
    setLoading(true);
    try {
      // fetchActivePolicies is from policiesService — same as ActivePolicies.js
      // It returns normalized camelCase objects or throws; we handle both
      const [recData, userData, policiesRaw] = await Promise.allSettled([
        fetchRecommendations(category),
        fetchUserProfile(),
        fetchActivePolicies(),
      ]);

      // Profile
      if (userData.status === "fulfilled" && userData.value) {
        setUser(userData.value);
      }

      // Active policies — normalize exactly like ActivePolicies.js does
      if (
        policiesRaw.status === "fulfilled" &&
        Array.isArray(policiesRaw.value) &&
        policiesRaw.value.length > 0
      ) {
        const normalized = policiesRaw.value.map((p) => ({
          id:              p.id,
          category:        p.category        || p.category,
          productName:     p.productName     || p.product_name,
          insurerName:     p.insurerName     || p.insurer_name,
          premiumAnnual:   p.premiumAnnual   || p.premium_annual,
          coverageAmount:  p.coverageAmount  || p.coverage_amount,
        }));
        setActivePolicies(normalized);
      }

      // Recommendations — fall back to dummy if empty or failed
      const recs =
        recData.status === "fulfilled"
          ? recData.value?.recommendations || []
          : [];

      setRecommendations(
        recs.length > 0
          ? recs
          : category
            ? DUMMY_RECOMMENDATIONS.filter((r) => r.category === category)
            : DUMMY_RECOMMENDATIONS
      );
    } catch (err) {
      console.error("Recommendations load error:", err);
      setRecommendations(
        category
          ? DUMMY_RECOMMENDATIONS.filter((r) => r.category === category)
          : DUMMY_RECOMMENDATIONS
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="rec-page">

          <div className="rec-page-header">
            <div className="rec-page-icon">◈</div>
            <div>
              <h1 className="rec-page-title">Recommendations</h1>
              <p className="rec-page-subtitle">
                Personalised insurance suggestions based on your profile &amp; preferences
              </p>
            </div>
          </div>

          <ProfileBanner user={user} activePolicies={activePolicies} />

          <div className="rec-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.value ?? "all"}
                type="button"
                className={`rec-tab ${activeTab === tab.value ? "active" : ""}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="rec-loading">
              <div className="spinner" />
              <p>Loading recommendations…</p>
            </div>
          )}

          {!loading && recommendations.length === 0 && (
            <div className="rec-empty">
              <p>🎉 You're all covered! No recommendations for this category.</p>
            </div>
          )}

          {!loading && recommendations.length > 0 && (
            <div className="rec-list">
              {recommendations.map((rec, i) => (
                <RecommendationCard key={rec.id ?? i} rec={rec} index={i} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
