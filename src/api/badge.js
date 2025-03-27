import apiClient from "./auth";

// Get all badges
export const getAllBadges = async () => {
  try {
    const response = await apiClient.get("/badges");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การดึงข้อมูลตรารางวัลล้มเหลว" };
  }
};

// Get badges that the user is eligible for
export const getEligibleBadges = async () => {
  try {
    const response = await apiClient.get("/user/badges/eligible");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การดึงข้อมูลตรารางวัลที่มีสิทธิ์รับล้มเหลว" };
  }
};

// Admin: Create a new badge
export const createBadge = async (badgeData) => {
  try {
    const response = await apiClient.post("/admin/badges", badgeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การสร้างตรารางวัลล้มเหลว" };
  }
};

// Admin: Update a badge
export const updateBadge = async (badgeId, badgeData) => {
  try {
    const response = await apiClient.patch(`/admin/badges/${badgeId}`, badgeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การอัปเดตตรารางวัลล้มเหลว" };
  }
};

// Admin: Delete a badge
export const deleteBadge = async (badgeId) => {
  try {
    const response = await apiClient.delete(`/admin/badges/${badgeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การลบตรารางวัลล้มเหลว" };
  }
};

// Admin: Assign a badge to a user
export const assignBadgeToUser = async (assignData) => {
  try {
    const response = await apiClient.post("/admin/badges/assign", assignData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การมอบตรารางวัลล้มเหลว" };
  }
};