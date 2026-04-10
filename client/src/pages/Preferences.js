import React, { useState } from "react";
import "./Preferences.css";

const Preferences = () => {
  const [riskTolerance, setRiskTolerance] = useState("Medium Risk");
  const [policyInterests, setPolicyInterests] = useState(["Health", "Life", "Vehicle"]);
  const [budget, setBudget] = useState(50);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
  });
  const [additionalSettings, setAdditionalSettings] = useState({
    marketing: false,
    aiRecommendations: true,
    weeklySummary: true,
  });
  const [toast, setToast] = useState("");

const showToast = (message) => {
  setToast(message);
  setTimeout(() => setToast(""), 3000);
};

  const riskOptions = [
    { label: "Low Risk", icon: "🛡️", desc: "Maximum coverage, higher premiums" },
    { label: "Medium Risk", icon: "⚖️", desc: "Balanced coverage and cost" },
    { label: "High Risk", icon: "💰", desc: "Essential coverage, lower premiums" },
  ];

  const policyOptions = ["Health", "Life", "Vehicle", "Property", "Travel"];

  const getBudgetLabel = () => {
  if (budget < 33) return "Low Budget";
  if (budget < 66) return "Medium Budget";
  return "High Budget";
};

  const getBudgetRange = () => {
  const min = Math.round((budget / 100) * 2000);
  const max = Math.round((budget / 100) * 2000) + 500;
  return `$${min} - $${max}`;
};

  const togglePolicy = (policy) => {
    setPolicyInterests((prev) =>
      prev.includes(policy) ? prev.filter((p) => p !== policy) : [...prev, policy]
    );
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAdditional = (key) => {
    setAdditionalSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="preferences-page">
      {/* Header */}
      <div className="preferences-header">
        <h1 className="preferences-title">Preferences</h1>
        <p className="preferences-subtitle">Customize your insurance and notification settings</p>
      </div>

      {/* Insurance Preferences */}
      <div className="pref-card">
        <div className="pref-card-header">
          <div className="pref-icon-circle">🛡️</div>
          <div>
            <h2 className="pref-card-title">Insurance Preferences</h2>
            <p className="pref-card-subtitle">Help us personalize your policy recommendations</p>
          </div>
        </div>

        {/* Risk Tolerance */}
        <div className="pref-section">
          <h3 className="pref-section-title">Risk Tolerance Level</h3>
          <p className="pref-section-desc">Choose your comfort level with insurance coverage and premiums</p>
          <div className="risk-grid">
            {riskOptions.map((option) => (
              <div
                key={option.label}
                className={`risk-card ${riskTolerance === option.label ? "risk-card--active" : ""}`}
                onClick={() => setRiskTolerance(option.label)}
              >
                <span className="risk-icon">{option.icon}</span>
                <span className="risk-label">{option.label}</span>
                <span className="risk-desc">{option.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Interests */}
        <div className="pref-section">
          <h3 className="pref-section-title">Policy Interests</h3>
          <p className="pref-section-desc">Select the types of insurance policies you're interested in</p>
          <div className="policy-grid">
            {policyOptions.map((policy) => (
              <div
                key={policy}
                className={`policy-card ${policyInterests.includes(policy) ? "policy-card--active" : ""}`}
                onClick={() => togglePolicy(policy)}
              >
                <span>{policy}</span>
                {policyInterests.includes(policy) && <span className="policy-check">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Budget Preference */}
        <div className="pref-section">
          <h3 className="pref-section-title">Budget Preference</h3>
          <p className="pref-section-desc">Set your preferred budget range for insurance premiums</p>
          <div className="budget-labels">
            <span>Low</span>
            <span className="budget-label-active">{getBudgetLabel()}</span>
            <span>High</span>
          </div>
          <input
  type="range"
  min="0"
  max="100"
  value={budget}
  onChange={(e) => setBudget(e.target.value)}
  className="budget-slider"
  style={{
    background: `linear-gradient(to right, #111827 ${budget}%, #e5e7eb ${budget}%)`
  }}
/>
          <p className="budget-range">💲 Your preferred monthly premium range: {getBudgetRange()}</p>
        </div>
        <button className="save-btn" onClick={() => showToast("Insurance preferences saved successfully!")}>Save Insurance Preferences</button>
      </div>

      {/* Notification Preferences */}
      <div className="pref-card">
        <div className="pref-card-header">
          <div className="pref-icon-circle">🔔</div>
          <div>
            <h2 className="pref-card-title">Notification Preferences</h2>
            <p className="pref-card-subtitle">Choose how you want to receive updates</p>
          </div>
        </div>

        {[
          { key: "email", icon: "📧", title: "Email Notifications", desc: "Receive updates via email", detail: "Policy updates, claim status, recommendations, and important alerts" },
          { key: "sms", icon: "💬", title: "SMS Notifications", desc: "Receive text message alerts", detail: "Critical updates, claim approvals, and urgent reminders" },
          { key: "push", icon: "🔔", title: "Push Notifications", desc: "Receive browser push notifications", detail: "Real-time updates, AI insights, and personalized alerts" },
        ].map(({ key, icon, title, desc, detail }) => (
          <div key={key} className="toggle-row">
            <div className="toggle-icon">{icon}</div>
            <div className="toggle-info">
              <h4 className="toggle-title">{title}</h4>
              <p className="toggle-desc">{desc}</p>
              <p className="toggle-detail">{detail}</p>
            </div>
            <div
              className={`toggle-switch ${notifications[key] ? "toggle-switch--on" : ""}`}
              onClick={() => toggleNotification(key)}
            >
              <div className="toggle-thumb"></div>
            </div>
          </div>
        ))}
        <button className="save-btn" onClick={() => showToast("Notification preferences saved successfully!")}>Save Notification Preferences</button>
      </div>

      {/* Additional Settings */}
      <div className="pref-card">
        <div className="pref-card-header">
          <div className="pref-icon-circle">⚙️</div>
          <div>
            <h2 className="pref-card-title">Additional Settings</h2>
            <p className="pref-card-subtitle">Manage your account preferences</p>
          </div>
        </div>

        {[
          { key: "marketing", title: "Marketing Communications", desc: "Receive tips, news, and special offers" },
          { key: "aiRecommendations", title: "AI Recommendations", desc: "Enable personalized AI-powered suggestions" },
          { key: "weeklySummary", title: "Weekly Summary", desc: "Get weekly reports of your insurance activity" },
        ].map(({ key, title, desc }) => (
          <div key={key} className="toggle-row">
            <div className="toggle-info">
              <h4 className="toggle-title">{title}</h4>
              <p className="toggle-desc">{desc}</p>
            </div>
            <div
              className={`toggle-switch ${additionalSettings[key] ? "toggle-switch--on" : ""}`}
              onClick={() => toggleAdditional(key)}
            >
              <div className="toggle-thumb"></div>
            </div>
          </div>
        ))}
      </div>
      {toast && (
        <div className="toast">✅ {toast}</div>
      )}
    </div>
    
  );
};

export default Preferences;