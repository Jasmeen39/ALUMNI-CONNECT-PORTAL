import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/search?q=${query}`);
        if (!res.ok) throw new Error("Failed to fetch results.");
        
        const data = await res.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults(); // Fetch instantly on every keypress

  }, [query]); // Runs on every `query` change

  const handleUserClick = (userId) => {
    setResults([]); // Hide dropdown
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Search Users</h1>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600"
              placeholder="Search users..."
            />

            {/* Dropdown for matched results */}
            {results.length > 0 && (
              <div className="absolute left-0 mt-2 w-full bg-white border rounded shadow-lg z-50">
                {results.map((user) => (
                  <div
                    key={user.userId}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleUserClick(user.userId)}
                  >
                    <p className="text-gray-800 font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Display error messages */}
          {loading && <p className="text-gray-500 mt-2">Searching...</p>}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
