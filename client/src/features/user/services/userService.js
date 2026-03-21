import { catalogService } from '../../../services/apiService';

export const userService = {
  getPolicies: (filters = {}) => catalogService.getPolicies(filters),
  getRecommendations: (filters = {}) => catalogService.getRecommendations(filters),
  getTopRecommendations: (category = null) => catalogService.getTopRecommendations(category),
};

export default userService;
