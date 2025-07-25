import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    headers: { 'Content-Type': 'application/json' },
  });

  api.interceptors.request.use((config) => {
    let token = Cookies.get('token');
    
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
    
    if (!token) {
      try {
        token = localStorage.getItem('token');
      } catch (e) {
        console.error("Error accessing localStorage:", e);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  });

  useEffect(() => {
    const checkAuth = async () => {
      if (router.pathname === '/login') {
        setLoading(false);
        return;
      }

      let token = Cookies.get('token');
      
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
      
      if (!token) {
        try {
          token = localStorage.getItem('token');
        } catch (e) {
          console.error("Error accessing localStorage:", e);
        }
      }
  
      if (!token) {
        setLoading(false);
        return;
      }
  
      try {
        let decodedUser = null;
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const userId = payload.sub || payload.userId;
            
            decodedUser = {
              userId: userId,
              role: payload.role,
            };
          }
        } catch (decodeError) {
          console.error("Token decode failed:", decodeError);
        }

        if (decodedUser && decodedUser.role === 'admin') {
          setUser(decodedUser);
        }

        try {
          const { data } = await api.get('/api/auth/me');
          setUser(data);
          setError(null);
        } catch (apiError) {
          console.error("API auth check failed:", apiError);
          
          if (router.pathname.startsWith('/admin') && decodedUser && decodedUser.role === 'admin') {
            setError(null);
          } else {
            if (apiError.response?.status === 401 && !router.pathname.startsWith('/admin')) {
              Cookies.remove('token');
              localStorage.removeItem('token');
              setUser(null);
            }
            setError(apiError.response?.data?.message || 'Authentication failed');
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (error.response?.status === 401 && !router.pathname.startsWith('/admin')) {
          Cookies.remove('token');
          localStorage.removeItem('token');
          setUser(null);
        }
        setError(error.response?.data?.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, [router.pathname]);

  const register = async (userData) => {
    try {
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.role) {
        throw new Error('Missing required fields: firstName, lastName, email, password, and role are required');
      }
      
      const { data } = await api.post('/api/auth/register', userData);
      if (!data.token) {
        throw new Error('No token received from registration');
      }
      
      Cookies.set('token', data.token, { 
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      
      localStorage.setItem('token', data.token);
      
      setUser(data.user);
      setError(null);
      
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      
      if (!data.token) {
        throw new Error('No token received from login');
      }
      
      Cookies.set('token', data.token, { 
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      
      localStorage.setItem('token', data.token);
      
      setUser(data.user);
      setError(null);
      
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
