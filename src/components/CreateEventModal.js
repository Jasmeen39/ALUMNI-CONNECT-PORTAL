import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";

const CreateEventModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const { user } = useAuth();
  const api = useApi();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      
      let formattedDate = initialData.date || "";
      try {
        if (initialData.date && !isNaN(new Date(initialData.date).getTime())) {
          const dateObj = new Date(initialData.date);
          formattedDate = dateObj.toISOString().slice(0, 16);
        } else {
          console.warn("Invalid date format in initialData:", initialData.date);
        }
      } catch (error) {
        console.error("Error formatting date from initialData:", error);
      }
      
      setDate(formattedDate);
      setLocation(initialData.location || "");
    } else {
      resetForm();
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user?.userId) {
      setError("User not authenticated. Please log in again.");
      setLoading(false);
      return;
    }

    if (!date) {
      setError("Date is required");
      setLoading(false);
      return;
    }

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        setError("Invalid date format. Please select a valid date and time.");
        setLoading(false);
        return;
      }
    } catch (dateError) {
      console.error("Error validating date:", dateError);
      setError("Invalid date format. Please select a valid date and time.");
      setLoading(false);
      return;
    }

    const eventData = {
      title,
      description,
      date,
      location,
      organizerId: user.userId,
    };

    try {
      if (typeof onSubmit === 'function') {
        await onSubmit(eventData);
        resetForm();
        onClose();
      } else {
        const response = await api.post('/api/events', eventData);
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error("Failed to create event:", error);
      setError(error.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
    setError("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">{initialData ? "Edit Event" : "Create Event"}</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
              {error}
            </div>
          )}
          <input
            type="text"
            className="w-full border p-2 rounded mb-3"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />

          <textarea
            className="w-full border p-2 rounded mb-3"
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />

          <input
            type="datetime-local"
            className="w-full border p-2 rounded mb-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="text"
            className="w-full border p-2 rounded mb-3"
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            className="bg-maroon text-white py-2 px-4 rounded-md mt-3 w-full relative"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="opacity-0">{initialData ? "Update Event" : "Create Event"}</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              initialData ? "Update Event" : "Create Event"
            )}
          </button>
        </form>

        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="mt-2 text-gray-500 underline"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateEventModal;
