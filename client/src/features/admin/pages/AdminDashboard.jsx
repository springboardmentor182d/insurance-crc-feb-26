import React, { useState, useMemo } from "react";
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

  // 1. Unified Configuration: Merge title, subtitle, and component into one object
  const sections = useMemo(() => ({
    overview: {
      title: "Admin Overview",
      subtitle: "Live activity across policies, claims, and risk controls.",
      component: <OverviewCards />,
    },
    users: {
      title: "Users Management",
      subtitle: "Monitor and manage all user accounts, access, and status.",
      component: <UsersTable />,
    },
    policies: {
      title: "Policy Catalog",
      subtitle: "Configure insurance policies and coverage details.",
      component: <Policies />,
    },
    activePolicies: {
      title: "Active Subscriptions",
      subtitle: "Monitor active insurance policies and user coverage.",
      component: <ActivePolicies />,
    },
    claims: {
      title: "Claims Management",
      subtitle: "Track and manage all insurance claims in one place.",
      component: <ClaimsManagement />,
    },
    fraudRules: {
      title: "Fraud Detection Rules",
      subtitle: "Keep detection logic sharp and up to date.",
      component: <FraudRules />,
    },
    analytics: {
      title: "System Analytics",
      subtitle: "Deep insights into claims, fraud, and policy performance.",
      component: <AnalyticsSection />,
    },
  }), []);

  // 2. Derive the current section data with a fallback to overview
  const currentSection = sections[activeSection] || sections.overview;

  return (
    <div className="admin-container">
      {/* Navigation Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />

      <main className="main-content">
        {/* Dynamic Dashboard Header */}
        <header className="dashboard-header">
          <div className="header-text">
            <h1 className="page-title">{currentSection.title}</h1>
            <p className="page-subtitle">{currentSection.subtitle}</p>
          </div>
          
          <div className="header-actions">
            <span className="pill pill-live">System: Online</span>
            <span className="pill">Env: Local</span>
            <div className="user-profile-summary">
              {/* Optional: Add admin avatar/name here */}
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <section className="content-area">
          {currentSection.component}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;