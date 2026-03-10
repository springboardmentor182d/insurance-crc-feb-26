import React, { useState } from 'react';
import ClaimForm from '../components/ClaimForm';

const ClaimAssistant = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState(null);

  // Handle claim submission
  const handleClaimSubmit = async (claimData) => {
    try {
      const response = await fetch('http://localhost:8000/claims/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claimData)
      });

      const data = await response.json();
      if (response.ok) {
        setSubmittedClaim(data);
        setSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
          setSubmittedClaim(null);
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to submit claim:', err);
    }
  };

  return (
    <div className="page-container">
      <h1>Submit Insurance Claim</h1>
      
      <div className="claim-container">
        {!submitted ? (
          <ClaimForm onSubmit={handleClaimSubmit} />
        ) : (
          <div className="success-message">
            <h2>✓ Claim Submitted Successfully!</h2>
            <p>Claim ID: {submittedClaim?.claim_id}</p>
            <p>Your claim has been registered. You will receive updates via email.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimAssistant;
