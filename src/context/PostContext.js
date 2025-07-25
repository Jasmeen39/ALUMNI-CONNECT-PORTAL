import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    headers: { "Content-Type": "application/json" },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/posts");
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Add a new post
  const addPost = async (postData) => {
    try {
      const response = await api.post("/api/posts", postData);
      setPosts((prevPosts) => [response.data, ...prevPosts]);
    } catch (error) {
      console.error("Error adding post:", error.response?.data || error);
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((p) => p.postId !== postId));
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error);
    }
  };

  // Update a post
  const updatePost = async (postId, updatedContent) => {
    try {
      const response = await api.put(`/api/posts/${postId}`, { content: updatedContent });
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.postId === postId ? { ...p, content: response.data.content } : p))
      );
    } catch (error) {
      console.error("Error updating post:", error.response?.data || error);
    }
  };

  return (
    <PostContext.Provider value={{ posts, setPosts, loading, addPost, deletePost, updatePost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  //console.log("PostContext Data:", context); // ✅ Debugging log

  if (!context) throw new Error("usePost must be used within a PostProvider");

  return context;
};
