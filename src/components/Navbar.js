import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import Cookies from "js-cookie";

const Navbar = () => {
  const { user: loggedInUser } = useUser();
  const { user: authUser, logout } = useAuth();
  const user = loggedInUser || authUser;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [decodedUser, setDecodedUser] = useState(null);
  const router = useRouter();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Decode token to get user data
  useEffect(() => {
    // Try multiple methods to get the token
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
          //console.log("Navbar - Found token in localStorage");
        }
      } catch (e) {
        console.error("Navbar - Error accessing localStorage:", e);
      }
    }
    
    if (token) {
      try {
        // Try to decode the token to get user info
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          
          // Ensure we have a userId, either from sub or userId field
          const userId = payload.sub || payload.userId;
          
          console.log("Navbar - Token decoded:", {
            userId: userId,
            role: payload.role,
            exp: new Date(payload.exp * 1000).toISOString()
          });
          
          // Set decoded user data
          setDecodedUser({
            userId: userId,
            role: payload.role,
            // Add other fields as needed
          });
        }
      } catch (error) {
        console.error("Navbar - Token decode failed:", error);
      }
    }
  }, []);

  // Log user data on component mount and when it changes
  useEffect(() => {
    console.log("Navbar - User data changed:", {
      loggedInUser,
      authUser,
      combinedUser: user,
      decodedUser,
      userKeys: user ? Object.keys(user) : []
    });
  }, [loggedInUser, authUser, user, decodedUser]);

  // Fetch users on query change with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${query}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigate to user profile
  const handleUserClick = (userId, fullName) => {
    setQuery(fullName);
    setShowDropdown(false);
    router.push(`/profile/${userId}`);
  };

  // Get user initials for profile picture
  const getUserInitials = () => {
    // First try to get initials from the decoded token user
    if (decodedUser) {
      // If we have a role, use the first letter of the role
      if (decodedUser.role) {
        return decodedUser.role.charAt(0).toUpperCase();
      }
    }
    
    // Then try the user from context
    if (!user) return '?';
    
    // Log user data for debugging
    console.log("Navbar - User data for initials:", {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      fullUser: user,
      userKeys: Object.keys(user)
    });
    
    // Try to get initials from firstName and lastName
    let firstInitial = '';
    let lastInitial = '';
    
    // Check if firstName exists and is a string
    if (user.firstName && typeof user.firstName === 'string') {
      firstInitial = user.firstName.charAt(0).toUpperCase();
    }
    
    // Check if lastName exists and is a string
    if (user.lastName && typeof user.lastName === 'string') {
      lastInitial = user.lastName.charAt(0).toUpperCase();
    }
    
    // If we have both initials, return them
    if (firstInitial && lastInitial) {
      return `${firstInitial}${lastInitial}`;
    }
    
    // If we only have first initial, return it
    if (firstInitial) {
      return firstInitial;
    }
    
    // If we only have last initial, return it
    if (lastInitial) {
      return lastInitial;
    }
    
    // If we have an email but no name, use the first letter of the email
    if (user.email && typeof user.email === 'string') {
      return user.email.charAt(0).toUpperCase();
    }
    
    // Try to get name from other possible fields
    if (user.name && typeof user.name === 'string') {
      return user.name.charAt(0).toUpperCase();
    }
    
    // Try to get username if available
    if (user.username && typeof user.username === 'string') {
      return user.username.charAt(0).toUpperCase();
    }
    
    // If we have a role, use the first letter of the role
    if (user.role && typeof user.role === 'string') {
      return user.role.charAt(0).toUpperCase();
    }
    
    // Fallback to question mark
    return '?';
  };

  return (
    <nav className="bg-maroon text-white shadow-md">
      <div className="w-full px-4 py-3 grid grid-cols-3 items-center relative">
        
        {/* Left Section - Institution Header */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-4">
            <Image
              src="/media/images.jpg"
              alt="IIITV-ICD Logo"
              width={80}
              height={80}
              className="rounded"
            />
            <div>
              <div className="text-xs font-bold leading-tight">
                INDIAN INSTITUTE OF INFORMATION TECHNOLOGY VADODARA
                <br /> INTERNATIONAL CAMPUS DIU
              </div>
              <div className="text-xs mt-1">Alumni Relations</div>
            </div>
          </Link>
        </div>

        {/* Center Section - Title */}
        <div className="relative">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-wide">Alumni Connect</h1>
            <h6 className="text-xs font-bold tracking-wide">
              Stay connected with your alma mater, share memories, and engage with
              the community.
            </h6>
          </div>
        </div>

        {/* Right Section - Search, Profile */}
        <div className="flex items-center justify-end space-x-6 relative z-10">
          
          {/* Search Bar */}
          <div ref={searchRef} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 pr-10 rounded-full bg-white text-black text-sm focus:outline-none focus:ring focus:ring-gold w-64"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
            />
            <button className="absolute right-3 text-gray-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </button>

            {/* Dropdown for search results */}
            {showDropdown && results.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white text-black border rounded shadow-lg z-50 max-h-60 overflow-y-auto">
                {results.map((user) => (
                  <div
                    key={user.userId}
                    className="p-2 cursor-pointer hover:bg-gray-200 flex items-start"
                    onClick={() =>
                      handleUserClick(
                        user.userId,
                        `${user.firstName} ${user.lastName}`
                      )
                    }
                  >
                    <div className="ml-2">
                      <p className="font-semibold">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          {(user || decodedUser) ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-700 font-semibold uppercase"
              >
                {getUserInitials()}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-md py-2 z-50">
                  <Link
                    href={decodedUser?.userId ? `/profile/${decodedUser.userId}` : "#"}
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hover:text-gold transition-colors">
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>

  );
};

export default Navbar;
