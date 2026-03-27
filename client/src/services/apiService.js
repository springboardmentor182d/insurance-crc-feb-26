

const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";


const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
};


export const adminService = {
  getOverview: async () => {
    return apiCall("/admin/overview");
  },

 
  getQuickStats: async () => {
    return apiCall("/admin/quick-stats");
  },


  getSystemAlerts: async () => {
    return apiCall("/admin/system-alerts");
  },

 
  getRecentActivity: async () => {
    return apiCall("/admin/recent-activity");
  },

 
  getUsers: async () => {
    return apiCall("/admin/users");
  },

    createUser: async (userData) => {
    return apiCall("/admin/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },


  updateUser: async (userId, userData) => {
    return apiCall(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (userId) => {
    return apiCall(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  },


  toggleUserStatus: async (userId) => {
    return apiCall(`/admin/users/${userId}/toggle-status`, {
      method: "PUT",
    });
  },


  getFraudRules: async () => {
    return apiCall("/admin/fraud-rules");
  },


  createFraudRule: async (ruleData) => {
    return apiCall("/admin/fraud-rules", {
      method: "POST",
      body: JSON.stringify(ruleData),
    });
  },

  updateFraudRule: async (ruleId, ruleData) => {
    return apiCall(`/admin/fraud-rules/${ruleId}`, {
      method: "PUT",
      body: JSON.stringify(ruleData),
    });
  },

 
  toggleFraudRuleStatus: async (ruleId) => {
    return apiCall(`/admin/fraud-rules/${ruleId}/toggle-status`, {
      method: "PUT",
    });
  },

  deleteFraudRule: async (ruleId) => {
    return apiCall(`/admin/fraud-rules/${ruleId}`, {
      method: "DELETE",
    });
  },


  getClaims: async () => {
    return apiCall("/admin/claims");
  },

  createClaim: async (claimData) => {
    return apiCall("/admin/claims", {
      method: "POST",
      body: JSON.stringify(claimData),
    });
  },

  deleteClaim: async (claimId) => {
    return apiCall(`/admin/claims/${claimId}`, {
      method: "DELETE",
    });
  },

  getAnalytics: async () => {
    return apiCall("/admin/analytics");
  },

  
  getComprehensiveAnalytics: async () => {
    return apiCall("/admin/analytics/comprehensive");
  },
};



export const catalogService = {
 
  getPolicies: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/catalog/policies?${params}`);
  },

y
  getPolicy: async (policyId) => {
    return apiCall(`/catalog/policies/${policyId}`);
  },


  createPolicy: async (policyData) => {
    return apiCall("/catalog/policies", {
      method: "POST",
      body: JSON.stringify(policyData),
    });
  },

  updatePolicy: async (policyId, policyData) => {
    return apiCall(`/catalog/policies/${policyId}`, {
      method: "PUT",
      body: JSON.stringify(policyData),
    });
  },


  deletePolicy: async (policyId) => {
    return apiCall(`/catalog/policies/${policyId}`, {
      method: "DELETE",
    });
  },


  getPolicyTypes: async () => {
    return apiCall("/catalog/policy-types");
  },

  getRecommendations: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/catalog/recommendations?${params}`);
  },

  getRecommendation: async (recommendationId) => {
    return apiCall(`/catalog/recommendations/${recommendationId}`);
  },


  createRecommendation: async (recommendationData) => {
    return apiCall("/catalog/recommendations", {
      method: "POST",
      body: JSON.stringify(recommendationData),
    });
  },


  updateRecommendation: async (recommendationId, recommendationData) => {
    return apiCall(`/catalog/recommendations/${recommendationId}`, {
      method: "PUT",
      body: JSON.stringify(recommendationData),
    });
  },

  deleteRecommendation: async (recommendationId) => {
    return apiCall(`/catalog/recommendations/${recommendationId}`, {
      method: "DELETE",
    });
  },


  getRecommendationCategories: async () => {
    return apiCall("/catalog/recommendation-categories");
  },


  getTopRecommendations: async (category = null) => {
    const params = new URLSearchParams({ top_only: true });
    if (category) {
      params.append("category", category);
    }
    return apiCall(`/catalog/recommendations?${params.toString()}`);
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const apiUtils = {
  getBaseURL: () => API_BASE_URL,

  
  isAPIAvailable: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  
  retryApiCall: async (
    endpoint,
    options = {},
    maxRetries = 3,
    delay = 1000
  ) => {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall(endpoint, options);
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  },
};

const apiService = {
  adminService,
  catalogService,
  apiUtils,
};

export default apiService;
