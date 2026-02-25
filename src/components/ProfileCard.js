import React from "react";

function ProfileCard() {
  return (
    <div className="profile-card">
      <div className="profile-left">
        <h2>Your Profile</h2>
        <div className="profile-grid">
          <div>
            <span>Name</span>
            <strong>John Doe</strong>
          </div>
          <div>
            <span>Age</span>
            <strong>35 years</strong>
          </div>
          <div>
            <span>Occupation</span>
            <strong>Software Engineer</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>New York, NY</strong>
          </div>
        </div>

        <div className="coverage">
          <span>Current Coverage</span>
          <div className="tags">
            <div>Home Insurance</div>
            <div>Auto Insurance</div>
            <div>Life Insurance</div>
          </div>
        </div>
      </div>

      <div className="match-score">
        <span>Match Score</span>
        <h3>AI Analyzed</h3>
      </div>
    </div>
  );
}

export default ProfileCard;