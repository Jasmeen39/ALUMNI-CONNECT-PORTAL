import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";
import EventCard from "../components/EventCard";
import MessageCard from "../components/MessageCard";
import Chat from "../components/Chat";
import ProtectedRoute from "../components/ProtectedRoute";
import { usePosts } from "../hooks/usePosts";
import { useEvent } from "../context/EventContext";
import { useMessages } from "../hooks/useMessages";
import { useUser } from "../hooks/useUser";
import CreatePostModal from "../components/CreatePostModal";
import CreateEventModal from "../components/CreateEventModal";

const Home = () => {
  const { posts, setPosts } = usePosts();
  const { events, loading: eventsLoading, fetchEvents, addEvent } = useEvent();
  const { messages, fetchMessages } = useMessages();
  const { user } = useUser();
  
  // State for modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Chat state
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Function to open chat
  const openChat = (userId) => {
    const readTimestamps = JSON.parse(localStorage.getItem("readTimestamps") || "{}");
    readTimestamps[userId] = new Date().toISOString();
    localStorage.setItem("readTimestamps", JSON.stringify(readTimestamps));
    setSelectedMessage(userId);
  };

  // Auto-refresh messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Function to close chat
  const closeChat = () => {
    setSelectedMessage(null);
  };

  // Function to update post list
  const handlePostAdded = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // Function to handle event modal close
  const handleEventModalClose = () => {
    setIsEventModalOpen(false);
    // Only fetch events if the modal was actually open
    if (isEventModalOpen) {
      fetchEvents();
    }
  };

  // Function to handle event submission
  const handleEventSubmit = async (eventData) => {
    try {
      console.log("Submitting event from faculty homepage:", eventData);
      // Use the addEvent function from the EventContext
      await addEvent(eventData);
      // Refresh events after adding
      fetchEvents();
      // Close the modal
      setIsEventModalOpen(false);
    } catch (error) {
      console.error("Error creating event:", error);
      alert(`Failed to create event: ${error.message || "Unknown error"}`);
    }
  };

  // Function to fetch search results
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    fetchResults();
  }, [query]);

  // Function to start a chat
  const handleStartChat = (user) => {
    setSelectedMessage(user);
    setShowSearch(false);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-6">
          <div className="grid grid-cols-12 gap-4 w-full">
            
            {/* Events Panel */}
            <div className="col-span-3 bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-semibold text-maroon mb-4">Upcoming Events</h2>
              {user?.role === "faculty" && (
                <button
                  onClick={() => setIsEventModalOpen(true)}
                  className="w-full bg-maroon text-white py-2 px-4 rounded-md mb-4"
                >
                  Create Event
                </button>
              )}
              {eventsLoading ? (
                <div className="flex justify-center items-center py-4">
                  <div className="w-6 h-6 border-2 border-maroon border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : Array.isArray(events) ? (
                events.length > 0 ? (
                  events
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((event) => <EventCard key={event.eventId} event={event} />)
                ) : (
                  <p className="text-gray-600 text-center">No upcoming events.</p>
                )
              ) : (
                <p className="text-red-500">Error loading events</p>
              )}
            </div>

            {/* Center Panel - Posts */}
            <div className="col-span-6 bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-maroon">Recent Posts</h2>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="bg-maroon text-white py-2 px-4 rounded-md hover:bg-maroon-600"
                >
                  Create Post
                </button>
              </div>
              {Array.isArray(posts) ? (
                posts.length > 0 ? (
                  posts.map((post) => <PostCard key={post.postId} post={post} />)
                ) : (
                  <p className="text-gray-600 text-center">No posts available yet.</p>
                )
              ) : (
                <p className="text-red-500">Error loading posts</p>
              )}
            </div>

            {/* Right Panel - Messages */}
            <div className="col-span-3 bg-white shadow-md rounded-lg p-4 h-screen overflow-y-auto">
              {/* Search Popup */}
              {showSearch && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-5 rounded-lg shadow-lg w-80">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Search Users</h3>

                    {/* Search Bar */}
                    <div ref={searchRef} className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="px-4 py-2 pr-10 rounded-full bg-white text-black text-sm focus:outline-none focus:ring focus:ring-gold w-full"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                      />
                      <button className="absolute right-3 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z" />
                        </svg>
                      </button>

                      {/* Dropdown for search results */}
                      {showDropdown && results.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white text-black border rounded shadow-lg z-50 max-h-60 overflow-y-auto">
                          {results.map((user) => (
                            <div
                              key={user.userId}
                              className="p-2 cursor-pointer hover:bg-gray-200 flex items-start"
                              onClick={() => handleStartChat(user)}
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

                    {/* Close Button */}
                    <button
                      onClick={() => setShowSearch(false)}
                      className="mt-4 w-full py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Messages List */}
              {!selectedMessage ? (
                <>
                  <h2 className="text-lg font-semibold text-maroon mb-4">Your Messages</h2>
                  <button
                    onClick={() => setShowSearch(true)}
                    className="w-full bg-maroon text-white py-2 rounded-lg mb-4"
                  >
                    Start New Chat
                  </button>

                  {/* Use MessageCard for displaying messages */}
                  <div className="overflow-y-auto max-h-[85vh]">
                    {Array.isArray(messages) && messages.length > 0 ? (
                      <MessageCard
                      messages={messages}
                      onClick={openChat}
                      readTimestamps={JSON.parse(localStorage.getItem("readTimestamps") || "{}")}
                    />
                    
                    ) : (
                      <p className="text-gray-600 text-center">No new messages.</p>
                    )}
                  </div>
                </>
              ) : (
                /* Chat Panel - Replaces Messages When Open */
                <div className="h-full bg-white shadow-lg rounded-lg transition-transform duration-300 ease-in-out">
                  {user ? (
                    <Chat
                      userId={user.userId}
                      receiver={selectedMessage}
                      onClose={() => setSelectedMessage(null)}
                      refreshMessages={fetchMessages}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Loading user data...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Modals */}
        {isPostModalOpen && (
          <CreatePostModal
            isOpen={isPostModalOpen}
            onClose={() => setIsPostModalOpen(false)}
            onPostAdded={handlePostAdded}
          />
        )}
        {isEventModalOpen && (
          <CreateEventModal
            isOpen={isEventModalOpen}
            onClose={handleEventModalClose}
            onSubmit={handleEventSubmit}
          />
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default Home;
