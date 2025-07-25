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
          // Don't automatically clear token and redirect
          // Let the auth context handle it
          console.warn("Event service - Unauthorized request:", error.config.url);
        }
        return Promise.reject(error);
      }
    );
  }
  return apiInstance;
};

// ✅ Create a new event
export const createEvent = async (eventData) => {
  try {
    const api = getApiInstance();
    const response = await api.post("/api/events", eventData);
    return response.data;
  } catch (error) {
    console.error("Event creation error:", error);
    throw new Error(error.response?.data?.message || "Failed to create event.");
  }
};

// ✅ Fetch all events
export const getEvents = async () => {
  try {
    const api = getApiInstance();
    const response = await api.get("/api/events");
    return response.data;
  } catch (error) {
    console.error("Event fetch error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch events.");
  }
};

// ✅ Get event by ID
export const getEventById = async (eventId) => {
  try {
    const api = getApiInstance();
    const response = await api.get(`/api/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Event fetch error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch event.");
  }
};

// ✅ Update an event
export const updateEvent = async (eventId, updatedData) => {
  try {
    const api = getApiInstance();
    const response = await api.put(`/api/events/${eventId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Event update error:", error);
    throw new Error(error.response?.data?.message || "Failed to update event.");
  }
};

// ✅ Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const api = getApiInstance();
    const response = await api.delete(`/api/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Event deletion error:", error);
    throw new Error(error.response?.data?.message || "Failed to delete event.");
  }
};

// ✅ Register for an event
export const registerForEvent = async (eventId) => {
  try {
    const api = getApiInstance();
    const response = await api.post(`/api/events/${eventId}/register`);
    return response.data;
  } catch (error) {
    console.error("Event registration error:", error);
    throw new Error(error.response?.data?.message || "Failed to register for event.");
  }
};

// ✅ Unregister from an event
export const unregisterFromEvent = async (eventId) => {
  try {
    const api = getApiInstance();
    const response = await api.delete(`/api/events/${eventId}/register`);
    return response.data;
  } catch (error) {
    console.error("Event unregistration error:", error);
    throw new Error(error.response?.data?.message || "Failed to unregister from event.");
  }
};
