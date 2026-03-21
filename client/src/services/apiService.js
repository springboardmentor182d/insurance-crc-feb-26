/**
 * API Service for Insurance CRC Frontend
 * Handles all API calls to the backend with proper error handling
 */

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_BASE_URL || "").trim();

const buildApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// Helper function for API calls with error handling
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(buildApiUrl(endpoint), {
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
  // Get dashboard payload (single source of truth for admin stats)
  getDashboard: async () => {
    return apiCall("/api/admin/dashboard");
  },

  // Get overview statistics
  getOverview: async () => {
    const dashboard = await apiCall("/api/admin/dashboard");
    return dashboard.overview || {};
  },

  // Get quick stats
  getQuickStats: async () => {
    const overview = await adminService.getOverview();
    return {
      approval_rate: overview.approval_rate || 0,
      avg_processing_time: overview.avg_processing_time_days || 0,
      customer_satisfaction: overview.customer_satisfaction || 0,
    };
  },

  // Get system alerts
  getSystemAlerts: async () => {
    const overview = await adminService.getOverview();
    return {
      alerts: [
        {
          priority: "High",
          message: `${overview.high_priority_alerts || 0} high-risk claims pending review`,
          icon: "!",
        },
        {
          priority: "Medium",
          message: `${overview.medium_priority_alerts || 0} claims under review`,
          icon: "!",
        },
      ],
    };
  },

  // Get recent activity
  getRecentActivity: async () => {
    const dashboard = await apiCall("/api/admin/dashboard");
    return {
      activities: (dashboard.recent_activity || []).map((item, index) => ({
        id: index + 1,
        action: item.title || "Activity",
        description: item.description || "",
        entity_type: item.type || "System",
        timestamp: item.timestamp || new Date().toISOString(),
      })),
    };
  },

  // Get users
  getUsers: async () => {
    return apiCall("/api/users");
  },

  // Create user
  createUser: async (userData) => {
    return apiCall("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Update user
  updateUser: async (userId, userData) => {
    return apiCall(`/api/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  deleteUser: async (userId) => {
    return apiCall(`/api/users/${userId}`, {
      method: "DELETE",
    });
  },

  // Toggle user status
  toggleUserStatus: async (userId) => {
    return apiCall(`/api/users/${userId}/toggle-status`, {
      method: "PUT",
    });
  },

  // Get fraud rules
  getFraudRules: async () => {
    const dashboard = await apiCall("/api/admin/dashboard");
    return dashboard.fraud_rules || [];
  },

  // Create fraud rule
  createFraudRule: async (ruleData) => {
    return apiCall("/api/admin/fraud-rules", {
      method: "POST",
      body: JSON.stringify(ruleData),
    });
  },

  // Update fraud rule
  updateFraudRule: async (ruleId, ruleData) => {
    return apiCall(`/api/admin/fraud-rules/${ruleId}`, {
      method: "PUT",
      body: JSON.stringify(ruleData),
    });
  },

  // Toggle fraud rule status
  toggleFraudRuleStatus: async (ruleId) => {
    return apiCall(`/api/admin/fraud-rules/${ruleId}/toggle-status`, {
      method: "PUT",
    });
  },

  // Delete fraud rule
  deleteFraudRule: async (ruleId) => {
    return apiCall(`/api/admin/fraud-rules/${ruleId}`, {
      method: "DELETE",
    });
  },

  // Get claims
  getClaims: async () => {
    const dashboard = await apiCall("/api/admin/dashboard");
    return dashboard.claims || [];
  },

  // Create claim
  createClaim: async (claimData) => {
    return apiCall("/api/admin/claims", {
      method: "POST",
      body: JSON.stringify(claimData),
    });
  },

  // Delete claim
  deleteClaim: async (claimId) => {
    return apiCall(`/api/admin/claims/${claimId}`, {
      method: "DELETE",
    });
  },

  // Get analytics
  getAnalytics: async () => {
    return apiCall("/api/analytics");
  },

  // Get comprehensive analytics
  getComprehensiveAnalytics: async () => {
    const dashboard = await apiCall("/api/admin/dashboard");
    return dashboard.analytics || {};
  },
};

// ============================================================================
// CATALOG ENDPOINTS (Policies & Recommendations)
// ============================================================================

export const catalogService = {
  // Get all policies
  getPolicies: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/api/policies${params ? `?${params}` : ""}`);
  },

  // Get single policy
  getPolicy: async (policyId) => {
    return apiCall(`/api/policies/${policyId}`);
  },

  // Create policy
  createPolicy: async (policyData) => {
    return apiCall("/api/policies", {
      method: "POST",
      body: JSON.stringify(policyData),
    });
  },

  // Update policy
  updatePolicy: async (policyId, policyData) => {
    return apiCall(`/api/policies/${policyId}`, {
      method: "PUT",
      body: JSON.stringify(policyData),
    });
  },

  // Delete policy
  deletePolicy: async (policyId) => {
    return apiCall(`/api/policies/${policyId}`, {
      method: "DELETE",
    });
  },

  // Get policy types
  getPolicyTypes: async () => {
    const policies = await catalogService.getPolicies();
    const types = [...new Set((policies || []).map((policy) => policy.policy_type).filter(Boolean))];
    return { types };
  },

  // Get all recommendations
  getRecommendations: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/api/recommendations${params ? `?${params}` : ""}`);
  },

  // Get single recommendation
  getRecommendation: async (recommendationId) => {
    return apiCall(`/api/catalog/recommendations/${recommendationId}`);
  },

  // Create recommendation
  createRecommendation: async (recommendationData) => {
    return apiCall("/api/catalog/recommendations", {
      method: "POST",
      body: JSON.stringify(recommendationData),
    });
  },

  // Update recommendation
  updateRecommendation: async (recommendationId, recommendationData) => {
    return apiCall(`/api/catalog/recommendations/${recommendationId}`, {
      method: "PUT",
      body: JSON.stringify(recommendationData),
    });
  },

  // Delete recommendation
  deleteRecommendation: async (recommendationId) => {
    return apiCall(`/api/catalog/recommendations/${recommendationId}`, {
      method: "DELETE",
    });
  },

  // Get recommendation categories
  getRecommendationCategories: async () => {
    return apiCall("/api/catalog/recommendation-categories");
  },

  // Get top recommendations
  getTopRecommendations: async (category = null) => {
    const params = new URLSearchParams();
    if (category) {
      params.append("category", category);
    }
    const recommendations = await catalogService.getRecommendations(
      Object.fromEntries(params.entries())
    );
    const items = Array.isArray(recommendations)
      ? recommendations
      : recommendations?.recommendations || [];
    return items.filter((item) => item.is_top_recommendation);
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
