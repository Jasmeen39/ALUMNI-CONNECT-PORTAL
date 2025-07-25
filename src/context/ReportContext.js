import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Fetch reports from API on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error.response?.data || error);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  // Generate a new user activity report
  const generateUserReport = async () => {
    try {
      const response = await api.post('/reports/user-report');
      setReports((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error('Error generating user report:', error.response?.data || error);
    }
  };

  // Generate an alumni-specific report
  const generateAlumniReport = async () => {
    try {
      const response = await api.post('/reports/alumni-report');
      setReports((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error('Error generating alumni report:', error.response?.data || error);
    }
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        loading,
        generateUserReport,
        generateAlumniReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => useContext(ReportContext);
