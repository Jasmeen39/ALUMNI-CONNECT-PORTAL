import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
    localStorage.setItem('token', response.data.token); // Store token securely
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed.');
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed.');
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user.');
  }
};

export const logout = () => {
  localStorage.removeItem('token'); // Clear token on logout
};
