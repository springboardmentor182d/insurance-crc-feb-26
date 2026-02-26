import React, { useEffect, useState } from "react";
import RecommendationCard from "./RecommendationCard";

function Recommendations() {
  const [message, setMessage] = useState("");

useEffect(() => {
  fetch("http://127.0.0.1:8000")
    .then(res => res.json())
    .then(data => {
      setMessage(data.message);
    })
    .catch(err => console.log(err));
}, []);
  return (
    <div className="recommendations">

      <div className="hero">
        <h2>✨ Personalized for You</h2>
        <p>{message}</p>
        <p>
          Our AI has analyzed your profile and found the best insurance policies tailored to your needs.
        </p>
        <div className="hero-tags">
          <span>🛡️ Based on your profile</span>
          <span>📈 Updated daily</span>
          <span>💲 Best value options</span>
        </div>
      </div>

      <RecommendationCard
        title="Health Insurance Plus"
        company="HealthGuard Insurance"
        match="95% Match"
        coverage="$120,000"
        premium="$280/month"
        savings="$360/year"
        features={[
          "Covers pre-existing conditions",
          "No waiting period",
          "Dental and vision included",
          "Free annual checkup"
        ]}
      />

      <RecommendationCard
        title="AutoSecure Premium"
        company="AutoSecure Insurance"
        match="88% Match"
        coverage="$60,000"
        premium="$140/month"
        savings="$240/year"
        features={[
          "Zero depreciation coverage",
          "Quick claim settlement",
          "24/7 roadside assistance",
          "Engine protection"
        ]}
      />

      <RecommendationCard
        title="Life Protection Elite"
        company="LifeSecure Assurance"
        match="85% Match"
        coverage="$600,000"
        premium="$180/month"
        savings="$480/year"
        features={[
          "Term life coverage",
          "Accidental death benefit",
          "Critical illness rider",
          "Tax savings benefits"
        ]}
      />

      <RecommendationCard
        title="Travel Safe Global"
        company="TravelSafe Insurance"
        match="78% Match"
        coverage="$50,000"
        premium="$60/month"
        savings="$120/year"
        features={[
          "Worldwide coverage",
          "Medical emergency",
          "Trip cancellation",
          "Lost baggage protection"
        ]}
      />

    </div>
  );
}

export default Recommendations;