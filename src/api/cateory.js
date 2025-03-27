import apiClient from "./auth";

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await apiClient.get("/categories");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การดึงข้อมูลหมวดหมู่ล้มเหลว" };
  }
};

// Admin: Create a new category
export const createCategory = async (categoryData) => {
  try {
    const response = await apiClient.post("/admin/categories", categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การสร้างหมวดหมู่ล้มเหลว" };
  }
};

// Admin: Update a category
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await apiClient.patch(`/admin/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การอัปเดตหมวดหมู่ล้มเหลว" };
  }
};

// Admin: Delete a category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await apiClient.delete(`/admin/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "การลบหมวดหมู่ล้มเหลว" };
  }
};