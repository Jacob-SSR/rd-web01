// src/api/auth.js
// Improved API client with timeout and error handling
import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Set up axios instance with base URL and timeout
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
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

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject({ 
          response: { 
            data: { message: "เซิร์ฟเวอร์ไม่ตอบสนอง โปรดลองอีกครั้งในภายหลัง" } 
          } 
        });
      }
      
      if (!navigator.onLine) {
        return Promise.reject({ 
          response: { 
            data: { message: "ไม่มีการเชื่อมต่ออินเทอร์เน็ต โปรดตรวจสอบการเชื่อมต่อของคุณ" } 
          } 
        });
      }
      
      return Promise.reject({ 
        response: { 
          data: { message: "เกิดข้อผิดพลาดในการเชื่อมต่อ โปรดลองอีกครั้ง" } 
        } 
      });
    }
    
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