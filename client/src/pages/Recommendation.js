import React from 'react';
import MainLayout from '../layout/MainLayout';
import RecommendationCard from '../components/RecommendationCard';
import './Recommendation.css';

const Recommendation = () => {
  return (
    <MainLayout>
      <div className="recommendations-container">
        <header className="page-header">
          <div className="header-title">
            <span className="ai-sparkle">✨</span>
            <h1>AI Recommendations</h1>
          </div>
          <p className="subtitle">Personalized policy suggestions based on your profile</p>
        </header>

        <div className="policy-list">
          <RecommendationCard />
        </div>
      </div>
    </MainLayout>
  );
};

export default Recommendation;