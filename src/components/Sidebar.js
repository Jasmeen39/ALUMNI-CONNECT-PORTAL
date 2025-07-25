import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Function to check active link
  const isActive = (path) => router.pathname === path ? 'bg-gray-200 font-semibold' : '';

  return (
    <aside className="w-64 bg-white shadow-lg p-4 h-full flex flex-col">
      <nav className="space-y-2 flex-grow">
        <Link href="/" className={`block py-2 px-4 rounded ${isActive('/')}`}>
          Home
        </Link>
        <Link href="/dashboard" className={`block py-2 px-4 rounded ${isActive('/dashboard')}`}>
          Dashboard
        </Link>
        <Link href="/profile" className={`block py-2 px-4 rounded ${isActive('/profile')}`}>
          Profile
        </Link>
        <Link href="/messages" className={`block py-2 px-4 rounded ${isActive('/messages')}`}>
          Messages
        </Link>
        <Link href="/events" className={`block py-2 px-4 rounded ${isActive('/events')}`}>
          Events
        </Link>
        <Link href="/search" className={`block py-2 px-4 rounded ${isActive('/search')}`}>
          Search
        </Link>

        {/* Reports - Only visible for admins & faculty */}
        {user?.roles?.some(role => ['admin', 'faculty'].includes(role)) && (
          <Link href="/reports" className={`block py-2 px-4 rounded ${isActive('/reports')}`}>
            Reports
          </Link>
        )}
      </nav>

      {/* Logout Button */}
      {user && (
        <button 
          onClick={logout} 
          className="mt-auto w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
