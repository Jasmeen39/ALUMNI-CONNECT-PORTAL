import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { generateReport, getReports } from '../services/report.service';

const ReportsPage = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('user');
  const [reports, setReports] = useState({ user: [], alumni: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAuthorized = user?.roles?.some((role) => ['admin', 'faculty'].includes(role));

  useEffect(() => {
    if (!isAuthorized) return; // Prevent unnecessary API calls

    const fetchReports = async () => {
      try {
        setLoading(true);
        const [userReport, alumniReport] = await Promise.all([
          getReports('user'),
          getReports('alumni'),
        ]);
        setReports({ user: userReport.data, alumni: alumniReport.data });
      } catch (err) {
        setError(err.message || 'Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user, token, isAuthorized]);

  if (!user || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-maroon mb-4">
            Unauthorized Access
          </h1>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-maroon mb-6">Reports</h1>

          {/* Tabs for switching between reports */}
          <div className="flex space-x-4 border-b mb-4">
            {['user', 'alumni'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 ${
                  activeTab === tab ? 'border-b-2 border-maroon text-maroon font-bold' : 'text-gray-600'
                }`}
              >
                {tab === 'user' ? 'User Reports' : 'Alumni Reports'}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {loading ? (
            <p className="text-center text-gray-500">Loading reports...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              {reports[activeTab].length === 0 ? (
                <p className="text-gray-500">No reports found for {activeTab}.</p>
              ) : (
                reports[activeTab].map((report) => (
                  <div key={report.id} className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">{report.title}</h2>
                    <p className="text-gray-600">{report.description}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default ReportsPage;
