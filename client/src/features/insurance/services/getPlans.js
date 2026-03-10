// Insurance plans service
export const getInsurancePlans = async () => {
  try {
    const response = await fetch('http://localhost:8000/insurance/plans');
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, plans: data.plans };
    } else {
      return { success: false, error: data.message || 'Failed to fetch plans' };
    }
  } catch (error) {
    return { success: false, error: 'Failed to connect to backend' };
  }
};

// Get insurance recommendation
export const getRecommendation = async (age, budget) => {
  try {
    const response = await fetch('http://localhost:8000/insurance/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: age,
        budget: budget
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, recommendation: data.recommendation };
    } else {
      return { success: false, error: data.message || 'Failed to get recommendation' };
    }
  } catch (error) {
    return { success: false, error: 'Failed to connect to backend' };
  }
};
