// hooks/useUsers.js
import { useState, useEffect, useCallback, useRef } from "react";
import { useApi } from "./useApi";
import { useAuth } from "@/context/AuthContext";

export const useAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi();
  const { user } = useAuth();
  const isMounted = useRef(true);
  const lastFetchTime = useRef(0);

  const fetchUsers = useCallback(async () => {
    if (!isMounted.current) return;
    
    // Don't fetch if not authenticated
    if (!user) {
      setLoading(false);
      return;
    }
    
    // Prevent rapid refetches (minimum 1 second between fetches)
    const now = Date.now();
    if (now - lastFetchTime.current < 1000) {
      return;
    }
    lastFetchTime.current = now;
    
    setLoading(true);
    try {
      const response = await api.get("/api/users");
      
      if (!response.data) {
        throw new Error("No users data received");
      }

      if (isMounted.current) {
        setUsers(response.data);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to fetch users.");
        setUsers([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [api, user]);

  useEffect(() => {
    isMounted.current = true;
    fetchUsers();

    return () => {
      isMounted.current = false;
    };
  }, [fetchUsers]);

  const refetchUsers = useCallback(() => {
    if (isMounted.current) {
      fetchUsers();
    }
  }, [fetchUsers]);

  return { users, loading, error, refetchUsers };
};
