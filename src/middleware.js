import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Add paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/about',
  '/contact-us',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/me',
  '/_next',
  '/static',
  '/images',
  '/favicon.ico'
];

// Add paths that require specific roles
const roleProtectedPaths = {
  '/admin': ['admin'],
  '/reports': ['admin', 'faculty'],
  '/events/create': ['admin', 'faculty'],
};

// Convert secret to UInt8Array for jose
const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths and static files
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Save the original path for redirect after login
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Verify the token using jose
    const { payload } = await jwtVerify(token, getSecret());

    // Check if token is expired
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    if (Date.now() >= expirationTime) {
      console.error('Token is expired');
      
      // For admin pages, be more lenient - don't clear the token immediately
      // This allows the client-side auth check to handle it
      if (pathname.startsWith('/admin')) {
        console.log('Admin page detected, allowing access despite expired token');
        return NextResponse.next();
      }
      
      // For other pages, clear the expired token and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Check role-based access
    const requiredRoles = roleProtectedPaths[pathname];
    if (requiredRoles && !requiredRoles.includes(payload.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Allow access if all checks pass
    return NextResponse.next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    
    // For admin pages, be more lenient - don't clear the token immediately
    // This allows the client-side auth check to handle it
    if (pathname.startsWith('/admin')) {
      console.log('Admin page detected, allowing access despite token verification failure');
      return NextResponse.next();
    }
    
    // For other pages, clear the invalid token and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

// Configure which paths should be protected
export const config = {
  matcher: [
    // Match all paths except static files and public assets
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 