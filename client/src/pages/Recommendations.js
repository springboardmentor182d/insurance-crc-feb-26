import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import "./Recommendations.css";

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

// apiClient baseURL is already http://localhost:8000/api/v1
// backend prefix is /recommendations → final: /api/v1/recommendations
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

function MatchBadge({ match }) {
  if (!match) return null;
  return (
    <span className="match-badge">
      <span className="match-arrow">↑</span>
      {match} Match
    </span>
  );
}

function RecommendationCard({ rec, index }) {
  const [dismissed, setDismissed] = useState(false);
  if (!rec || dismissed) return null;

  const policyType = rec.policy?.split(" ")[0]?.toUpperCase() || "HEALTH";
  const icon       = CATEGORY_ICONS[policyType] || "📋";
  const priority   = PRIORITY_META[rec.priority] || PRIORITY_META.low;

  return (
    <div className="rec-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="rec-card-top">
        <div className="rec-icon-wrap">{icon}</div>
        <div className="rec-main">
          <div className="rec-header-row">
            <div>
              <h3 className="rec-title">{rec.title || "Recommended Coverage"}</h3>
              <p className="rec-subtitle">
                {rec.priority === "high"
                  ? `Based on your profile, we noticed you don't have ${policyType.toLowerCase()} insurance. This is critical for comprehensive protection.`
                  : `Consider upgrading your coverage for better protection.`}
              </p>
            </div>
            <div className={`rec-priority-badge ${priority.cls}`}>{priority.label}</div>
            <MatchBadge match={rec.match} />
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
                  <li key={i}><span className="benefit-tick">✓</span> {b}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rec-actions">
            <button type="button" className="btn-quote">Get Quote →</button>
            <button type="button" className="btn-learn">Learn More</button>
            <button type="button" className="btn-dismiss" onClick={() => setDismissed(true)}>Not Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileBanner({ user }) {
  const firstName  = user?.first_name || "";
  const lastName   = user?.last_name  || "";
  const name       = firstName || lastName ? `${firstName} ${lastName}`.trim() : "User";
  const age        = user?.date_of_birth
    ? Math.floor((new Date() - new Date(user.date_of_birth)) / 3.156e10) : "—";
  const occupation = user?.occupation || "—";
  const location   = user?.city && user?.state
    ? `${user.city}, ${user.state}` : user?.city || user?.state || "—";
  const coverage   = ["Home Insurance", "Auto Insurance", "Life Insurance"];

  return (
    <div className="profile-banner">
      <div className="profile-details">
        <h2 className="profile-heading">Your Profile</h2>
        <div className="profile-fields">
          <div><span className="field-label">Name</span><strong>{name}</strong></div>
          <div><span className="field-label">Age</span><strong>{age} years</strong></div>
          <div><span className="field-label">Occupation</span><strong>{occupation}</strong></div>
          <div><span className="field-label">Location</span><strong>{location}</strong></div>
        </div>
        <div className="profile-coverage-row">
          <span className="field-label">Current Coverage</span>
          <div className="coverage-pills">
            {coverage.map((c, i) => <span key={i} className="coverage-pill">{c}</span>)}
          </div>
        </div>
      </div>
      <div className="profile-match-box">
        <p className="match-score-label">Match Score</p>
        <p className="match-score-value">Analyzed</p>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  const [activeTab,       setActiveTab]       = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [user,            setUser]            = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);

  const load = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const [recData, userData] = await Promise.all([
        fetchRecommendations(category),
        fetchUserProfile(),
      ]);
      setRecommendations(recData?.recommendations || []);
      if (userData) setUser(userData);
    } catch (err) {
      console.error("Recommendations error:", err);
      setError(err?.response?.data?.detail || err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="rec-page">
      <div className="rec-page-header">
        <div className="rec-page-icon">✦</div>
        <div>
          <h1 className="rec-page-title">Recommendations</h1>
          <p className="rec-page-subtitle">Personalized insurance suggestions based on your profile</p>
        </div>
      </div>

      <ProfileBanner user={user} />

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
          <p>Analysing your profile…</p>
        </div>
      )}

      {!loading && error && (
        <div className="rec-error">
          <p>{error}</p>
          <button onClick={() => load(activeTab)}>Retry</button>
        </div>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <div className="rec-empty">
          <p>🎉 You're all covered! No recommendations for this category.</p>
        </div>
      )}

      {!loading && !error && recommendations.length > 0 && (
        <div className="rec-list">
          {recommendations.map((rec, i) => (
            <RecommendationCard key={rec.id ?? i} rec={rec} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}