import apiClient from "./auth";

// Get all public challenges
export const getAllChallenges = async () => {
  try {
    const response = await apiClient.get("/challenges");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การดึงข้อมูลชาเลนจ์ล้มเหลว" };
  }
};

// Create a new challenge
export const createChallenge = async (challengeData) => {
  try {
    const response = await apiClient.post("/challenges", challengeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การสร้างชาเลนจ์ล้มเหลว" };
  }
};

// Join a challenge
export const joinChallenge = async (challengeId) => {
  try {
    const response = await apiClient.post(`/challenges/${challengeId}/join`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การเข้าร่วมชาเลนจ์ล้มเหลว" };
  }
};

// Submit proof for a challenge
export const submitProof = async (challengeId, formData) => {
  try {
    const response = await apiClient.post(
      `/challenges/${challengeId}/submit`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การส่งหลักฐานล้มเหลว" };
  }
};

// Cancel/delete a challenge
export const deleteChallenge = async (challengeId) => {
  try {
    const response = await apiClient.delete(`/challenges/${challengeId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การลบชาเลนจ์ล้มเหลว" };
  }
};

// Get challenges that the user has joined
export const getUserChallenges = async () => {
  try {
    const response = await apiClient.get("/user/challenges");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การดึงข้อมูลชาเลนจ์ของผู้ใช้ล้มเหลว" };
  }
};

// Get challenges created by the user
export const getUserCreatedChallenges = async () => {
  try {
    const response = await apiClient.get("/user/created-challenges");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การดึงข้อมูลชาเลนจ์ที่สร้างล้มเหลว" };
  }
};