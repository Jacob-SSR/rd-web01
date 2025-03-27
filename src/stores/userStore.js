import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

const userStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
      error: null,
      
      // Login
      login: async (identity, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/login`, { 
            identity, 
            password 
          });
          
          const { token, user } = response.data;
          
          // Set auth header for future requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
          
          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Login failed"
          });
          throw error;
        }
      },
      
      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/register`, userData);
          
          const { token, user } = response.data;
          
          // Set auth header for future requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
          
          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Registration failed"
          });
          throw error;
        }
      },
      
      // Logout
      logout: () => {
        // Remove auth header
        delete axios.defaults.headers.common["Authorization"];
        
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },
      
      // Get current user
      getCurrentUser: async () => {
        const { token } = get();
        if (!token) return;
        
        try {
          // Set auth header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          const response = await axios.get(`${API_URL}/auth/me`);
          const { user } = response.data;
          
          set({
            user,
            isAuthenticated: true
          });
          
          return user;
        } catch (error) {
          console.error("Failed to fetch current user:", error);
          // If token is invalid, logout
          get().logout();
        }
      },
      
      // Update user profile
      updateProfile: async (profileData, profileImage) => {
        set({ isLoading: true, error: null });
        try {
          // Create form data for file upload
          const formData = new FormData();
          formData.append("firstname", profileData.firstname);
          formData.append("lastname", profileData.lastname);
          
          if (profileImage) {
            formData.append("profileImage", profileImage);
          }
          
          const response = await axios.patch(
            `${API_URL}/user/update-profile`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }
          );
          
          set({
            user: { ...get().user, ...response.data.user },
            isLoading: false
          });
          
          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Profile update failed"
          });
          throw error;
        }
      },
      
      // Update password
      updatePassword: async (oldPassword, newPassword, confirmPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.patch(`${API_URL}/user/update-password`, {
            oldPassword,
            newPassword,
            confirmPassword
          });
          
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Password update failed"
          });
          throw error;
        }
      },
      
      // Delete account
      deleteAccount: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.delete(`${API_URL}/user/delete-account`);
          
          // Logout after account deletion
          get().logout();
          
          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Account deletion failed"
          });
          throw error;
        }
      },
      
      // Clear errors
      clearError: () => set({ error: null })
    }),
    {
      name: "user-storage",
      getStorage: () => localStorage,
    }
  )
);

export const useStore = userStore;

// Initialize axios interceptor for auth
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      userStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default userStore;