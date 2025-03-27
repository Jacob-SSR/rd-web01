import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Set up axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to request headers if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user-storage")
      ? JSON.parse(localStorage.getItem("user-storage"))?.state?.token
      : null;
    
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication APIs
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การลงทะเบียนล้มเหลว" };
  }
};

export const loginUser = async (identity, password) => {
  try {
    const response = await apiClient.post("/auth/login", { identity, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การเข้าสู่ระบบล้มเหลว" };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การดึงข้อมูลผู้ใช้ล้มเหลว" };
  }
};

// Export the API client for use in other API modules
export default apiClient;