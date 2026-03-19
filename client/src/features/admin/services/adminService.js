import { adminService as sharedAdminService } from "../../../services/apiService";

/**
 * Admin Service Proxy
 * This module acts as a specialized interface for the Admin Dashboard,
 * leveraging the shared sharedAdminService from the core API layer.
 */

// --- OVERVIEW & ANALYTICS ---
export const getOverview = () => sharedAdminService.getOverview();
export const getAnalytics = () => sharedAdminService.getAnalytics();
export const getComprehensiveAnalytics = () => sharedAdminService.getComprehensiveAnalytics();

// --- USER MANAGEMENT ---
export const getUsers = () => sharedAdminService.getUsers();
export const createUser = (userData) => sharedAdminService.createUser(userData);
export const toggleUserStatus = (userId) => sharedAdminService.toggleUserStatus(userId);

export const deleteUser = async (userId) => {
  await sharedAdminService.deleteUser(userId);
  return true;
};

// --- FRAUD DETECTION RULES ---
export const getFraudRules = () => sharedAdminService.getFraudRules();
export const createFraudRule = (ruleData) => sharedAdminService.createFraudRule(ruleData);
export const updateFraudRule = (ruleId, ruleData) => sharedAdminService.updateFraudRule(ruleId, ruleData);
export const toggleFraudRuleStatus = (ruleId) => sharedAdminService.toggleFraudRuleStatus(ruleId);

export const deleteFraudRule = async (ruleId) => {
  await sharedAdminService.deleteFraudRule(ruleId);
  return true;
};

// --- CLAIMS MANAGEMENT ---
export const getClaims = () => sharedAdminService.getClaims();
export const createClaim = (claimData) => sharedAdminService.createClaim(claimData);

export const deleteClaim = async (claimId) => {
  await sharedAdminService.deleteClaim(claimId);
  return true;
};

// --- DEFAULT EXPORT ---
// Consolidates all named exports into a single service object
const adminService = {
  getOverview,
  getAnalytics,
  getComprehensiveAnalytics,
  getUsers,
  createUser,
  deleteUser,
  toggleUserStatus,
  getFraudRules,
  createFraudRule,
  deleteFraudRule,
  updateFraudRule,
  toggleFraudRuleStatus,
  getClaims,
  createClaim,
  deleteClaim,
};

export default adminService;