import { useContext, useEffect, useState } from "react";
import { ReportContext } from "../context/ReportContext";
import { useApi } from "./useApi";

export const useReports = () => {
  //const { reports, setReports } = useContext(ReportContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = useApi();

  // Fetch reports from API
  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get("/reports");
      setReports(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch reports");
    }
    setLoading(false);
  };

  // Add a new report
  const addReport = async (reportData) => {
    try {
      const response = await api.post("/reports", reportData);
      setReports((prev) => [response.data, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to add report");
    }
  };

  // Delete a report
  const deleteReport = async (reportId) => {
    try {
      await api.delete(`/reports/${reportId}`);
      setReports((prev) => prev.filter((report) => report.id !== reportId));
    } catch (err) {
      setError(err.message || "Failed to delete report");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return { reports, addReport, deleteReport, fetchReports, loading, error };
};
