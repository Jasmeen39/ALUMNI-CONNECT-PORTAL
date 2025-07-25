import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Skip check if on login page
    if (router.pathname === '/login') {
      return;
    }

    // Check if token exists - try multiple methods
    let token = Cookies.get('token');
    
    // If token not found in Cookies, try document.cookie
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
    
    // If still no token, try localStorage as a last resort
    if (!token) {
      try {
        token = localStorage.getItem('token');
        if (token) {
          //console.log("ProtectedRoute - Found token in localStorage");
        }
      } catch (e) {
        console.error("ProtectedRoute - Error accessing localStorage:", e);
      }
    }
    
    //console.log("ProtectedRoute - Token present:", !!token);
    
    if (token) {
      try {
        // Try to decode the token to verify it's valid
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          
          // Ensure we have a userId, either from sub or userId field
          const userId = payload.sub || payload.userId;
          
          //console.log("ProtectedRoute - Token decoded:", {
          //  userId: userId,
          //  role: payload.role,
          //  exp: new Date(payload.exp * 1000).toISOString()
          //});
        }
      } catch (error) {
        console.error("ProtectedRoute - Token decode failed:", error);
      }
    }

    // Only redirect if we're not loading and user is not authenticated
    if (!loading && !user && !isRedirecting) {
      //console.log("ProtectedRoute - No user, redirecting to login");
      setIsRedirecting(true);
      router.push('/login');
      return;
    }

    // Check role-based access if roles are specified
    if (!loading && user && allowedRoles.length > 0 && !allowedRoles.includes(user.role) && !isRedirecting) {
      console.log("ProtectedRoute - User role not allowed, redirecting to unauthorized");
      setIsRedirecting(true);
      router.push('/unauthorized');
    }
  }, [user, loading, router, allowedRoles, isRedirecting]);

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

  // Don't render anything if not authenticated
  if (!user) {
    return null;
  }

  // Don't render anything if role check fails
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
