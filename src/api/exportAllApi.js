// Export all API functions from different files

// Authentication
export { 
  registerUser, 
  loginUser, 
  getCurrentUser,
  default as apiClient
} from './auth';

// User management
export {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  deleteUserAccount,
  getUserChallengeHistory,
  getUserBadges,
  submitChallengeProof
} from './user';

// Challenge management
export {
  getAllChallenges,
  createChallenge,
  joinChallenge,
  submitProof,
  deleteChallenge,
  getUserChallenges,
  getUserCreatedChallenges
} from './challenge';

// Category management
export {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from './category'; // Fixed typo here - using actual filename

// Badge management
export {
  getAllBadges,
  getEligibleBadges,
  createBadge,
  updateBadge,
  deleteBadge,
  assignBadgeToUser
} from './badge';

// Admin operations
export {
  getAllUsers,
  banUser,
  unbanUser,
  checkChallengeProof
} from './admin';