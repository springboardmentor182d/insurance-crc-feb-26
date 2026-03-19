/**
 * API Service for Insurance CRC Frontend
 * Handles all API calls to the backend with proper error handling
 */

const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

// Helper function for API calls with error handling
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

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

export const adminService = {
  // Get overview statistics
  getOverview: async () => {
    return apiCall("/admin/overview");
  },

  // Get quick stats
  getQuickStats: async () => {
    return apiCall("/admin/quick-stats");
  },

  // Get system alerts
  getSystemAlerts: async () => {
    return apiCall("/admin/system-alerts");
  },

  // Get recent activity
  getRecentActivity: async () => {
    return apiCall("/admin/recent-activity");
  },

  // Get users
  getUsers: async () => {
    return apiCall("/admin/users");
  },

  // Create user
  createUser: async (userData) => {
    return apiCall("/admin/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Update user
  updateUser: async (userId, userData) => {
    return apiCall(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  deleteUser: async (userId) => {
    return apiCall(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  },

  // Toggle user status
  toggleUserStatus: async (userId) => {
    return apiCall(`/admin/users/${userId}/toggle-status`, {
      method: "PUT",
    });
  },

  // Get fraud rules
  getFraudRules: async () => {
    return apiCall("/admin/fraud-rules");
  },

  // Create fraud rule
  createFraudRule: async (ruleData) => {
    return apiCall("/admin/fraud-rules", {
      method: "POST",
      body: JSON.stringify(ruleData),
    });
  },

  // Update fraud rule
  updateFraudRule: async (ruleId, ruleData) => {
    return apiCall(`/admin/fraud-rules/${ruleId}`, {
      method: "PUT",
      body: JSON.stringify(ruleData),
    });
  },

  // Toggle fraud rule status
  toggleFraudRuleStatus: async (ruleId) => {
    return apiCall(`/admin/fraud-rules/${ruleId}/toggle-status`, {
      method: "PUT",
    });
  },

  // Delete fraud rule
  deleteFraudRule: async (ruleId) => {
    return apiCall(`/admin/fraud-rules/${ruleId}`, {
      method: "DELETE",
    });
  },

  // Get claims
  getClaims: async () => {
    return apiCall("/admin/claims");
  },

  // Create claim
  createClaim: async (claimData) => {
    return apiCall("/admin/claims", {
      method: "POST",
      body: JSON.stringify(claimData),
    });
  },

  // Delete claim
  deleteClaim: async (claimId) => {
    return apiCall(`/admin/claims/${claimId}`, {
      method: "DELETE",
    });
  },

  // Get analytics
  getAnalytics: async () => {
    return apiCall("/admin/analytics");
  },

  // Get comprehensive analytics
  getComprehensiveAnalytics: async () => {
    return apiCall("/admin/analytics/comprehensive");
  },
};

// ============================================================================
// CATALOG ENDPOINTS (Policies & Recommendations)
// ============================================================================

export const catalogService = {
  // Get all policies
  getPolicies: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/catalog/policies?${params}`);
  },

  // Get single policy
  getPolicy: async (policyId) => {
    return apiCall(`/catalog/policies/${policyId}`);
  },

  // Create policy
  createPolicy: async (policyData) => {
    return apiCall("/catalog/policies", {
      method: "POST",
      body: JSON.stringify(policyData),
    });
  },

  // Update policy
  updatePolicy: async (policyId, policyData) => {
    return apiCall(`/catalog/policies/${policyId}`, {
      method: "PUT",
      body: JSON.stringify(policyData),
    });
  },

  // Delete policy
  deletePolicy: async (policyId) => {
    return apiCall(`/catalog/policies/${policyId}`, {
      method: "DELETE",
    });
  },

  // Get policy types
  getPolicyTypes: async () => {
    return apiCall("/catalog/policy-types");
  },

  // Get all recommendations
  getRecommendations: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/catalog/recommendations?${params}`);
  },

  // Get single recommendation
  getRecommendation: async (recommendationId) => {
    return apiCall(`/catalog/recommendations/${recommendationId}`);
  },

  // Create recommendation
  createRecommendation: async (recommendationData) => {
    return apiCall("/catalog/recommendations", {
      method: "POST",
      body: JSON.stringify(recommendationData),
    });
  },

  // Update recommendation
  updateRecommendation: async (recommendationId, recommendationData) => {
    return apiCall(`/catalog/recommendations/${recommendationId}`, {
      method: "PUT",
      body: JSON.stringify(recommendationData),
    });
  },

  // Delete recommendation
  deleteRecommendation: async (recommendationId) => {
    return apiCall(`/catalog/recommendations/${recommendationId}`, {
      method: "DELETE",
    });
  },

  // Get recommendation categories
  getRecommendationCategories: async () => {
    return apiCall("/catalog/recommendation-categories");
  },

  // Get top recommendations
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
  // Get API base URL
  getBaseURL: () => API_BASE_URL,

  // Check if API is available
  isAPIAvailable: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  // Retry failed API calls
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
