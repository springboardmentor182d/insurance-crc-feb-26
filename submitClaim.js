// Claims submission service
export const submitClaim = async (policyNumber, reason, amount) => {
  try {
    const response = await fetch('http://localhost:8000/claims/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        policy_number: policyNumber,
        reason: reason,
        amount: amount
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, claim: data };
    } else {
      return { success: false, error: data.message || 'Failed to submit claim' };
    }
  } catch (error) {
    return { success: false, error: 'Failed to connect to backend' };
  }
};
