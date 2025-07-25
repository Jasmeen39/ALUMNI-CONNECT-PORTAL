import Layout from "../components/Layout";
import EventCard from "../components/EventCard";
import { useEvents } from "../hooks/useEvents";

const Events = () => {
  const { events } = useEvents(); // Get all events

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-maroon text-center mb-6">Upcoming Events</h1>
          <div className="space-y-6">
            {events.length > 0 ? (
              events.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p className="text-gray-600 text-center">No events available.</p>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Events;
