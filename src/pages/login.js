import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're not loading and user is authenticated
    if (!loading && user) {
      // Check if user is admin and redirect accordingly
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!login) {
        throw new Error("Login function is not available!");
      }

      console.log("Login page - Attempting login for:", email);
      
      // Proceed with login - pass email and password as separate parameters
      const response = await login(email, password);

      if (!response) {
        throw new Error("Login failed. Please check your credentials.");
      }

      console.log("Login page - Login successful for:", email);
      
      // Check if user is approved
      if (response.user && response.user.isApproved === false) {
        throw new Error("Your account is pending approval. An administrator must approve your account before you can log in. Please contact the admin or wait for approval.");
      }

      // The redirect will be handled by the useEffect above
    } catch (error) {
      console.error("Login page - Login error:", error);
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maroon mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-maroon text-center mb-4">
          Alumni Connect
        </h1>

        <p className="text-gray-600 text-center mb-6">
          IIITV-ICD's Alumni Portal for networking and collaboration.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Alumni Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-maroon text-white py-3 rounded-md hover:bg-dark-maroon transition-colors font-medium relative"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="opacity-0">Login</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          New user?{" "}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Create an account
          </Link>
        </p>
        
        
      </div>
    </div>
  );
};

export default Login;
