import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import RecommendationCard from '../components/RecommendationCard';
import { catalogService } from '../services/apiService';
import './Recommendation.css';

const Recommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const data = await catalogService.getRecommendations();
        const items = Array.isArray(data) ? data : data?.recommendations || [];
        setRecommendations(items);
      } catch (err) {
        setError(err.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
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