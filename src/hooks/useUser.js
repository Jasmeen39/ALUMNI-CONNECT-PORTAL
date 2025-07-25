import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

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
      // Try multiple methods to get the token
      let token = Cookies.get("token");
      
      // If token not found in Cookies, try document.cookie
      if (!token) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith('token=')) {
            token = cookie.substring('token='.length);
            break;
          }
        }
      }
      
      // If still no token, try localStorage as a last resort
      if (!token) {
        try {
          token = localStorage.getItem('token');
          if (token) {
            console.log("useUser - Found token in localStorage");
          }
        } catch (e) {
          console.error("useUser - Error accessing localStorage:", e);
        }
      }
      
      if (token) {
        // Log token for debugging
        console.log("useUser - Token found:", token.substring(0, 20) + "...");
        
        // Set the Authorization header with the token
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    });

    // Add response interceptor to handle token expiration
    apiInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Don't redirect in the interceptor - let the component handle it
          console.warn("useUser - Unauthorized request");
        }
        return Promise.reject(error);
      }
    );
  }
  return apiInstance;
};

export const useUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            // Skip fetch if on login page
            if (router.pathname === "/login") {
                setLoading(false);
                return;
            }

            // Try multiple methods to get the token
            let token = Cookies.get("token");
            
            // If token not found in Cookies, try document.cookie
            if (!token) {
              const cookies = document.cookie.split(';');
              for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith('token=')) {
                  token = cookie.substring('token='.length);
                  break;
                }
              }
            }
            
            // If still no token, try localStorage as a last resort
            if (!token) {
              try {
                token = localStorage.getItem('token');
                if (token) {
                  console.log("useUser - Found token in localStorage");
                }
              } catch (e) {
                console.error("useUser - Error accessing localStorage:", e);
              }
            }

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // First try to decode the token to get basic user info
                let decodedUser = null;
                try {
                  const tokenParts = token.split('.');
                  if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    
                    // Ensure we have a userId, either from sub or userId field
                    const userId = payload.sub || payload.userId;
                    
                    decodedUser = {
                      userId: userId,
                      role: payload.role,
                      // Add other fields as needed
                    };
                    
                    // Log token info for debugging
                    console.log("useUser - Token decoded successfully:", {
                      userId: userId,
                      role: payload.role,
                      exp: new Date(payload.exp * 1000).toISOString()
                    });
                  }
                } catch (decodeError) {
                  console.error("useUser - Token decode failed:", decodeError);
                }

                // If we have a decoded user with admin role, set it immediately
                // This ensures admin stays logged in even if API call fails
                if (decodedUser && decodedUser.role === 'admin') {
                  console.log("useUser - Setting admin user from decoded token");
                  setUser(decodedUser);
                }

                const api = getApiInstance();
                const response = await api.get("/api/auth/me");
                
                // Ensure we have all required user fields
                const userData = response.data;
                if (!userData.firstName || !userData.lastName) {
                    console.warn("useUser - Incomplete user data received:", userData);
                }
                
                // Set user data with defaults for missing fields
                setUser({
                    ...userData,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    userId: userData.userId || null,
                    role: userData.role || 'user',
                    email: userData.email || '',
                });
                
                setError(null);
            } catch (err) {
                console.error("useUser - Error fetching user:", err);
                setError(err.message || "Failed to fetch user.");
                
                // For admin pages, keep the decoded user if available
                if (router.pathname.startsWith('/admin') && decodedUser && decodedUser.role === 'admin') {
                  console.log("useUser - Using decoded admin token due to API failure");
                  setError(null);
                } else {
                  setUser(null);
                  
                  // Only redirect if not on login page and not on admin page
                  if (!router.pathname.startsWith("/login") && !router.pathname.startsWith("/admin")) {
                      router.push("/login");
                  }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router.pathname]);

    const memoizedUser = useMemo(() => user, [user]);
    const memoizedLoading = useMemo(() => loading, [loading]);
    const memoizedError = useMemo(() => error, [error]);

    return {
        user: memoizedUser,
        loading: memoizedLoading,
        error: memoizedError
    };
};
