import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('User not authenticated');
  return { Authorization: `Bearer ${token}` };
};

// ✅ Generate a new report
export const generateReport = async (reportData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reports`, reportData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate report.');
  }
};

// ✅ Fetch all reports
export const getReports = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reports.');
  }
};

// ✅ Fetch reports by category (user, alumni, faculty)
export const getReportsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports?category=${category}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reports by category.');
  }
};

// ✅ Delete a specific report
export const deleteReport = async (reportId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/reports/${reportId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete report.');
  }
};

// ✅ Download a report as PDF
export const downloadReport = async (reportId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports/${reportId}/download`, {
      headers: getAuthHeaders(),
      responseType: 'blob', // Important for handling file downloads
    });

    // Create a blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report-${reportId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to download report.');
  }
};
