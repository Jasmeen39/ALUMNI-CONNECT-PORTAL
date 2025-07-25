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

// ✅ Fetch user profile
export const getProfile = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const api = getApiInstance();
    const response = await api.get(`/api/profile/${userId}`);
    
    if (!response.data) {
      throw new Error("No profile data received");
    }

    return response.data;
  } catch (error) {
    console.error("Profile fetch error:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data?.message || `Failed to fetch profile: ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response received from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || "Failed to fetch profile");
    }
  }
};

// ✅ Update user profile
export const updateProfile = async (profileData) => {
  try {
    if (!profileData?.userId) {
      throw new Error("User ID is required for updating profile");
    }
    
    const api = getApiInstance();
    const response = await api.put(`/api/profile/${profileData.userId}`, profileData);
    
    if (!response.data) {
      throw new Error("No response data received");
    }

    return response.data;
  } catch (error) {
    console.error("Profile update error:", error);
    if (error.response) {
      throw new Error(error.response.data?.message || `Failed to update profile: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error(error.message || "Failed to update profile");
    }
  }
};

// ✅ Delete user profile
export const deleteProfile = async () => {
  try {
    const api = getApiInstance();
    const response = await api.delete(`/api/profile`);
    return response.data;
  } catch (error) {
    console.error("Profile delete error:", error);
    if (error.response) {
      throw new Error(error.response.data?.message || `Failed to delete profile: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error(error.message || "Failed to delete profile");
    }
  }
};

// ✅ Upload profile picture
export const uploadProfilePicture = async (imageData) => {
  try {
    const api = getApiInstance();
    const response = await api.post(`/api/profile/upload`, imageData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Profile picture upload error:", error);
    if (error.response) {
      throw new Error(error.response.data?.message || `Failed to upload profile picture: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error(error.message || "Failed to upload profile picture");
    }
  }
};

// ✅ Search user profiles
export const searchProfiles = async (query) => {
  try {
    if (!query) {
      throw new Error("Search query is required");
    }

    const api = getApiInstance();
    const response = await api.get(`/api/profile/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Profile search error:", error);
    if (error.response) {
      throw new Error(error.response.data?.message || `Failed to search profiles: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error(error.message || "Failed to search profiles");
    }
  }
};
