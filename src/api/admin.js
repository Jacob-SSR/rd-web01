import apiClient from "./auth";

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/admin/users");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การดึงข้อมูลผู้ใช้ล้มเหลว" };
  }
};

// Ban a user
export const banUser = async (banData) => {
  try {
    const response = await apiClient.post("/admin/ban-user", banData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การแบนผู้ใช้ล้มเหลว" };
  }
};

// Unban a user
export const unbanUser = async (unbanData) => {
  try {
    const response = await apiClient.post("/admin/unban-user", unbanData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การยกเลิกแบนผู้ใช้ล้มเหลว" };
  }
};

// Check challenge proof
export const checkChallengeProof = async (challengeId, proofId, statusData) => {
  try {
    const response = await apiClient.patch(
      `/admin/challenges/${challengeId}/proof/${proofId}`,
      statusData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การตรวจสอบหลักฐานล้มเหลว" };
  }
};