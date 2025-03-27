import apiClient from "./auth";

// User profile APIs
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/user/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การดึงข้อมูลโปรไฟล์ล้มเหลว" };
  }
};

export const updateUserProfile = async (formData) => {
  try {
    const response = await apiClient.patch("/user/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การอัปเดตโปรไฟล์ล้มเหลว" };
  }
};

export const updateUserPassword = async (passwords) => {
  try {
    const response = await apiClient.patch("/user/update-password", passwords);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การเปลี่ยนรหัสผ่านล้มเหลว" };
  }
};

export const deleteUserAccount = async () => {
  try {
    const response = await apiClient.delete("/user/delete-account");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การลบบัญชีล้มเหลว" };
  }
};

// User challenge history and badges
export const getUserChallengeHistory = async () => {
  try {
    const response = await apiClient.get("/user/challenge-history");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "การดึงประวัติการทำชาเลนจ์ล้มเหลว" }
    );
  }
};

export const getUserBadges = async () => {
  try {
    const response = await apiClient.get("/user/badges");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การดึงข้อมูลตรารางวัลล้มเหลว" };
  }
};

// Submit challenge proof
export const submitChallengeProof = async (challengeId, formData) => {
  try {
    const response = await apiClient.patch(
      `/user/challenges/${challengeId}/submit`,
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
