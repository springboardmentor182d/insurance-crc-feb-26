// policyService.js
// API service layer for the Policy Catalog feature.
// All HTTP calls to the backend /api/policies endpoint are made from here.

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

/**
 * Fetch all available policies from the backend.
 * @returns {Promise<Array>} List of policy objects
 */
export const getPolicies = async () => {
  const response = await fetch(`${BASE_URL}/api/policies`);
  if (!response.ok) {
    throw new Error(`Failed to fetch policies: HTTP ${response.status}`);
  }
  return response.json();
};

/**
 * Fetch details of a single policy by ID.
 * @param {string|number} id - The policy ID
 * @returns {Promise<Object>} Single policy object
 */
export const getPolicyById = async (id) => {
  const response = await fetch(`${BASE_URL}/api/policies/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch policy ${id}: HTTP ${response.status}`);
  }
  return response.json();
};
