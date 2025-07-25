import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useMemo } from "react";

export const useApi = () => {
  const router = useRouter();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Attach token to every request
    instance.interceptors.request.use(
      (config) => {
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
              console.log("Found token in localStorage");
            }
          } catch (e) {
            console.error("Error accessing localStorage:", e);
          }
        }
        
        if (token) {
          // Verify token is valid before using it
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              
              // Ensure we have a userId, either from sub or userId field
              const userId = payload.sub || payload.userId;
              
              // Check if token is expired
              const expirationTime = payload.exp * 1000; // Convert to milliseconds
              if (Date.now() >= expirationTime) {
                console.warn("Token is expired, clearing it");
                Cookies.remove('token', { path: '/' });
                localStorage.removeItem('token');
                token = null;
              } else {
                config.headers.Authorization = `Bearer ${token}`;
                //console.log("API request with valid token:", config.url);
              }
            } else {
              console.warn("Invalid token format, clearing it");
              Cookies.remove('token', { path: '/' });
              localStorage.removeItem('token');
              token = null;
            }
          } catch (error) {
            console.error("Error verifying token:", error);
            Cookies.remove('token', { path: '/' });
            localStorage.removeItem('token');
            token = null;
          }
        }
        
        if (!token) {
          console.log("API request without token:", config.url);
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle API responses & errors globally
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const status = error.response.status;

          // Unauthorized - only redirect if not already on login page
          if (status === 401) {
            console.warn("Unauthorized request detected:", error.config.url);
            
            // Check if we're on an admin page
            const isAdminPage = router.pathname.startsWith("/admin");
            
            // For admin pages, don't automatically clear token or redirect
            // This prevents admin from being logged out when navigating between pages
            if (isAdminPage) {
              console.log("On admin page, not clearing token on 401");
              return Promise.reject(error);
            }
            
            // For non-admin pages, let the component handle the 401
            // This allows for more graceful handling of token expiration
            console.log("Not on admin page, letting component handle 401");
          }

          // Forbidden - user lacks permissions
          if (status === 403) {
            console.error("Access denied. You do not have permission.");
            if (!router.pathname.startsWith("/unauthorized")) {
              router.push("/unauthorized");
            }
          }

          // Handle server errors
          if (status >= 500) {
            console.error("Server error:", error.response.data);
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [router]);

  return api;
};
