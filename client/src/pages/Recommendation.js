import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import RecommendationCard from '../components/RecommendationCard';
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
  );
};

export default Recommendation;