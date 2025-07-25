import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";

const EventDetails = () => {
  const router = useRouter();
  const { EventId } = router.query;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!EventId) return;

    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${EventId}`);
        setEvent(response.data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [EventId]);

  if (loading) return <Layout><p className="text-gray-600">Loading event...</p></Layout>;
  if (error) return <Layout><p className="text-red-500">{error}</p></Layout>;

  // Fix: Format Date Properly
  const formattedDate = event.date 
    ? new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) + " at " + new Date(event.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "Unknown Date";

  return (
    <Layout>  {/* ✅ Ensures Navbar & Footer are always visible */}
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-maroon mb-4">{event.title}</h1>
        <p className="text-gray-700">{event.description || "No description available."}</p>
        <p className="mt-4 text-gray-500"><strong>Date:</strong> {formattedDate}</p>
        <p className="text-gray-500"><strong>Location:</strong> {event.location || "TBD"}</p>
        <button 
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => router.push("/")}
        >
          Back
        </button>
      </div>
    </Layout>
  );
};

export default EventDetails;
