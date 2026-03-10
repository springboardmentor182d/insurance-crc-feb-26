import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import StatsCards from '../components/StatsCards';
import AlertsPanel from '../components/AlertsPanel';
import FraudPanel from '../components/FraudPanel';
import ChartsSection from '../components/ChartsSection';

const Home = () => {
  return (
    <div className="dashboard-wrapper">
      <DashboardHeader />
      <div className="dashboard-content">
        <StatsCards />
        <AlertsPanel />
        <div className="dashboard-row">
          <FraudPanel />
          <ChartsSection />
        </div>
      </div>
    </div>
  );
};

export default Home;
