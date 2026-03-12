import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import OverviewCards from "../components/OverviewCards";
import UsersTable from "../components/UsersTable";
import FraudRules from "../components/FraudRules";
import AnalyticsSection from "../components/AnalyticsSection";
import ClaimsManagement from "../components/ClaimsManagement";
import Policies from "../components/Policies";
import ActivePolicies from "../components/ActivePolicies";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const sectionConfig = {
    overview: {
      title: "Admin Overview",
      subtitle: "Live activity across policies, claims, and risk controls.",
    },
    users: {
      title: "Users",
      subtitle: "Monitor and manage all user accounts",
    },
    policies: {
      title: "Policies",
      subtitle: "Insurance policies and coverage details",
    },
    claims: {
      title: "Claims Management",
      subtitle: "Track and manage all insurance claims in one place.",
    },
    fraudRules: {
      title: "Fraud Rules",
      subtitle: "Keep detection logic sharp and up to date.",
    },
    activePolicies: {
      title: "Active Policies",
      subtitle: "Monitor active insurance policies and user coverage",
    },
    analytics: {
      title: "Analytics",
      subtitle: "Deep insights into claims, fraud, and policy performance.",
    },
  };

  const { title, subtitle } = sectionConfig[activeSection] || sectionConfig.overview;

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewCards />;
      case "users":
        return <UsersTable />;
      case "policies":
        return <Policies />;
      case "claims":
        return <ClaimsManagement />;
      case "fraudRules":
        return <FraudRules />;
      case "activePolicies":
        return <ActivePolicies />;
      case "analytics":
        return <AnalyticsSection />;
      default:
        return <OverviewCards />;
    }
  };

  return (
    <div className="admin-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-content">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">{subtitle}</p>
          </div>
          <div className="header-actions">
            <span className="pill pill-live">System: Online</span>
            <span className="pill">Env: Local</span>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
