// src/stores/userStore.js
// Implementing timeout handling and better error management
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Create a custom axios instance with timeout configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

const userStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
      error: null,
      
      // Login - improved with timeout handling
      login: async (identity, password, signal) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(`/auth/login`, 
            { identity, password },
            { signal } // Pass AbortController signal for timeout
          );
          
          const { token, user } = response.data;
          
          // Set auth header for future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
          
          return response.data;
        } catch (error) {
          let errorMessage = "Login failed";
          
          if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
            errorMessage = "Login timed out. Please try again.";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (!navigator.onLine) {
            errorMessage = "No internet connection. Please check your network.";
          }
          
          set({
            isLoading: false,
            error: errorMessage
          });
          
          throw error;
        }
      },
      
      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(`/auth/register`, userData);
          
          const { token, user } = response.data;
          
          // Set auth header for future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
        delete api.defaults.headers.common["Authorization"];
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
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          const response = await api.get(`/auth/me`);
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
      
      // Other functions remain the same but use the 'api' instance instead of axios directly
      // ...
      
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      userStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default userStore;