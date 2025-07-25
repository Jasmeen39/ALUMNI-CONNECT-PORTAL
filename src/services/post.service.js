import axios from "axios";
import Cookies from "js-cookie";

// Create a singleton API instance
let apiInstance = null;

const getApiInstance = () => {
  if (!apiInstance) {
    apiInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to set token
    apiInstance.interceptors.request.use((config) => {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle token expiration
    apiInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          Cookies.remove("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }
  return apiInstance;
};

// ✅ Create a new post
export const createPost = async (postData) => {
  try {
    const api = getApiInstance();
    const response = await api.post("/api/posts", postData);
    return response.data;
  } catch (error) {
    console.error("Post creation error:", error);
    throw new Error(error.response?.data?.message || "Failed to create post.");
  }
};

// ✅ Fetch all posts
export const getPosts = async () => {
  try {
    const api = getApiInstance();
    const response = await api.get("/api/posts");
    return response.data;
  } catch (error) {
    console.error("Post fetch error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch posts.");
  }
};

// ✅ Delete a post
export const deletePost = async (postId) => {
  try {
    const api = getApiInstance();
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Post deletion error:", error);
    throw new Error(error.response?.data?.message || "Failed to delete post.");
  }
};

// ✅ Update a post
export const updatePost = async (postId, updatedData) => {
  try {
    const api = getApiInstance();
    const response = await api.put(`/api/posts/${postId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Post update error:", error);
    throw new Error(error.response?.data?.message || "Failed to update post.");
  }
};

// ✅ Like a post
export const likePost = async (postId) => {
  try {
    const api = getApiInstance();
    const response = await api.post(`/api/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error("Post like error:", error);
    throw new Error(error.response?.data?.message || "Failed to like post.");
  }
};

// ✅ Unlike a post
export const unlikePost = async (postId) => {
  try {
    const api = getApiInstance();
    const response = await api.post(`/api/posts/${postId}/unlike`);
    return response.data;
  } catch (error) {
    console.error("Post unlike error:", error);
    throw new Error(error.response?.data?.message || "Failed to unlike post.");
  }
};

// ✅ Add a comment to a post
export const addComment = async (postId, commentData) => {
  try {
    const api = getApiInstance();
    const response = await api.post(`/api/posts/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error("Comment creation error:", error);
    throw new Error(error.response?.data?.message || "Failed to add comment.");
  }
};

// ✅ Get post comments
export const getPostComments = async (postId) => {
  try {
    const api = getApiInstance();
    const response = await api.get(`/api/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error("Comments fetch error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch comments.");
  }
};
