import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import ProfileCard from "./components/ProfileCard";
import Tabs from "./components/Tabs";
import RecommendationCard from "./components/RecommendationCard";
import HowItWorks from "./components/HowItWorks";

function App() {

  // ✅ Default Static Data (Your Original Cards)
  const defaultRecommendations = [
  {
    icon: "❤️",
    title: "Health Insurance Coverage Gap",
    description:
      "Based on your profile, we noticed you don't have health insurance.",
    match: "95%",
    policy: {
      name: "Family Health Plan",
      provider: "HealthFirst",
      premium: "$3600/year",
      coverage: "$2,000,000",
      highlight: "Up to 15% discount",
    },
    reasons: [
      "Age-appropriate coverage",
      "Covers pre-existing conditions",
      "Includes preventive care",
    ],
  },
  {
    icon: "🚗",
    title: "Save on Auto Insurance",
    description:
      "We found a comparable auto policy that could save you $200/year.",
    match: "88%",
    policy: {
      name: "Auto Comprehensive Plus",
      provider: "DriveSecure",
      premium: "$850/year",
      coverage: "$250,000",
      highlight: "$200 savings",
    },
    reasons: [
      "Same coverage limits",
      "Better claim rating",
      "Includes roadside assistance",
    ],
  },
  {
    icon: "🛡️",
    title: "Increase Life Insurance Coverage",
    description:
      "Your current life insurance may be insufficient. Consider increasing coverage to match your income.",
    match: "82%",
    policy: {
      name: "Life Insurance Premium",
      provider: "LifeGuard",
      premium: "$2800/year",
      coverage: "$1,500,000",
      highlight: "Better value per $100k coverage",
    },
    reasons: [
      "Matches 10x annual income rule",
      "Cash value accumulation",
      "Living benefits included",
      "Premium guaranteed for 20 years",
    ],
  },
  {
    icon: "🎒",
    title: "Consider Disability Insurance",
    description:
      "Protect your income in case of illness or injury. Essential for primary earners.",
    match: "78%",
    policy: {
      name: "Income Protection Plan",
      provider: "SecureIncome",
      premium: "$1200/year",
      coverage: "60% of income",
      highlight: "Tax-free benefits",
    },
    reasons: [
      "Covers up to 60% of income",
      "Short and long-term options",
      "Covers partial disability",
      "No waiting period for accidents",
    ],
  },
];


  const [recommendations, setRecommendations] = useState(defaultRecommendations);

  useEffect(() => {
    fetch("http://localhost:8000/recommendations")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setRecommendations(data);
        }
      })
      .catch(() => {
        console.log("Using default static data");
      });
  }, []);

  return (
    <div className="app">
      <Header />

      <div className="container">
        <div className="page-title">
          <div className="icon-box">✨</div>
          <div>
            <h1>AI-Powered Recommendations</h1>
            <p>Personalized insurance suggestions based on your profile</p>
          </div>
        </div>

        <ProfileCard />
        <Tabs />

        {recommendations.map((item, index) => (
          <RecommendationCard
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
            match={item.match}
            policy={item.policy}
            reasons={item.reasons}
          />
        ))}

        <HowItWorks />
      </div>
    </div>
  );
}

export default App;