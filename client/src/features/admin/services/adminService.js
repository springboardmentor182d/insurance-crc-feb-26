import { adminService as sharedAdminService } from "../../../services/apiService";

// ============================================
// OVERVIEW API
// ============================================
export const getOverview = async () => {
  return sharedAdminService.getOverview();
};

// ============================================
// USER APIs
// ============================================
export const getUsers = async () => {
  return sharedAdminService.getUsers();
};

export const createUser = async (userData) => {
  return sharedAdminService.createUser(userData);
};

export const deleteUser = async (userId) => {
  await sharedAdminService.deleteUser(userId);
  return true;
};

export const toggleUserStatus = async (userId) => {
  return sharedAdminService.toggleUserStatus(userId);
};

// ============================================
// FRAUD RULE APIs
// ============================================
export const getFraudRules = async () => {
  return sharedAdminService.getFraudRules();
};

export const createFraudRule = async (ruleData) => {
  return sharedAdminService.createFraudRule(ruleData);
};

export const deleteFraudRule = async (ruleId) => {
  await sharedAdminService.deleteFraudRule(ruleId);
  return true;
};

export const updateFraudRule = async (ruleId, ruleData) => {
  return sharedAdminService.updateFraudRule(ruleId, ruleData);
};

export const toggleFraudRuleStatus = async (ruleId) => {
  return sharedAdminService.toggleFraudRuleStatus(ruleId);
};

// ============================================
// CLAIMS APIs
// ============================================
export const getClaims = async () => {
  return sharedAdminService.getClaims();
};

export const createClaim = async (claimData) => {
  return sharedAdminService.createClaim(claimData);
};

export const deleteClaim = async (claimId) => {
  await sharedAdminService.deleteClaim(claimId);
  return true;
};

// ============================================
// ANALYTICS API
// ============================================
export const getAnalytics = async () => {
  return sharedAdminService.getAnalytics();
};

export const getComprehensiveAnalytics = async () => {
  return sharedAdminService.getComprehensiveAnalytics();
};

const adminService = {
  getOverview,
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
  getAnalytics,
  getComprehensiveAnalytics,
};

export default adminService;

