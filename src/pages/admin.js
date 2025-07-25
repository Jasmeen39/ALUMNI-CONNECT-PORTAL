import { useState, useEffect, useCallback } from "react";
import { useAllUsers } from '../hooks/useAllUsers';
import { usePosts } from '../hooks/usePosts';
import { useEvents } from '../hooks/useEvents';
import Layout from '../components/Layout';
import CreateEventModal from "../components/CreateEventModal";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

const AdminDashboard = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const api = useApi();
  const { users, loading: usersLoading, error: usersError, refetchUsers } = useAllUsers();
  const { posts, refetchPosts, deletePost } = usePosts();
  const { events, addEvent, updateEvent, deleteEvent, refreshEvents } = useEvents();
  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [modalEventData, setModalEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const handleUserApprove = useCallback(async (userId) => {
    try {
      const response = await api.patch(`/api/users/${userId}`);
      if (response.data && response.data.success) {
        alert(`User approved successfully!`);
      }
      refetchUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      alert(`Failed to approve user: ${error.message || 'Unknown error'}`);
    }
  }, [api, refetchUsers]);
  
  const handleUserDelete = useCallback(async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/api/users/${userId}`);
        refetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  }, [api, refetchUsers]);

  const handlePostDelete = useCallback(async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/api/posts/${postId}`);
        refetchPosts();
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  }, [api, refetchPosts]);

  const handleEventEdit = useCallback((event) => {
    let formattedDate = event.date;
    try {
      if (event.date && !isNaN(new Date(event.date).getTime())) {
        const dateObj = new Date(event.date);
        formattedDate = dateObj.toISOString().slice(0, 16);
      } else {
        console.warn("Invalid date format:", event.date);
        formattedDate = "";
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      formattedDate = "";
    }

    setModalEventData({
      title: event.title,
      description: event.description,
      date: formattedDate,
      location: event.location,
    });
    setCurrentEventId(event.eventId);
    setIsEventModalOpen(true);
  }, []);

  const handleEventDelete = useCallback(async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
      } catch (error) {
        console.error("Error deleting event:", error);
        alert(error.message || "Failed to delete event");
      }
    }
  }, [deleteEvent]);

  const handleModalSubmit = useCallback(async (formData) => {
    try {
      if (currentEventId) {
        await updateEvent(currentEventId, formData);
      } else {
        await addEvent(formData);
      }
      
      setCurrentEventId(null);
      setIsEventModalOpen(false);
      refreshEvents();
    } catch (error) {
      console.error("Error handling event:", error);
      alert(`Failed to save event: ${error.message || "Unknown error"}`);
    }
  }, [currentEventId, updateEvent, addEvent, refreshEvents]);

  const handleModalChange = useCallback((e) => {
    const { name, value } = e.target;
    setModalEventData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Effect hooks
  useEffect(() => {
    let token = Cookies.get('token');
    
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
    
    if (!token) {
      try {
        token = localStorage.getItem('token');
      } catch (e) {
        console.error("Error accessing localStorage:", e);
      }
    }
    
    if (token) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const userId = payload.sub || payload.userId;
          
          const expirationTime = payload.exp * 1000;
          if (Date.now() >= expirationTime) {
            console.warn("Token is expired");
          }
          
          if (payload.role !== 'admin') {
            console.warn("User is not admin");
          }
        }
      } catch (error) {
        console.error("Token decode failed:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && !isRedirecting) {
      if (!user) {
        setIsRedirecting(true);
        router.push('/login');
        return;
      }
      
      if (user.role !== 'admin') {
        setIsRedirecting(true);
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, loading, router, isRedirecting]);

  // Early returns
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

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <main className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-maroon border-b-2 border-maroon pb-2 inline-block">
                ADMIN DASHBOARD
              </h1>
              <p className="text-gray-700 mt-4">
                Manage users, posts, and events efficiently.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-maroon mb-4">User Management</h2>
                <p className="text-gray-600 mb-4">
                  Users with "Pending Approval" status need to be approved before they can log in.
                  Click the "Approve" button to allow a user to access the system.
                </p>
                {usersLoading ? (
                  <p>Loading users...</p>
                ) : usersError ? (
                  <p>{usersError}</p>
                ) : (
                  <ul className="text-gray-600">
                    {users
                      .sort((a, b) => {
                        if (a.isApproved !== b.isApproved) {
                          return a.isApproved ? 1 : -1;
                        }
                        return a.firstName.localeCompare(b.firstName);
                      })
                      .map((user) => (
                        <li key={user.userId} className="flex justify-between items-center border-b py-2">
                          <span>
                            {user.firstName} {user.lastName} <span className="text-gray-400">({user.email})</span>
                          </span>
                          <div>
                            {!user.isApproved ? (
                              <button
                                onClick={() => handleUserApprove(user.userId)}
                                className="text-green-600"
                              >
                                Approve
                              </button>
                            ) : (
                              <button
                                className="text-gray-400 cursor-not-allowed"
                                disabled
                              >
                                Approved
                              </button>
                            )}
                            <button
                              className="text-red-600 ml-4"
                              onClick={() => handleUserDelete(user.userId)}
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-maroon mb-4">Post Management</h2>
                <ul className="text-gray-600">
                  {posts.map((post) => (
                    <li key={post.postId} className="flex justify-between items-center border-b py-2">
                      <span>{post.content.slice(0, 50)}...</span>
                      <button className="text-red-600" onClick={() => handlePostDelete(post.postId)}>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-maroon mb-4">Event Management</h2>
                <button
                  className="bg-maroon text-white px-4 py-2 rounded mb-4"
                  onClick={() => {
                    setCurrentEventId(null);
                    setModalEventData({
                      title: "",
                      description: "",
                      date: "",
                      location: "",
                    });
                    setIsEventModalOpen(true);
                  }}
                >
                  + Add Event
                </button>
                <ul className="text-gray-600">
                  {events && events.length > 0 ? (
                    events.map((event) => {
                      let displayDate = "Invalid Date";
                      try {
                        if (event.date && !isNaN(new Date(event.date).getTime())) {
                          displayDate = new Date(event.date).toLocaleString();
                        }
                      } catch (error) {
                        console.error("Error formatting date for display:", error);
                      }
                      
                      return (
                        <li key={event.eventId} className="flex justify-between items-center border-b py-2">
                          <div>
                            <span className="font-medium">{event.title}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              ({displayDate})
                            </span>
                          </div>
                          <div className="flex space-x-4">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => handleEventEdit(event)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleEventDelete(event.eventId)}
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <li className="py-2">No events found</li>
                  )}
                </ul>
              </div>
            </div>
          </main>
        </div>
      </Layout>
      {isEventModalOpen && (
        <CreateEventModal
          isOpen={isEventModalOpen}
          onClose={() => {
            setCurrentEventId(null);
            setModalEventData({
              title: "",
              description: "",
              date: "",
              location: "",
            });
            setIsEventModalOpen(false);
          }}
          onSubmit={handleModalSubmit}
          initialData={currentEventId ? modalEventData : null}
        />
      )}
    </ProtectedRoute>
  );
};

export default AdminDashboard;

