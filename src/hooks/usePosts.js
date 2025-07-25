import { useEffect, useState, useRef } from "react";
import { usePost } from "../context/PostContext";
import { useApi } from "./useApi";

export const usePosts = () => {
  const { posts, setPosts, addPost, deletePost } = usePost();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = useApi();
  const isMountedRef = useRef(true);
  const lastFetchTimeRef = useRef(Date.now());

  //console.log("usePosts context:", { posts, setPosts, addPost, deletePost });

  // Fetch posts from API
  const fetchPosts = async () => {
    // Rate limiting - don't fetch if less than 2 seconds since last fetch
    if (Date.now() - lastFetchTimeRef.current < 2000) {
      return;
    }

    if (!isMountedRef.current) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/posts");
      if (!isMountedRef.current) return;

      if (Array.isArray(response.data)) {
        setPosts((prevPosts) => [...response.data]);
      } else {
        throw new Error("Invalid response format");
      }
      lastFetchTimeRef.current = Date.now();
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Error fetching posts:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch posts");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Initial fetch and setup auto-refresh
  useEffect(() => {
    isMountedRef.current = true;
    fetchPosts();

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      if (isMountedRef.current) {
        fetchPosts();
      }
    }, 5000);

    // Cleanup
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  const refetchPosts = () => {
    fetchPosts();
  };

  return { posts, setPosts, addPost, deletePost, fetchPosts, loading, error, refetchPosts };
};

