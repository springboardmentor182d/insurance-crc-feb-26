import React from "react";

function HowItWorks() {
  return (
    <div className="how">
      <h2>How AI Recommendations Work</h2>

      <div className="steps">
        <div className="step">
          <div className="number">1</div>
          <h4>Analyze Your Profile</h4>
          <p>Our AI analyzes your age, location, occupation, and current coverage</p>
        </div>

        <div className="step">
          <div className="number">2</div>
          <h4>Match Policies</h4>
          <p>Compare thousands of policies to find the best matches for your needs</p>
        </div>

        <div className="step">
          <div className="number">3</div>
          <h4>Personalized Results</h4>
          <p>Get tailored recommendations with match scores and savings potential</p>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;