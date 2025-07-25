import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useApi } from "./useApi";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, loading, setLoading } = context;
  const api = useApi();
 
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get("/api/auth/me");
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return { user, loading };
};
