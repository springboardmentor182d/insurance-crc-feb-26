<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
=======
<<<<<<< HEAD
import React from 'react';
>>>>>>> Stashed changes
import MainLayout from '../layout/MainLayout';
import RecommendationCard from '../components/RecommendationCard';
=======
// client/src/pages/Recommendation.js
import React from 'react';
import Sidebar from '../layout/Sidebar'; // Import your Sidebar component
import { recommendationsData } from '../data/recommendationsData'; // Import data
>>>>>>> c18de50 (added my feature folder and code)
import './Recommendation.css';

const Recommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching data from your backend
    fetch('http://localhost:8000/api/recommendations')
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.detail || "Server Error");
          });
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRecommendations(data);
        } else {
          setRecommendations([]);
          console.error("Data received is not a list:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
<<<<<<< HEAD
    <MainLayout>
      <div className="recommendations-container">
        {/* Header Section */}
        <header className="page-header">
          <div className="header-title">
            <span className="ai-sparkle">✨</span>
            <h1>AI Recommendations</h1>
          </div>
          <p className="subtitle">
            Personalized policy suggestions based on your profile
          </p>
        </header>

        {/* Content Section */}
        <div className="policy-list-container">
          {loading && (
            <div className="loading-state">
              <p>Loading your personalized plans...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p style={{ color: 'red' }}>Backend Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="policy-list">
              {recommendations.length > 0 ? (
                recommendations.map((policy) => (
                  <RecommendationCard key={policy.id} plan={policy} />
                ))
              ) : (
                <p className="no-data">No plans found in the database.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
=======
    <div className="dashboard-layout">
      {/* 1. Sidebar remains fixed on the left */}
      <Sidebar />

      {/* 2. Main content area with proper padding */}
      <main className="recommendations-view">
        <header className="page-header">
          <div className="header-icon-container">✨</div>
          <div className="header-text-container">
            <h1>AI Recommendations</h1>
            <p>Personalized policy suggestions based on your profile</p>
          </div>
        </header>

        <section className="recommendations-list">
          {recommendationsData.map((policy, index) => (
            <div key={policy.id} className="recommendation-card-container">
              {/* Only show label for the first item */}
              {index === 0 && (
                <div className="top-recommendation-tag">
                  <span className="icon">📈</span> TOP RECOMMENDATION
                </div>
              )}

              <div className="card-inner-layout">
                <div className="card-top-section">
                  <div className="policy-meta">
                    <span className="category-pill">{policy.type}</span>
                    <h2 className="policy-name">{policy.title}</h2>
                    <p className="provider-name">{policy.provider}</p>
                  </div>
                  <div className="match-score-display">
                    <span className="score-value">{policy.match}%</span>
                    <span className="score-label">Match</span>
                  </div>
                </div>

                {/* Progress bar matching Figma green */}
                <div className="match-progress-track">
                  <div 
                    className="match-progress-bar" 
                    style={{ width: `${policy.match}%` }}
                  ></div>
                </div>

                <div className="recommendation-insight">
                  <span className="insight-label">Why we recommend this</span>
                  <p className="insight-body">{policy.reason}</p>
                </div>

                <div className="policy-metrics-grid">
                  <div className="metric">
                    <label>Coverage</label>
                    <p>{policy.coverage}</p>
                  </div>
                  <div className="metric">
                    <label>Premium</label>
                    <p>{policy.premium}</p>
                  </div>
                  <div className="metric">
                    <label>Claim Ratio</label>
                    <p className="success-text">{policy.claimRatio}</p>
                  </div>
                  <div className="metric">
                    <label>Risk Level</label>
                    <span className={`risk-status ${policy.riskLevel.toLowerCase().replace(' ', '-')}`}>
                      {policy.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="benefits-tags">
                  {policy.tags.map((tag, i) => (
                    <span key={i} className="benefit-pill">{tag}</span>
                  ))}
                </div>

                <button className="primary-action-btn">Select Plan</button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
>>>>>>> c18de50 (added my feature folder and code)
  );
};

export default Recommendation;