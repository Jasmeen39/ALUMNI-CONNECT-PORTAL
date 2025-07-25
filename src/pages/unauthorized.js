import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const Unauthorized = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg text-center">
          <h1 className="text-4xl font-bold text-maroon mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You do not have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-maroon text-white py-2 px-4 rounded-md hover:bg-dark-maroon transition-colors"
            >
              Return to Home
            </button>
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized; 